import { Router } from "express";
import { requireRole } from "../../middlewares/require-role.js";
import {
  createTransactionSchema,
  listTransactionsQuerySchema,
  transactionIdSchema,
  updateTransactionSchema,
} from "./transactions.schemas.js";
import {
  createTransaction,
  deleteTransaction,
  getTransaction,
  listTransactions,
  updateTransaction,
} from "./transactions.service.js";

export const transactionsRoutes = Router();

const canWrite = requireRole("OWNER", "ADMIN", "MEMBER");

transactionsRoutes.get("/", async (req, res) => {
  const filters = listTransactionsQuerySchema.parse(req.query);
  const transactions = await listTransactions(req.workspaceId, filters);
  res.json(transactions);
});

transactionsRoutes.get("/:id", async (req, res) => {
  const { id } = transactionIdSchema.parse(req.params);
  const transaction = await getTransaction(req.workspaceId, id);
  res.json(transaction);
});

transactionsRoutes.post("/", canWrite, async (req, res) => {
  const data = createTransactionSchema.parse(req.body);
  const transaction = await createTransaction(req.workspaceId, req.userId, data);
  res.status(201).json(transaction);
});

transactionsRoutes.patch("/:id", canWrite, async (req, res) => {
  const { id } = transactionIdSchema.parse(req.params);
  const data = updateTransactionSchema.parse(req.body);
  const transaction = await updateTransaction(req.workspaceId, id, data);
  res.json(transaction);
});

transactionsRoutes.delete("/:id", canWrite, async (req, res) => {
  const { id } = transactionIdSchema.parse(req.params);
  await deleteTransaction(req.workspaceId, id);
  res.status(204).send();
});