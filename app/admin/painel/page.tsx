"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { encryptJson, exportKeyToUrlSafeString, generateKey } from "@/lib/webcrypto";
import FixedContent from "@/lib/FixedContent";

type FormState = {
  nomeColaborador: string;
  loginUsuario: string;
  loginSenha: string;
  adobeUsuario: string;
  adobeSenha: string;
  outrasInfos: string;
};

const EMPTY: FormState = {
  nomeColaborador: "",
  loginUsuario: "",
  loginSenha: "",
  adobeUsuario: "",
  adobeSenha: "",
  outrasInfos: "",
};

export default function PainelPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [usarAdobe, setUsarAdobe] = useState(false);
  const [usarOutras, setUsarOutras] = useState(false);
  const [ttlHours, setTtlHours] = useState(24);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setLink(null);
    try {
      const payload: Partial<FormState> = {
        loginUsuario: form.loginUsuario,
        loginSenha: form.loginSenha,
      };
      if (usarAdobe) {
        payload.adobeUsuario = form.adobeUsuario;
        payload.adobeSenha = form.adobeSenha;
      }
      if (usarOutras) {
        payload.outrasInfos = form.outrasInfos;
      }

      const key = await generateKey();
      const { ciphertext, iv } = await encryptJson(payload, key);
      const keyStr = await exportKeyToUrlSafeString(key);

      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ciphertext,
          iv,
          ttlHours,
          createdFor: form.nomeColaborador,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Não foi possível gerar o link.");
        return;
      }

      const url = `${window.location.origin}/view/${data.id}#${keyStr}`;
      setLink(url);

      const qr = await QRCode.toDataURL(url, {
        width: 400,
        margin: 1,
        color: { dark: "#0b1220", light: "#ffffff" },
      });
      setQrDataUrl(qr);
    } catch {
      setError("Erro ao criptografar ou salvar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleNewOnboarding() {
    setForm(EMPTY);
    setUsarAdobe(false);
    setUsarOutras(false);
    setLink(null);
    setQrDataUrl(null);
    setError(null);
  }

  return (
    <div className="container">
      <div className="eyebrow">
        <span className="seal" style={{ width: 20, height: 20 }} />
        novo onboarding
      </div>
      <h1>Credenciais de acesso</h1>
      <p className="lead">
        As credenciais ficam visíveis no link por 24h ou 48h (você escolhe). O passo a
        passo de impressora, SoloApp e ferramentas continua disponível no mesmo link,
        mesmo depois das credenciais sumirem.
      </p>

      {!link ? (
        <form className="card" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="nome">Nome do colaborador</label>
            <input
              id="nome"
              value={form.nomeColaborador}
              onChange={(e) => update("nomeColaborador", e.target.value)}
              placeholder="Ex.: Maria Silva"
              required
            />
          </div>

          <div className="section-title">Usuário e senha da máquina e e-mail</div>
          <div className="field">
            <label>Usuário</label>
            <input value={form.loginUsuario} onChange={(e) => update("loginUsuario", e.target.value)} />
          </div>
          <div className="field">
            <label>Senha</label>
            <input value={form.loginSenha} onChange={(e) => update("loginSenha", e.target.value)} />
          </div>
          <div className="note-box">
            Utilizamos o mesmo login e senha para a máquina e o e-mail. Basta usar a senha
            de e-mail para logar na máquina também.
          </div>

          <div className="section-title-row">
            <span className="section-title" style={{ margin: 0, border: "none", padding: 0 }}>
              Usuário e senha do Adobe (se tiver)
            </span>
            <label className="toggle-label">
              <input type="checkbox" checked={usarAdobe} onChange={(e) => setUsarAdobe(e.target.checked)} /> Usar
            </label>
          </div>
          <div className={`section-body${usarAdobe ? "" : " disabled"}`}>
            <div className="field">
              <label>Usuário</label>
              <input value={form.adobeUsuario} onChange={(e) => update("adobeUsuario", e.target.value)} />
            </div>
            <div className="field">
              <label>Senha</label>
              <input value={form.adobeSenha} onChange={(e) => update("adobeSenha", e.target.value)} />
            </div>
          </div>

          <div className="section-title-row">
            <span className="section-title" style={{ margin: 0, border: "none", padding: 0 }}>
              Outras informações
            </span>
            <label className="toggle-label">
              <input type="checkbox" checked={usarOutras} onChange={(e) => setUsarOutras(e.target.checked)} /> Usar
            </label>
          </div>
          <div className={`section-body${usarOutras ? "" : " disabled"}`}>
            <div className="field">
              <textarea
                rows={3}
                value={form.outrasInfos}
                onChange={(e) => update("outrasInfos", e.target.value)}
                placeholder="Qualquer outro acesso, sistema ou observação"
              />
            </div>
          </div>

          <div className="section-title">Prazo das credenciais</div>
          <div className="field">
            <select value={ttlHours} onChange={(e) => setTtlHours(Number(e.target.value))}>
              <option value={24}>24 horas</option>
              <option value={48}>48 horas</option>
            </select>
            <p className="field-note">
              Depois desse prazo, o login/senha somem da página automaticamente — mas o
              link continua funcionando para mostrar o conteúdo fixo abaixo.
            </p>
          </div>

          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Gerando link..." : "Gerar link de acesso"}
          </button>
          {error && <p className="error-text">{error}</p>}

          <div className="fixed-preview">
            <div className="fixed-preview-title">Conteúdo fixo incluído automaticamente</div>
            <FixedContent />
          </div>
        </form>
      ) : (
        <div className="card">
          <span className="badge warn">Credenciais válidas por {ttlHours}h</span>
          <p className="lead" style={{ marginTop: 14 }}>
            Envie este link para {form.nomeColaborador || "o colaborador"}. As credenciais
            somem sozinhas depois de {ttlHours}h; o conteúdo de ajuda continua disponível.
          </p>
          <div className="link-box">{link}</div>
          {qrDataUrl && (
            <div className="qrcode-box">
              <img src={qrDataUrl} alt="QR code do link de onboarding" />
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="ghost" onClick={handleCopy} type="button">
              {copied ? "Copiado!" : "Copiar link"}
            </button>
            <button className="ghost" onClick={handleNewOnboarding} type="button">
              Novo onboarding
            </button>
          </div>
        </div>
      )}

      <p className="footer-note">
        A chave de criptografia faz parte do link (depois do #) e nunca é enviada ao
        servidor. Sem o link completo, ninguém consegue ler as credenciais — nem quem tem
        acesso ao banco de dados.
      </p>
    </div>
  );
}
