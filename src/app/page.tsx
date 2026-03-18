import { client } from "@/sanity/lib/client";
import { newsQuery } from "@/sanity/lib/queries";
import Link from "next/link";

type NewsItem = {
  _id: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  slug?: string;
};

export default async function HomePage() {
  const news = await client.fetch<NewsItem[]>(newsQuery);
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const latestNews = news
    .filter((item) => item.publishedAt && new Date(item.publishedAt) >= threeDaysAgo)
    .slice(0, 3);

  return (
    <main>
      <section className="hero-section">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">Ho Chi Minh City University of Technology</p>
            <h1 className="hero-title">
              Reasoning in Artificial Intelligence and Software Engineering
            </h1>
            <p className="hero-text">
              RAISE studies trustworthy AI, software engineering, formal methods,
              code intelligence, multilingual AI, and rigorous evaluation of intelligent systems.
            </p>

            <div className="hero-actions">
              <Link href="/research" className="primary-button">
                Explore Research
              </Link>
              <Link href="/members" className="secondary-link">
                Meet the Team
              </Link>
            </div>

            <div className="footer-contact-tabs">
              <Link href="/" className="footer-tab">
                Facebook
              </Link>
              <Link href="/" className="footer-tab">
                Email Contact
              </Link>
              <Link href="/" className="footer-tab">
                Zalo
              </Link>
              <Link href="/" className="footer-tab">
                X
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <h3>Research Themes</h3>
            <ul>
              <li>LLMs for Software Engineering</li>
              <li>Formal Reasoning and Verification</li>
              <li>Secure and Trustworthy AI Systems</li>
              <li>Multilingual and Responsible AI</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="section-label">Overview</p>
          <h2 className="section-title">What we do</h2>
          <p className="section-text">
            We build methods, tools, and datasets for reliable intelligent systems,
            with emphasis on reasoning, evaluation, and real-world software engineering applications.
          </p>

          <div className="card-grid">
            <div className="info-card">
              <h3>Research</h3>
              <p>Core directions, themes, and ongoing projects.</p>
              <Link href="/research">View research</Link>
            </div>

            <div className="info-card">
              <h3>Publications</h3>
              <p>Papers, preprints, venues, and artifacts.</p>
              <Link href="/publications">View publications</Link>
            </div>

            <div className="info-card">
              <h3>News</h3>
              <p>Announcements, seminars, and recent updates.</p>
              {latestNews.length > 0 ? (
                <div className="homepage-news-list">
                  {latestNews.map((item) => (
                    <Link
                      key={item._id}
                      href={item.slug ? `/news/${item.slug}` : "/news"}
                      className="homepage-news-item"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="muted">No news from the last 3 days.</p>
              )}
              <Link href="/news">View news</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
