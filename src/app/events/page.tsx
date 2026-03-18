import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { eventsQuery } from "@/sanity/lib/queries";

export const revalidate = 60;

type Event = {
  _id: string;
  title: string;
  location?: string;
  startDate?: string;
  summary?: string;
  slug?: string;
};

export default async function EventsPage() {
  const events = await client.fetch<Event[]>(eventsQuery);

  const now = new Date();

  const upcomingEvents = events.filter((event) => {
    if (!event.startDate) return false;
    return new Date(event.startDate) >= now;
  });

  const pastEvents = events.filter((event) => {
    if (!event.startDate) return true;
    return new Date(event.startDate) < now;
  });

  return (
    <main className="section">
      <div className="container">
        <p className="section-label">Community</p>
        <h1 className="section-title">Events</h1>
        <p className="section-text">
          Talks, seminars, workshops, and community activities organized by the
          RAISE research group.
        </p>

        <section style={{ marginTop: "2rem" }}>
          <h2 className="subsection-title">Upcoming Events</h2>

          {upcomingEvents.length === 0 ? (
            <p className="muted">No upcoming events at the moment.</p>
          ) : (
            <div className="event-list">
              {upcomingEvents.map((event) => (
                <article
                  key={event._id}
                  className="info-card event-card event-upcoming"
                >
                  <h3>
                    {event.slug ? (
                      <Link href={`/events/${event.slug}`}>{event.title}</Link>
                    ) : (
                      event.title
                    )}
                  </h3>

                  {event.startDate && (
                    <p className="event-date">
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}

                  {event.location && <p className="muted">{event.location}</p>}

                  {event.summary && (
                    <p className="event-summary">{event.summary}</p>
                  )}

                  <div className="event-badge">Upcoming Event</div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section style={{ marginTop: "3rem" }}>
          <h2 className="subsection-title">Past Events</h2>

          {pastEvents.length === 0 ? (
            <p className="muted">No past events yet.</p>
          ) : (
            <div className="event-list">
              {pastEvents.map((event) => (
                <article
                  key={event._id}
                  className="info-card event-card event-past"
                >
                  <h3>
                    {event.slug ? (
                      <Link href={`/events/${event.slug}`}>{event.title}</Link>
                    ) : (
                      event.title
                    )}
                  </h3>

                  {event.startDate && (
                    <p className="event-date">
                      {new Date(event.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}

                  {event.location && <p className="muted">{event.location}</p>}

                  {event.summary && (
                    <p className="event-summary">{event.summary}</p>
                  )}

                  <div className="event-badge">Past Event</div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
