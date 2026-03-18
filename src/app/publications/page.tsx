import { client } from "@/sanity/lib/client";
import { publicationsQuery } from "@/sanity/lib/queries";
import Link from "next/link";

export const revalidate = 60;

type PublicationAuthor = {
  name: string;
  slug?: string | null;
};

type Publication = {
  _id: string;
  title: string;
  authors?: PublicationAuthor[];
  venue?: string;
  year?: number;
  paperUrl?: string;
  codeUrl?: string;
  slug?: string;
};

export default async function PublicationsPage() {
  const pubs = await client.fetch<Publication[]>(publicationsQuery);
  const sortedPubs = [...pubs].sort((left, right) => (right.year ?? 0) - (left.year ?? 0));
  const publicationsByYear = sortedPubs.reduce<Record<string, Publication[]>>((groups, publication) => {
    let yearKey = "Other";

    if (publication.year) {
      yearKey = publication.year >= 2023 ? publication.year.toString() : "Before 2023";
    }

    if (!groups[yearKey]) {
      groups[yearKey] = [];
    }

    groups[yearKey].push(publication);
    return groups;
  }, {});

  const yearSections = Object.entries(publicationsByYear).sort(([leftYear], [rightYear]) => {
    if (leftYear === "Other") {
      return 1;
    }

    if (rightYear === "Other") {
      return -1;
    }

    if (leftYear === "Before 2023") {
      return rightYear === "Other" ? -1 : 1;
    }

    if (rightYear === "Before 2023") {
      return leftYear === "Other" ? 1 : -1;
    }

    return Number(rightYear) - Number(leftYear);
  });

  return (
    <main className="section">
      <div className="container">
        <p className="section-label">Research Output</p>
        <h1 className="section-title">Publications</h1>
        <p className="section-text">
          Papers, preprints, and research artifacts from the RAISE group.
        </p>

        <div className="publication-year-sections">
          {yearSections.map(([year, publications]) => (
            <section key={year} className="publication-year-section">
              <h2 className="section-subtitle">{year}</h2>

              <div className="publication-list">
                {publications.map((p) => {
                  const authors = p.authors ?? [];

                  return (
                    <article className="info-card publication-list-item" key={p._id}>
                      <h3>
                        {p.slug ? (
                          <Link href={`/publications/${p.slug}`}>{p.title}</Link>
                        ) : (
                          p.title
                        )}
                      </h3>

                      {authors.length > 0 && (
                        <p className="muted">
                          {authors.map((author, index: number) => (
                            <span key={`${author.name}-${index}`}>
                              {author.slug ? (
                                <Link href={`/members/${author.slug}`}>{author.name}</Link>
                              ) : (
                                author.name
                              )}
                              {index < authors.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </p>
                      )}

                      {(p.venue || p.year) && (
                        <p className="publication-meta">
                          <span className="publication-venue">
                            {p.venue || "Publication"}
                            {p.year ? ` (${p.year})` : ""}
                          </span>
                        </p>
                      )}

                      {(p.paperUrl || p.codeUrl) && (
                        <div className="publication-links">
                          {p.paperUrl && <a href={p.paperUrl}>Paper</a>}
                          {p.codeUrl && <a href={p.codeUrl}>Code</a>}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
