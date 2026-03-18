import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { publicationBySlugQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type PublicationAuthor = {
  name: string;
  slug?: string | null;
};

type PublicationDetail = {
  title: string;
  authors?: PublicationAuthor[];
  venue?: string;
  year?: number;
  abstract?: string;
  paperUrl?: string;
  codeUrl?: string;
};

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const pub = await client.fetch<PublicationDetail | null>(publicationBySlugQuery, { slug });

  if (!pub) {
    return (
      <main className="section">
        <div className="container">
          <h1>Publication not found</h1>
        </div>
      </main>
    );
  }

  const authors = pub.authors ?? [];

  return (
    <main className="section">
      <div className="container article-shell">
        <Link href="/publications" className="back-link">
          ← Back to Publications
        </Link>

        <header className="article-header">
          <p className="article-kicker">Publication</p>
          <h1 className="article-title">{pub.title}</h1>

          {authors.length > 0 && (
            <p className="article-lead">
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
        </header>

        <section className="metadata-card">
          <h3 style={{ marginTop: 0 }}>Publication Metadata</h3>

          <div className="metadata-grid">
            <div className="metadata-label">Venue</div>
            <div className="metadata-value">
              {pub.venue ? <span className="publication-venue">{pub.venue}</span> : "—"}
            </div>

            <div className="metadata-label">Year</div>
            <div className="metadata-value">
              {pub.year ? <span className="publication-year">({pub.year})</span> : "—"}
            </div>
          </div>

          <div className="link-row">
            {pub.paperUrl && (
              <a href={pub.paperUrl} className="primary-button">
                Paper
              </a>
            )}
            {pub.codeUrl && (
              <a href={pub.codeUrl} className="secondary-link">
                Code
              </a>
            )}
          </div>
        </section>

        {pub.abstract && (
          <section className="article-body" style={{ marginTop: "1.5rem" }}>
            <h3 style={{ marginTop: 0 }}>Abstract</h3>
            <p>{pub.abstract}</p>
          </section>
        )}
      </div>
    </main>
  );
}
