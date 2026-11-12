import { useAuth } from "./use-auth";

export function useCurrentWorkspace() {
  const { user } = useAuth();
  const workspace = user?.memberships[0]?.workspace;

  if (!workspace) {
    throw new Error("Nenhum espaço encontrado para o usuário.");
  }
  return workspace;
}