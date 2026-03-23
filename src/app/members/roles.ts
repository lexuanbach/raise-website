export const ROLE_OPTIONS = [
  {
    value: "lab-head",
    title: "Lab Head",
    section: "Core Members",
  },
  {
    value: "core-member",
    title: "Core Member",
    section: "Core Members",
  },
  {
    value: "student",
    title: "Student",
    section: "Students",
  },
  {
    value: "collaborator",
    title: "Collaborator",
    section: "Collaborators",
  },
] as const;

const ROLE_OPTION_MAP = new Map<string, (typeof ROLE_OPTIONS)[number]>(
  ROLE_OPTIONS.map((role) => [role.value, role]),
);

export function getRoleTitle(role?: string) {
  return role ? ROLE_OPTION_MAP.get(role)?.title ?? role : "";
}

export function getRoleSection(role?: string) {
  return role ? ROLE_OPTION_MAP.get(role)?.section ?? "Core Members" : "Core Members";
}
