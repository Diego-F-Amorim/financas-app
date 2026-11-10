import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../env.js";
import { AppError } from "../errors/app-error.js";

export const ensureAuthenticated: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Token não informado.", 401);
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    if (typeof payload === "string" || !payload.sub) {
      throw new Error();
    }
    req.userId = payload.sub;
  } catch {
    throw new AppError("Token inválido ou expirado.", 401);
  }

  next();
};