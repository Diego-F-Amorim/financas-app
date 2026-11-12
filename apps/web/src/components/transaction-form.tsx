import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "../lib/api";
import { parseCurrencyToCents, todayISO } from "../lib/format";
import type { Category, Transaction, TransactionType } from "../types";
import { FormField } from "./form-field";

const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"]),
  description: z.string().trim().min(1, "Informe a descrição.").max(120),
  amount: z.string().regex(/^\d+([.,]\d{1,2})?$/, "Valor inválido. Ex.: 35,90"),
  date: z.iso.date("Data inválida."),
  categoryId: z.string().min(1, "Escolha uma categoria."),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  workspaceId: string;
  onSuccess: () => void;
}

export function TransactionForm({ workspaceId, onSuccess }: TransactionFormProps) {
  const queryClient = useQueryClient();
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api<Category[]>("/categories"),
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      description: "",
      amount: "",
      date: todayISO(),
      categoryId: "",
    },
  });

  const type = useWatch({ control, name: "type" });
  const filteredCategories = categories.filter((category) => category.type === type);

  const createTransaction = useMutation({
    mutationFn: (data: TransactionFormData) =>
      api<Transaction>(`/workspaces/${workspaceId}/transactions`, {
        method: "POST",
        body: JSON.stringify({ ...data, amount: parseCurrencyToCents(data.amount) }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", workspaceId] });
      onSuccess();
    },
  });

  async function onSubmit(data: TransactionFormData) {
    setServerError(null);
    try {
      await createTransaction.mutateAsync(data);
    } catch (error) {
      setServerError(error instanceof ApiError ? error.message : "Não foi possível salvar.");
    }
  }

  function selectType(newType: TransactionType) {
    setValue("type", newType);
    setValue("categoryId", "");
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-6"
    >
      <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-800 p-1">
        {(["EXPENSE", "INCOME"] as const).map((option) => {
          const isActive = type === option;
          const activeClass =
            option === "EXPENSE" ? "bg-red-500 text-white" : "bg-emerald-500 text-slate-950";

          return (
            <button
              key={option}
              type="button"
              onClick={() => selectType(option)}
              className={`rounded-md py-2 text-sm font-medium transition ${
                isActive ? activeClass : "text-slate-400 hover:text-slate-100"
              }`}
            >
              {option === "EXPENSE" ? "Despesa" : "Receita"}
            </button>
          );
        })}
      </div>

      <FormField
        id="description"
        label="Descrição"
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="amount"
          label="Valor (R$)"
          inputMode="decimal"
          placeholder="0,00"
          error={errors.amount?.message}
          {...register("amount")}
        />
        <FormField
          id="date"
          label="Data"
          type="date"
          error={errors.date?.message}
          {...register("date")}
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="mb-1 block text-sm font-medium text-slate-300">
          Categoria
        </label>
        <select
          id="categoryId"
          className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-slate-100 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
          {...register("categoryId")}
        >
          <option value="">Selecione...</option>
          {filteredCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-400">{errors.categoryId.message}</p>
        )}
      </div>

      {serverError && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
      >
        {isSubmitting ? "Salvando..." : "Salvar lançamento"}
      </button>
    </form>
  );
}