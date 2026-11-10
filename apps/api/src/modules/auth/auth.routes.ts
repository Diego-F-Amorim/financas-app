import { Router } from "express";
import { registerSchema } from "./auth.schemas.js";
import { registerUser } from "./auth.service.js";

export const authRoutes = Router();

authRoutes.post("/register", async (req, res) => {
  const data = registerSchema.parse(req.body);
  const user = await registerUser(data);
  res.status(201).json(user);
});