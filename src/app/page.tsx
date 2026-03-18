import { client } from "@/sanity/lib/client";
import { eventsQuery, newsQuery, publicationsQuery } from "@/sanity/lib/queries";
import Link from "next/link";

type NewsItem = {
  _id: string;
  title: string;
  excerpt?: string;
  publishedAt?: string;
  slug?: string;
};

type EventItem = {
  _id: string;
  title: string;
  startDate?: string;
  slug?: string;
};

type PublicationItem = {
  _id: string;
  title: string;
  year?: number;
  slug?: string;
};

export default async function HomePage() {
  const [news, events, publications] = await Promise.all([
    client.fetch<NewsItem[]>(newsQuery),
    client.fetch<EventItem[]>(eventsQuery),
    client.fetch<PublicationItem[]>(publicationsQuery),
  ]);
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const now = new Date();
  const currentYear = now.getFullYear();

  const latestNews = news
    .filter((item) => item.publishedAt && new Date(item.publishedAt) >= threeDaysAgo)
    .slice(0, 3);
  const upcomingEvents = events
    .filter((event) => event.startDate && new Date(event.startDate) >= now)
    .slice(0, 3);
  const latestPublications = publications
    .filter((publication) => publication.year === currentYear)
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
              <h3>Events</h3>
              <p>Upcoming talks, seminars, workshops, and community activities.</p>
              {upcomingEvents.length > 0 ? (
                <div className="homepage-news-list">
                  {upcomingEvents.map((event) => (
                    <Link
                      key={event._id}
                      href={event.slug ? `/events/${event.slug}` : "/events"}
                      className="homepage-news-item"
                    >
                      {event.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="muted">No upcoming events right now.</p>
              )}
              <Link href="/events">View events</Link>
            </div>

            <div className="info-card">
              <h3>Publications</h3>
              <p>Papers, preprints, venues, and artifacts from {currentYear}.</p>
              {latestPublications.length > 0 ? (
                <div className="homepage-news-list">
                  {latestPublications.map((publication) => (
                    <Link
                      key={publication._id}
                      href={publication.slug ? `/publications/${publication.slug}` : "/publications"}
                      className="homepage-news-item"
                    >
                      {publication.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="muted">No publications from {currentYear} yet.</p>
              )}
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
