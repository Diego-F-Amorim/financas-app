import { useAuth } from "../hooks/use-auth";
import { useCurrentWorkspace } from "../hooks/use-current-workspace";

export function DashboardPage() {
  const { user } = useAuth();
  const workspace = useCurrentWorkspace();

  return (
    <section>
      <h1 className="text-2xl font-bold">Olá, {user?.name}! 👋</h1>
      <p className="mt-1 text-slate-400">Espaço atual: {workspace.name}</p>
    </section>
  );
}