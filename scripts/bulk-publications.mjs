#!/usr/bin/env node
/**
 * Bulk create/update publications in Sanity from a JSON file.
 *
 *   node scripts/bulk-publications.mjs data/publications.json            # dry run (default)
 *   node scripts/bulk-publications.mjs data/publications.json --apply    # actually write
 *
 * Writing requires a token with Editor rights:
 *   export SANITY_WRITE_TOKEN=sk...
 *
 * Each entry is matched to an existing publication by `slug` (or by a slug derived
 * from `title`). Existing docs are PATCHED with only the fields you supply, so
 * omitting a field leaves the current value untouched. Unmatched entries are created.
 */
import { createClient } from "@sanity/client";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";

const PROJECT_ID = "441lyunu";
const DATASET = "production";
const API_VERSION = "2026-03-15";

const FIELDS = ["title", "venue", "location", "keywords", "year", "paperUrl", "codeUrl", "abstract"];

const [, , file, ...flags] = process.argv;
const apply = flags.includes("--apply");

if (!file) {
  console.error("usage: node scripts/bulk-publications.mjs <file.json> [--apply]");
  process.exit(1);
}

const token = process.env.SANITY_WRITE_TOKEN;
if (apply && !token) {
  console.error("error: --apply needs SANITY_WRITE_TOKEN to be set");
  process.exit(1);
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token,
  useCdn: false,
});

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);

const entries = JSON.parse(readFileSync(file, "utf8"));
if (!Array.isArray(entries)) {
  console.error("error: the JSON file must contain an array of publication objects");
  process.exit(1);
}

// Resolve author names/slugs to member references up front.
const members = await client.fetch(`*[_type == "member"]{_id, name, "slug": slug.current}`);
const memberBySlug = new Map(members.map((m) => [m.slug, m._id]));
const memberByName = new Map(members.map((m) => [m.name.toLowerCase(), m._id]));

function buildAuthors(authors) {
  return authors.map((author) => {
    const _key = randomUUID().replace(/-/g, "").slice(0, 12);
    if (typeof author === "object" && author?.member) {
      const id = memberBySlug.get(author.member) ?? memberByName.get(String(author.member).toLowerCase());
      if (!id) throw new Error(`unknown member "${author.member}"`);
      return { _key, _type: "reference", _ref: id };
    }
    const name = typeof author === "string" ? author : author?.name;
    if (!name) throw new Error(`author entry is missing a name: ${JSON.stringify(author)}`);
    // A bare name that matches a member becomes a proper reference, not a loose string.
    const id = memberByName.get(name.toLowerCase());
    return id ? { _key, _type: "reference", _ref: id } : { _key, _type: "externalAuthor", name };
  });
}

const slugs = entries.map((e) => e.slug ?? slugify(e.title ?? ""));
const existing = await client.fetch(
  `*[_type == "publication" && slug.current in $slugs]{_id, title, "slug": slug.current}`,
  { slugs },
);
const existingBySlug = new Map(existing.map((d) => [d.slug, d]));

const mutations = [];
const plan = [];

try {
  entries.forEach((entry, i) => {
    const slug = slugs[i];
    if (!slug) throw new Error(`entry ${i} has neither "slug" nor "title"`);

    const fields = {};
    for (const key of FIELDS) {
      if (entry[key] !== undefined) fields[key] = entry[key];
    }
    if (entry.authors !== undefined) fields.authors = buildAuthors(entry.authors);

    const match = existingBySlug.get(slug);
    const changed = Object.keys(fields);

    if (match) {
      plan.push(`  update  ${slug}\n            fields: ${changed.join(", ") || "(none)"}`);
      if (changed.length) mutations.push({ patch: { id: match._id, set: fields } });
    } else {
      if (!entry.title) throw new Error(`new entry "${slug}" needs a title`);
      plan.push(`  create  ${slug}\n            fields: ${changed.join(", ")}`);
      mutations.push({
        create: { _type: "publication", slug: { _type: "slug", current: slug }, ...fields },
      });
    }
  });
} catch (err) {
  console.error(`error: ${err.message}`);
  process.exit(1);
}

console.log(`${entries.length} entr${entries.length === 1 ? "y" : "ies"} in ${file}:\n`);
console.log(plan.join("\n"));
console.log(`\n${mutations.length} mutation(s) to send.`);

if (!apply) {
  console.log("\nDry run — nothing was written. Re-run with --apply to commit.");
  process.exit(0);
}

const result = await client.mutate(mutations);
console.log(`\nApplied. ${result.results?.length ?? mutations.length} document(s) written.`);
