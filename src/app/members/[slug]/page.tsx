import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { memberBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { getRoleTitle } from "@/app/members/roles";

export const revalidate = 60;

export default async function MemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const member = await client.fetch(memberBySlugQuery, { slug });

  if (!member) {
    return (
      <main className="section">
        <div className="container">
          <h1>Member not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="section">
      <div className="container article-shell">
        <Link href="/members" className="back-link">
          ← Back to Members
        </Link>

        <div className="member-profile">
          {member.photo && (
            <img
              src={urlFor(member.photo)
                .width(320)
                .height(320)
                .fit("crop")
                .auto("format")
                .url()}
              alt={member.name}
              className="member-profile-photo"
            />
          )}

          <div>
            <p className="section-label">Member</p>
            <h1 className="section-title">{member.name}</h1>

            {member.role && (
              <p className="muted" style={{ marginBottom: "0.75rem" }}>
                {getRoleTitle(member.role)}
              </p>
            )}

            {(member.email || member.phone || member.office) && (
              <div className="member-contact">
                {member.email && (
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${member.email}`}>{member.email}</a>
                  </p>
                )}

                {member.phone && (
                  <p>
                    <strong>Phone:</strong> {member.phone}
                  </p>
                )}

                {member.office && (
                  <p>
                    <strong>Office:</strong> {member.office}
                  </p>
                )}
              </div>
            )}

            {(member.googleScholar ||
              member.dblp ||
              member.orcid ||
              member.github ||
              member.website ||
              member.linkedin) && (
              <div className="member-links">
                {member.googleScholar && (
                  <a href={member.googleScholar} target="_blank" rel="noreferrer">
                    Google Scholar
                  </a>
                )}
                {member.dblp && (
                  <a href={member.dblp} target="_blank" rel="noreferrer">
                    DBLP
                  </a>
                )}
                {member.orcid && (
                  <a href={member.orcid} target="_blank" rel="noreferrer">
                    ORCID
                  </a>
                )}
                {member.github && (
                  <a href={member.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                )}
                {member.website && (
                  <a href={member.website} target="_blank" rel="noreferrer">
                    Website
                  </a>
                )}
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                )}
              </div>
            )}

            {member.bio && (
              <div className="detail-card" style={{ marginTop: "1rem" }}>
                <p>{member.bio}</p>
              </div>
            )}
          </div>
        </div>

        {member.publications?.length > 0 && (
          <section style={{ marginTop: "2rem" }}>
            <p className="section-label">Research Output</p>
            <h2 className="section-title" style={{ fontSize: "1.8rem" }}>
              Publications
            </h2>

            <div className="card-grid">
              {member.publications.map((pub: any) => (
                <article className="info-card" key={pub._id}>
                  <h3>
                    {pub.slug ? (
                      <Link href={`/publications/${pub.slug}`}>{pub.title}</Link>
                    ) : (
                      pub.title
                    )}
                  </h3>

                  <p className="muted">
                    {pub.venue} {pub.year ? `(${pub.year})` : ""}
                  </p>

                  <div className="publication-links">
                    {pub.paperUrl && <a href={pub.paperUrl}>Paper</a>}
                    {pub.codeUrl && <a href={pub.codeUrl}>Code</a>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
