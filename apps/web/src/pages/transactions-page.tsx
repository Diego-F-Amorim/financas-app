import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import { currentMonth, formatCurrency, formatDate } from "../lib/format";
import { useCurrentWorkspace } from "../hooks/use-current-workspace";
import { MonthPicker } from "../components/month-picker";
import { TransactionForm } from "../components/transaction-form";
import type { Transaction } from "../types";

export function TransactionsPage() {
  const workspace = useCurrentWorkspace();
  const queryClient = useQueryClient();
  const [month, setMonth] = useState(currentMonth);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {
    data: transactions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transactions", workspace.id, month],
    queryFn: () =>
      api<Transaction[]>(`/workspaces/${workspace.id}/transactions?month=${month}`),
  });

  const deleteTransaction = useMutation({
    mutationFn: (id: string) =>
      api(`/workspaces/${workspace.id}/transactions/${id}`, { method: "DELETE" }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["transactions", workspace.id] }),
  });

  function handleDelete(transaction: Transaction) {
    if (window.confirm(`Excluir "${transaction.description}"?`)) {
      deleteTransaction.mutate(transaction.id);
    }
  }

  const income = transactions
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expense;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Lançamentos</h1>
        <MonthPicker month={month} onChange={setMonth} />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <SummaryCard label="Receitas" value={income} valueClass="text-emerald-400" />
        <SummaryCard label="Despesas" value={expense} valueClass="text-red-400" />
        <SummaryCard
          label="Saldo"
          value={balance}
          valueClass={balance >= 0 ? "text-slate-100" : "text-red-400"}
        />
      </div>

      <button
        onClick={() => setIsFormOpen((open) => !open)}
        className="w-full rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400 sm:w-auto"
      >
        {isFormOpen ? "Cancelar" : "+ Novo lançamento"}
      </button>

      {isFormOpen && (
        <TransactionForm workspaceId={workspace.id} onSuccess={() => setIsFormOpen(false)} />
      )}

      {isLoading && <p className="text-slate-400">Carregando...</p>}
      {isError && <p className="text-red-400">Erro ao carregar os lançamentos.</p>}

      {!isLoading && !isError && transactions.length === 0 && (
        <p className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-400">
          Nenhum lançamento neste mês.
        </p>
      )}

      {transactions.length > 0 && (
        <ul className="divide-y divide-slate-800 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          {transactions.map((transaction) => (
            <li key={transaction.id} className="flex items-center gap-3 px-4 py-3">
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: transaction.category.color ?? "#64748b" }}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{transaction.description}</p>
                <p className="text-sm text-slate-400">
                  {transaction.category.name} · {formatDate(transaction.date)}
                </p>
              </div>
              <span
                className={`shrink-0 font-semibold ${
                  transaction.type === "INCOME" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {transaction.type === "INCOME" ? "+" : "−"} {formatCurrency(transaction.amount)}
              </span>
              <button
                onClick={() => handleDelete(transaction)}
                aria-label={`Excluir ${transaction.description}`}
                className="rounded-md px-2 py-1 text-slate-500 transition hover:bg-slate-800 hover:text-red-400"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
  valueClass: string;
}

function SummaryCard({ label, value, valueClass }: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-1 text-xl font-bold ${valueClass}`}>{formatCurrency(value)}</p>
    </div>
  );
}