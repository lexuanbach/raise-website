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
    key: "Lab Head",
    title: "Lab Head",
  },
  {
    key: "Core Members",
    title: "Core Members",
  },
  {
    key: "Students",
    title: "Students",
  },
  {
    key: "Collaborators",
    title: "Collaborators",
  },
] as const;

const ROLE_SECTION_ORDER = ROLE_SECTIONS.reduce<Record<string, number>>(
  (order, section, index) => {
    order[section.key] = index;
    return order;
  },
  {},
);

function getRoleSection(role?: string) {
  const value = role?.toLowerCase().trim() ?? "";

  if (
    value.includes("lab head") ||
    value.includes("head") ||
    value.includes("pi") ||
    value.includes("director") ||
    value.includes("principal investigator")
  ) {
    return "Lab Head";
  }

  if (
    value.includes("student") ||
    value.includes("phd") ||
    value.includes("master") ||
    value.includes("undergraduate") ||
    value.includes("undergrad")
  ) {
    return "Students";
  }

  if (
    value.includes("collaborator") ||
    value.includes("affiliate") ||
    value.includes("partner") ||
    value.includes("visitor") ||
    value.includes("adjunct")
  ) {
    return "Collaborators";
  }

  return "Core Members";
}

function MemberCard({ member }: { member: Member }) {
  return (
    <article className="member-card" key={member._id}>
      <div className="member-card-main">
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

          <p className="muted member-role">{member.role}</p>

          <div className="member-contact">
            {member.email && (
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${member.email}`} className="member-tag-text">
                  {member.email}
                </a>
              </p>
            )}

            {member.phone && (
              <p>
                <strong>Phone:</strong> <span className="member-tag-text">{member.phone}</span>
              </p>
            )}

            {member.office && (
              <p>
                <strong>Office:</strong> <span className="member-tag-text">{member.office}</span>
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
        </div>
      </div>

      {member.bio && <p className="member-bio">{member.bio}</p>}
    </article>
  );
}

export default async function MembersPage() {
  const members = await client.fetch<Member[]>(membersQuery);
  const sortedMembers = [...members].sort((left, right) => {
    const leftSection = getRoleSection(left.role);
    const rightSection = getRoleSection(right.role);

    if (leftSection !== rightSection) {
      return ROLE_SECTION_ORDER[leftSection] - ROLE_SECTION_ORDER[rightSection];
    }

    return left.name.localeCompare(right.name);
  });

  const groupedMembers = ROLE_SECTIONS.map((section) => ({
    ...section,
    members: sortedMembers.filter((member) => getRoleSection(member.role) === section.key),
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
