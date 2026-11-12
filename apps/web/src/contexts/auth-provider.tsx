import { useEffect, useState, type ReactNode } from "react";
import { api, tokenStorage } from "../lib/api";
import type { User } from "../types";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => tokenStorage.get() !== null);

  useEffect(() => {
    if (!tokenStorage.get()) return;

    api<User>("/auth/me")
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { token } = await api<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    tokenStorage.set(token);

    const profile = await api<User>("/auth/me");
    setUser(profile);
  }

  async function register(name: string, email: string, password: string) {
    await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    await login(email, password);
  }

  function logout() {
    tokenStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}