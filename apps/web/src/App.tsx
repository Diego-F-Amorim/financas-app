import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [status, setStatus] = useState("verificando...");

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((response) => response.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("erro ao conectar"));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
        <h1 className="text-3xl font-bold">Finanças App</h1>
        <p className="mt-4 text-slate-400">
          Status da API:{" "}
          <span className="font-semibold text-emerald-400">{status}</span>
        </p>
      </div>
    </main>
  );
}

export default App;