import { client } from "@/sanity/lib/client";
import { publicationsQuery } from "@/sanity/lib/queries";
import Link from "next/link";

export const revalidate = 60;

export default async function PublicationsPage() {
  const pubs = await client.fetch(publicationsQuery);

  return (
    <main className="section">
      <div className="container">
        <p className="section-label">Research Output</p>
        <h1 className="section-title">Publications</h1>
        <p className="section-text">
          Papers, preprints, and research artifacts from the RAISE group.
        </p>

        <div className="card-grid">
          {pubs.map((p: any) => (
            <article className="info-card" key={p._id}>
              <h3>
                {p.slug ? (
                  <Link href={`/publications/${p.slug}`}>{p.title}</Link>
                ) : (
                  p.title
                )}
              </h3>

              {p.authors?.length > 0 && (
                <p className="muted">
                  {p.authors.map((author: any, index: number) => (
                    <span key={`${author.name}-${index}`}>
                      {author.slug ? (
                        <Link href={`/members/${author.slug}`}>{author.name}</Link>
                      ) : (
                        author.name
                      )}
                      {index < p.authors.length - 1 ? ", " : ""}
                    </span>
                  ))}
                </p>
              )}

              {(p.venue || p.year) && (
                <p className="muted">
                  {p.venue || ""}
                  {p.venue && p.year ? " " : ""}
                  {p.year ? `(${p.year})` : ""}
                </p>
              )}

              {(p.paperUrl || p.codeUrl) && (
                <div
                  style={{
                    marginTop: "0.75rem",
                    display: "flex",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  {p.paperUrl && <a href={p.paperUrl}>Paper</a>}
                  {p.codeUrl && <a href={p.codeUrl}>Code</a>}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}