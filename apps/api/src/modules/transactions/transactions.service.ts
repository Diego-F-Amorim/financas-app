import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../errors/app-error.js";
import type {
  CreateTransactionInput,
  ListTransactionsFilters,
  UpdateTransactionInput,
} from "./transactions.schemas.js";

const categoryInclude = {
  category: { select: { id: true, name: true, color: true } },
} as const;

function monthRange(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const start = new Date(Date.UTC(year, monthNumber - 1, 1));
  const end = new Date(Date.UTC(year, monthNumber, 1));
  return { start, end };
}

async function assertValidCategory(
  workspaceId: string,
  categoryId: string,
  type: "INCOME" | "EXPENSE",
) {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      OR: [{ workspaceId: null }, { workspaceId }],
    },
  });

  if (!category) {
    throw new AppError("Categoria não encontrada.", 404);
  }
  if (category.type !== type) {
    throw new AppError("A categoria não corresponde ao tipo do lançamento.", 422);
  }
}

export async function listTransactions(
  workspaceId: string,
  filters: ListTransactionsFilters,
) {
  const range = filters.month ? monthRange(filters.month) : undefined;

  return prisma.transaction.findMany({
    where: {
      workspaceId,
      type: filters.type,
      categoryId: filters.categoryId,
      date: range ? { gte: range.start, lt: range.end } : undefined,
    },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    include: categoryInclude,
  });
}

export async function getTransaction(workspaceId: string, id: string) {
  const transaction = await prisma.transaction.findFirst({
    where: { id, workspaceId },
    include: categoryInclude,
  });

  if (!transaction) {
    throw new AppError("Lançamento não encontrado.", 404);
  }
  return transaction;
}

export async function createTransaction(
  workspaceId: string,
  userId: string,
  data: CreateTransactionInput,
) {
  await assertValidCategory(workspaceId, data.categoryId, data.type);

  const { date, ...rest } = data;

  return prisma.transaction.create({
    data: {
      ...rest,
      date: new Date(date),
      workspaceId,
      createdById: userId,
    },
    include: categoryInclude,
  });
}

export async function updateTransaction(
  workspaceId: string,
  id: string,
  data: UpdateTransactionInput,
) {
  const existing = await getTransaction(workspaceId, id);

  if (data.type || data.categoryId) {
    await assertValidCategory(
      workspaceId,
      data.categoryId ?? existing.categoryId,
      data.type ?? existing.type,
    );
  }

  const { date, ...rest } = data;

  return prisma.transaction.update({
    where: { id: existing.id },
    data: {
      ...rest,
      date: date ? new Date(date) : undefined,
    },
    include: categoryInclude,
  });
}

export async function deleteTransaction(workspaceId: string, id: string) {
  const existing = await getTransaction(workspaceId, id);
  await prisma.transaction.delete({ where: { id: existing.id } });
}