import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, "JWT_SECRET precisa ter pelo menos 32 caracteres."),
  PORT: z.coerce.number().default(3333),
  WEB_URL: z.url().default("http://localhost:5173"),
});

export const env = envSchema.parse(process.env);