import { client } from "@/sanity/lib/client";
import { newsQuery } from "@/sanity/lib/queries";
import Link from "next/link";

export const revalidate = 60;

export default async function NewsPage() {
  const news = await client.fetch(newsQuery);

  return (
    <main className="section">
      <div className="container">
        <p className="section-label">Updates</p>
        <h1 className="section-title">News</h1>
        <p className="section-text">
          Announcements, research highlights, seminars, and group updates.
        </p>

        <div className="card-grid">
          {news.map((item: any) => (
            <article className="info-card" key={item._id}>
              <h3>
                {item.slug ? (
                  <Link href={`/news/${item.slug}`}>{item.title}</Link>
                ) : (
                  item.title
                )}
              </h3>
              <p className="muted">{item.publishedAt}</p>
              <p>{item.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}