import { Navigate, Route, Routes } from "react-router";
import { ProtectedRoute } from "./components/protected-route";
import { DashboardPage } from "./pages/dashboard-page";
import { LoginPage } from "./pages/login-page";
import { RegisterPage } from "./pages/register-page";
import { AppLayout } from "./components/app-layout";
import { TransactionsPage } from "./pages/transactions-page";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
  <Route element={<AppLayout />}>
    <Route path="/" element={<DashboardPage />} />
    <Route path="/lancamentos" element={<TransactionsPage />} />
  </Route>
</Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;