import type { MemberRole } from "../generated/prisma/enums.js";

declare global {
  namespace Express {
    interface Request {
      userId: string;            // preenchido pelo ensureAuthenticated
      workspaceId: string;       // preenchido pelo ensureWorkspaceAccess
      workspaceRole: MemberRole; // preenchido pelo ensureWorkspaceAccess
    }
  }
}

export {};