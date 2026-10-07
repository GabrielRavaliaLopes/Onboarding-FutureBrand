"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { encryptJson, exportKeyToUrlSafeString, generateKey } from "@/lib/webcrypto";
import FixedContent from "@/lib/FixedContent";
import PasswordRegistrationGuide from "@/lib/PasswordRegistrationGuide";

type FormState = {
  nomeColaborador: string;
  loginUsuario: string;
  adobeUsuario: string;
  adobeSenha: string;
  outrasInfos: string;
};

type EmailStatus = "idle" | "sending" | "sent" | "failed";

const EMPTY: FormState = {
  nomeColaborador: "",
  loginUsuario: "",
  adobeUsuario: "",
  adobeSenha: "",
  outrasInfos: "",
};

export default function PainelPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [usarAdobe, setUsarAdobe] = useState(false);
  const [usarOutras, setUsarOutras] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [onboardingId, setOnboardingId] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setLink(null);
    setEmailStatus("idle");
    setEmailError(null);
    try {
      const payload: Partial<FormState> = {
        loginUsuario: form.loginUsuario,
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
      setOnboardingId(data.id);

      const qr = await QRCode.toDataURL(url, {
        width: 400,
        margin: 1,
        color: { dark: "#0b1220", light: "#ffffff" },
      });
      setQrDataUrl(qr);
      await sendOnboardingEmail(data.id, url, qr);
    } catch {
      setError("Erro ao criptografar ou salvar os dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function sendOnboardingEmail(id: string, url: string, qr: string) {
    setEmailStatus("sending");
    setEmailError(null);

    try {
      const response = await fetch("/api/admin/send-onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: form.loginUsuario.trim(),
          collaboratorName: form.nomeColaborador.trim(),
          onboardingUrl: url,
          qrDataUrl: qr,
          onboardingId: id,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setEmailStatus("failed");
        setEmailError(result.error || "Não foi possível enviar o e-mail.");
        return;
      }

      setEmailStatus("sent");
    } catch {
      setEmailStatus("failed");
      setEmailError("Não foi possível enviar o e-mail. Tente novamente.");
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
    setEmailStatus("idle");
    setEmailError(null);
    setOnboardingId(null);
  }

  return (
    <div className="container">
      <div className="eyebrow">
        <span className="seal" style={{ width: 20, height: 20 }} />
        onboarding
      </div>
      <h1>Credenciais de acesso</h1>
      <p className="lead">
        Gere um link e um QR Code com as credenciais temporárias e as orientações necessárias
        para o primeiro acesso do colaborador.
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

          <div className="section-title">E-mail corporativo e acesso ao Mac</div>
          <div className="field">
            <label>E-mail do colaborador</label>
            <input
              type="email"
              autoComplete="off"
              value={form.loginUsuario}
              onChange={(e) => update("loginUsuario", e.target.value)}
              placeholder="nome@futurebrand.com.br"
              required
            />
          </div>
          <div className="note-box">
            Este e-mail também é o usuário para entrar no Mac. A senha será definida ou alterada
            com o colaborador no primeiro acesso. Quando a senha do e-mail mudar, conclua o registro
            no Portal da Empresa para sincronizar a senha do Mac.
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

          <button className="primary" type="submit" disabled={loading}>
            {loading ? "Gerando link..." : "Gerar link de acesso"}
          </button>
          {error && <p className="error-text">{error}</p>}

          <div className="fixed-preview">
            <div className="fixed-preview-title">Conteúdo fixo</div>
            <PasswordRegistrationGuide />
            <FixedContent />
          </div>
        </form>
      ) : (
        <div className="card">
          <span className="badge">Onboarding pronto</span>
          <p className="lead" style={{ marginTop: 14 }}>
            Envie este link ou apresente o QR Code para {form.nomeColaborador || "o colaborador"}.
            A senha de acesso será definida ou alterada com o colaborador no primeiro acesso.
          </p>
          <div className="link-box">{link}</div>
          {qrDataUrl && (
            <div className="qrcode-box">
              <img src={qrDataUrl} alt="QR code do link de onboarding" />
            </div>
          )}
          <div className={`email-delivery email-delivery-${emailStatus}`} role="status">
            {emailStatus === "sending" && "Enviando o onboarding por e-mail..."}
            {emailStatus === "sent" && `E-mail enviado para ${form.loginUsuario}.`}
            {emailStatus === "failed" && (
              <>
                <span>{emailError}</span>
                {onboardingId && qrDataUrl && link && (
                  <button
                    className="ghost"
                    type="button"
                    onClick={() => sendOnboardingEmail(onboardingId, link, qrDataUrl)}
                  >
                    Tentar enviar novamente
                  </button>
                )}
              </>
            )}
          </div>
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
        A chave de criptografia faz parte do link (depois do #) e não é armazenada junto
        às credenciais. No envio automático, o link completo é encaminhado de forma segura
        ao serviço de e-mail. Compartilhe-o somente com o colaborador.
      </p>
    </div>
  );
}
