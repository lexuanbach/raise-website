import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { researchQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type ResearchDirection = {
  _id: string;
  title: string;
  shortDescription?: string;
  keywords?: string[];
  slug?: string;
};

export default async function ResearchPage() {
  const research = await client.fetch<ResearchDirection[]>(researchQuery);

  return (
    <main className="section">
      <div className="container">

        <p className="section-label">Research</p>
        <h1 className="section-title">Research Directions</h1>

        <p className="section-text">
          The RAISE group studies trustworthy AI, program analysis, and
          intelligent software systems. Our research spans theoretical
          foundations and real-world applications.
        </p>

        <div className="card-grid">
          {research.map((item) => {
            const keywords = item.keywords ?? [];

            return (
              <article className="info-card" key={item._id}>
                <h3>
                  {item.slug ? (
                    <Link href={`/research/${item.slug}`}>{item.title}</Link>
                  ) : (
                    item.title
                  )}
                </h3>

                {item.shortDescription && (
                  <p className="muted">{item.shortDescription}</p>
                )}

                {keywords.length > 0 && (
                  <div className="tag-row">
                    {keywords.map((keyword, index) => (
                      <span key={index} className="tag">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>

      </div>
    </main>
  );
}
