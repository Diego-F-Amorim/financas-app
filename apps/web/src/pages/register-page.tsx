import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, Navigate } from "react-router";
import { useAuth } from "../hooks/use-auth";
import { ApiError } from "../lib/api";
import { AuthLayout } from "../components/auth-layout";
import { FormField } from "../components/form-field";

const registerSchema = z
  .object({
    name: z.string().trim().min(2, "O nome precisa ter pelo menos 2 caracteres."),
    email: z.email("Email inválido."),
    password: z
      .string()
      .min(8, "A senha precisa ter pelo menos 8 caracteres.")
      .max(72, "A senha pode ter no máximo 72 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { user, register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  if (user) {
    return <Navigate to="/" replace />;
  }

  async function onSubmit(data: RegisterForm) {
    setServerError(null);
    try {
      await registerUser(data.name, data.email, data.password);
    } catch (error) {
      setServerError(
        error instanceof ApiError ? error.message : "Não foi possível conectar ao servidor.",
      );
    }
  }

  return (
    <AuthLayout title="Criar conta" subtitle="Comece a organizar suas finanças.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField
          id="name"
          label="Nome"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <FormField
          id="password"
          label="Senha"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <FormField
          id="confirmPassword"
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        {serverError && (
          <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{serverError}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Já tem conta?{" "}
        <Link to="/login" className="font-medium text-emerald-400 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}