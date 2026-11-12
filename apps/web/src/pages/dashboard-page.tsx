import { useAuth } from "../hooks/use-auth";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const workspace = user?.memberships[0]?.workspace;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <span className="font-bold">Finanças App</span>
        <button
          onClick={logout}
          className="text-sm text-slate-400 transition hover:text-slate-100"
        >
          Sair
        </button>
      </header>

      <section className="p-6">
        <h1 className="text-2xl font-bold">Olá, {user?.name}! 👋</h1>
        <p className="mt-1 text-slate-400">Espaço atual: {workspace?.name}</p>
      </section>
    </main>
  );
}