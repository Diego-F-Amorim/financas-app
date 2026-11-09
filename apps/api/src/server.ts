import express from "express";
import { prisma } from "./lib/prisma.js";

const app = express();
const PORT = 3333;

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "funcionando" });
});

app.get("/categories", async (req, res) => {
  const categories = await prisma.category.findMany({
    where: { userId: null },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});