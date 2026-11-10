import type { RequestHandler } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { AppError } from "../errors/app-error.js";

const paramsSchema = z.object({
  workspaceId: z.uuid("Espaço inválido."),
});

export const ensureWorkspaceAccess: RequestHandler = async (req, res, next) => {
  const { workspaceId } = paramsSchema.parse(req.params);

  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: req.userId } },
  });

  if (!membership) {
    throw new AppError("Espaço não encontrado.", 404);
  }

  req.workspaceId = workspaceId;
  req.workspaceRole = membership.role;
  next();
};