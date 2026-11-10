import { Router } from "express";
import { ensureAuthenticated } from "../../middlewares/ensure-authenticated.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import { getProfile, loginUser, registerUser } from "./auth.service.js";

export const authRoutes = Router();

authRoutes.post("/register", async (req, res) => {
  const data = registerSchema.parse(req.body);
  const user = await registerUser(data);
  res.status(201).json(user);
});

authRoutes.post("/login", async (req, res) => {
  const data = loginSchema.parse(req.body);
  const result = await loginUser(data);
  res.json(result);
});

authRoutes.get("/me", ensureAuthenticated, async (req, res) => {
  const user = await getProfile(req.userId);
  res.json(user);
});