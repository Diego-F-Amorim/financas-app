import { NavLink, Outlet } from "react-router";
import { useAuth } from "../hooks/use-auth";

const links = [
  { to: "/", label: "Início" },
  { to: "/lancamentos", label: "Lançamentos" },
];

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <span className="font-bold">Finanças App</span>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:inline">{user?.name}</span>
            <button
              onClick={logout}
              className="text-sm text-slate-400 transition hover:text-slate-100"
            >
              Sair
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-4xl gap-1 px-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) =>
                `border-b-2 px-3 py-2 text-sm transition ${
                  isActive
                    ? "border-emerald-500 text-slate-100"
                    : "border-transparent text-slate-400 hover:text-slate-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}