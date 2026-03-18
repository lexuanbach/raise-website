import { client } from "@/sanity/lib/client";
import { membersQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import Link from "next/link";

export const revalidate = 60;

type Member = {
  _id: string;
  name: string;
  role?: string;
  bio?: string;
  photo?: unknown;
  email?: string;
  phone?: string;
  office?: string;
  googleScholar?: string;
  dblp?: string;
  orcid?: string;
  github?: string;
  website?: string;
  linkedin?: string;
  slug?: string;
};

const ROLE_SECTIONS = [
  {
    key: "lab-head",
    title: "Lab Head",
  },
  {
    key: "core-member",
    title: "Core Members",
  },
  {
    key: "student",
    title: "Students",
  },
  {
    key: "collaborator",
    title: "Collaborators",
  },
] as const;

function getRoleSection(role?: string) {
  const value = role?.toLowerCase().trim() ?? "";

  if (
    value.includes("lab head") ||
    value.includes("head") ||
    value.includes("pi") ||
    value.includes("director") ||
    value.includes("principal investigator")
  ) {
    return "lab-head";
  }

  if (
    value.includes("student") ||
    value.includes("phd") ||
    value.includes("master") ||
    value.includes("undergraduate") ||
    value.includes("undergrad")
  ) {
    return "student";
  }

  if (
    value.includes("collaborator") ||
    value.includes("affiliate") ||
    value.includes("partner") ||
    value.includes("visitor") ||
    value.includes("adjunct")
  ) {
    return "collaborator";
  }

  return "core-member";
}

function MemberCard({ member }: { member: Member }) {
  return (
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
            <p>
              <strong>Email:</strong> <a href={`mailto:${member.email}`}>{member.email}</a>
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
  );
}

export default async function MembersPage() {
  const members = await client.fetch<Member[]>(membersQuery);
  const groupedMembers = ROLE_SECTIONS.map((section) => ({
    ...section,
    members: members.filter((member) => getRoleSection(member.role) === section.key),
  })).filter((section) => section.members.length > 0);

  return (
    <main className="section">
      <div className="container">
        <p className="section-label">People</p>
        <h1 className="section-title">Members</h1>

        <div className="member-sections">
          {groupedMembers.map((section) => (
            <section key={section.key} className="member-section">
              <h2 className="section-subtitle">{section.title}</h2>
              <div className="card-grid">
                {section.members.map((member) => (
                  <MemberCard key={member._id} member={member} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
