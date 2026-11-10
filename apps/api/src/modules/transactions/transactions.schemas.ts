import { z } from "zod";

const transactionType = z.enum(["INCOME", "EXPENSE"]);

export const createTransactionSchema = z.object({
  description: z.string().trim().min(1, "Informe a descrição.").max(120),
  amount: z
    .number("O valor deve ser um número.")
    .int("O valor deve estar em centavos (número inteiro).")
    .positive("O valor deve ser maior que zero."),
  type: transactionType,
  date: z.iso.date("Data inválida. Use o formato AAAA-MM-DD."),
  categoryId: z.uuid("Categoria inválida."),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const listTransactionsQuerySchema = z.object({
  month: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Mês inválido. Use o formato AAAA-MM.")
    .optional(),
  type: transactionType.optional(),
  categoryId: z.uuid().optional(),
});

export const transactionIdSchema = z.object({
  id: z.uuid("Lançamento inválido."),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type ListTransactionsFilters = z.infer<typeof listTransactionsQuerySchema>;