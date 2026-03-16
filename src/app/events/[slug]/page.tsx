import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { eventBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await client.fetch(eventBySlugQuery, { slug });

  if (!event) {
    return (
      <main className="section">
        <div className="container">
          <h1>Event not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container article-shell">
        <Link href="/events" className="back-link">
          ← Back to Events
        </Link>

        <header className="article-header">
          <p className="article-kicker">Event</p>
          <h1 className="article-title">{event.title}</h1>

          <div className="article-meta">
            {event.startDate && (
              <span>
                {new Date(event.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}

            {event.endDate && (
              <span>
                {" – "}
                {new Date(event.endDate).toLocaleDateString("en-US")}
              </span>
            )}

            {event.location && <span> · {event.location}</span>}
          </div>
        </header>

        {event.poster && (
          <img
            src={urlFor(event.poster)
              .width(1200)
              .height(700)
              .fit("crop")
              .auto("format")
              .url()}
            alt={event.title}
            className="article-image"
          />
        )}

        {event.summary && (
          <p className="article-lead">
            {event.summary}
          </p>
        )}

        {event.description && (
          <section className="article-body">
            <p>{event.description}</p>
          </section>
        )}
      </div>
    </main>
  );
}