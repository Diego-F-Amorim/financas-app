import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";
import type { RegisterInput } from "./auth.schemas.js";

export async function registerUser({ name, email, password }: RegisterInput) {
  const normalizedEmail = email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existingUser) {
    throw new AppError("Este email já está cadastrado.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      memberships: {
        create: {
          role: "OWNER",
          workspace: {
            create: { name: "Pessoal", type: "PERSONAL" },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      memberships: {
        select: {
          role: true,
          workspace: { select: { id: true, name: true, type: true } },
        },
      },
    },
  });

  return user;
}