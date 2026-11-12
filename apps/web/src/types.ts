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

export type TransactionType = "INCOME" | "EXPENSE";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string | null;
  icon: string | null;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number; // centavos
  type: TransactionType;
  date: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
    color: string | null;
  };
}