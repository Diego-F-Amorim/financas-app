export type WorkspaceType = "PERSONAL" | "BUSINESS";
export type MemberRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export interface Membership {
  role: MemberRole;
  workspace: {
    id: string;
    name: string;
    type: WorkspaceType;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  memberships: Membership[];
}