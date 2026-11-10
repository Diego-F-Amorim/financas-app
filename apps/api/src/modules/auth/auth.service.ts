import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";
import jwt from "jsonwebtoken";
import { env } from "../../env.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";

const publicUserSelect = {
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
} as const;

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
    select: publicUserSelect,
  });

  return user;
}

export async function loginUser({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  const passwordMatches = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    throw new AppError("Email ou senha inválidos.", 401);
  }

  const token = jwt.sign({}, env.JWT_SECRET, {
    subject: user.id,
    expiresIn: "7d",
  });

  return {
    token,
    user: { id: user.id, name: user.name, email: user.email },
  };
}

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: publicUserSelect,
  });

  if (!user) {
    throw new AppError("Usuário não encontrado.", 404);
  }

  return user;
}