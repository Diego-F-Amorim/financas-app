import { prisma } from "../lib/prisma.js";

const defaultCategories = [
  // Despesas
  { name: "Alimentação", type: "EXPENSE", color: "#f97316" },
  { name: "Transporte", type: "EXPENSE", color: "#3b82f6" },
  { name: "Moradia", type: "EXPENSE", color: "#8b5cf6" },
  { name: "Saúde", type: "EXPENSE", color: "#ef4444" },
  { name: "Educação", type: "EXPENSE", color: "#06b6d4" },
  { name: "Lazer", type: "EXPENSE", color: "#ec4899" },
  { name: "Compras", type: "EXPENSE", color: "#eab308" },
  { name: "Contas", type: "EXPENSE", color: "#64748b" },
  { name: "Outros", type: "EXPENSE", color: "#a3a3a3" },
  // Receitas
  { name: "Salário", type: "INCOME", color: "#22c55e" },
  { name: "Freelance", type: "INCOME", color: "#14b8a6" },
  { name: "Investimentos", type: "INCOME", color: "#10b981" },
  { name: "Outros", type: "INCOME", color: "#a3a3a3" },
] as const;

async function main() {
  for (const category of defaultCategories) {
    const exists = await prisma.category.findFirst({
      where: { name: category.name, type: category.type, workspaceId: null },
    });

    if (!exists) {
      await prisma.category.create({ data: category });
      console.log(`✔ Criada: ${category.name} (${category.type})`);
    }
  }
  console.log("Seed finalizado!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });