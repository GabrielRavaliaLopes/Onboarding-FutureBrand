"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível entrar.");
        return;
      }
      router.push("/admin/painel");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="eyebrow">
        <span className="seal" style={{ width: 20, height: 20 }} />
        área do ti
      </div>
      <h1>Entrar</h1>
      <p className="lead">Acesso restrito à equipe responsável pelo onboarding.</p>
      <form className="card" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="password">Senha de acesso</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </div>
        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}
