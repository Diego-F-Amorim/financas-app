import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "O nome precisa ter pelo menos 2 caracteres."),
  email: z.email("Email inválido."),
  password: z
    .string()
    .min(8, "A senha precisa ter pelo menos 8 caracteres.")
    .max(72, "A senha pode ter no máximo 72 caracteres."),
});

export type RegisterInput = z.infer<typeof registerSchema>;