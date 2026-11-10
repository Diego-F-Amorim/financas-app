import type { RequestHandler } from "express";
import type { MemberRole } from "../generated/prisma/enums.js";
import { AppError } from "../errors/app-error.js";

export function requireRole(...allowedRoles: MemberRole[]): RequestHandler {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.workspaceRole)) {
      throw new AppError("Você não tem permissão para esta ação.", 403);
    }
    next();
  };
}