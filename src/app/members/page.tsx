import { client } from "@/sanity/lib/client";
import { membersQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

export const revalidate = 60;

export default async function MembersPage() {
  const members = await client.fetch(membersQuery);

  return (
    <main className="section">
      <div className="container">
        <p className="section-label">People</p>
        <h1 className="section-title">Members</h1>

        <div className="card-grid">
          {members.map((member: any) => (
            <article className="member-card" key={member._id}>

              {member.photo && (
  <img
    src={urlFor(member.photo)
      .width(240)
      .height(240)
      .fit("crop")
      .auto("format")
      .url()}
    alt={member.name}
    className="member-photo"
  />
)}

              <div className="member-info">

                <h3>
                  {member.slug ? (
                    <Link href={`/members/${member.slug}`} className="member-link">
                      {member.name}
                    </Link>
                  ) : (
                    member.name
                  )}
                </h3>

                <p className="muted" style={{ marginBottom: "0.5rem" }}>
  {member.role}
</p>

<div className="member-contact">

  {member.email && (
    <p><strong>Email:</strong> <a href={`mailto:${member.email}`}>{member.email}</a></p>
  )}

  {member.phone && (
    <p><strong>Phone:</strong> {member.phone}</p>
  )}

  {member.office && (
    <p><strong>Office:</strong> {member.office}</p>
  )}

</div>

{(member.googleScholar ||
  member.dblp ||
  member.orcid ||
  member.github ||
  member.website ||
  member.linkedin) && (

  <div className="member-links">

    {member.googleScholar && <a href={member.googleScholar}>Google Scholar</a>}
    {member.dblp && <a href={member.dblp}>DBLP</a>}
    {member.orcid && <a href={member.orcid}>ORCID</a>}
    {member.github && <a href={member.github}>GitHub</a>}
    {member.website && <a href={member.website}>Website</a>}
    {member.linkedin && <a href={member.linkedin}>LinkedIn</a>}

  </div>
)}

                {member.bio && <p>{member.bio}</p>}

              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}