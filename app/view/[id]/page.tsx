"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { decryptJson, importKeyFromUrlSafeString } from "@/lib/webcrypto";
import FixedContent from "@/lib/FixedContent";

type CredPayload = {
  loginUsuario?: string;
  loginSenha?: string;
  adobeUsuario?: string;
  adobeSenha?: string;
  outrasInfos?: string;
};

type CredStatus = "loading" | "ok" | "expired" | "unavailable";

export default function ViewSecretPage() {
  const params = useParams<{ id: string }>();
  const [status, setStatus] = useState<CredStatus>("loading");
  const [data, setData] = useState<CredPayload | null>(null);

  useEffect(() => {
    async function run() {
      try {
        const hash = window.location.hash.replace(/^#/, "");
        const res = await fetch(`/api/secret/${params.id}`);
        const json = await res.json();

        if (!json.available) {
          setStatus(json.expired ? "expired" : "unavailable");
          return;
        }
        if (!hash) {
          setStatus("unavailable");
          return;
        }

        const key = await importKeyFromUrlSafeString(hash);
        const decrypted = await decryptJson<CredPayload>(json.ciphertext, json.iv, key);
        setData(decrypted);
        setStatus("ok");
      } catch {
        setStatus("unavailable");
      }
    }
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <div className="container">
      <div className="eyebrow">
        <span className="seal" style={{ width: 20, height: 20 }} />
        onboarding
      </div>
      <h1>Bem-vindo(a) à FutureBrand</h1>
      <p className="lead">
        Aqui você encontra suas credenciais de acesso (por tempo limitado) e as
        informações de apoio do dia a dia, que continuam disponíveis neste mesmo link.
      </p>

      {status === "loading" && <p className="lead">Carregando...</p>}

      {status === "ok" && data && (
        <>
          <div className="section-title">Usuário e senha da máquina e e-mail</div>
          <div className="note-box" style={{ marginBottom: 10 }}>
            Utilizamos o mesmo login e senha para sua máquina e e-mail.
          </div>
          <Row label="Usuário" value={data.loginUsuario} />
          <Row label="Senha" value={data.loginSenha} />

          {(data.adobeUsuario || data.adobeSenha) && (
            <>
              <div className="section-title">Adobe</div>
              <Row label="Usuário" value={data.adobeUsuario} />
              <Row label="Senha" value={data.adobeSenha} />
            </>
          )}

          {data.outrasInfos && (
            <>
              <div className="section-title">Outras informações</div>
              <div className="card pre">{data.outrasInfos}</div>
            </>
          )}
        </>
      )}

      {status === "expired" && (
        <div className="card">
          <span className="badge danger">Credenciais expiradas</span>
          <p className="lead" style={{ marginTop: 10, marginBottom: 0 }}>
            O prazo para visualizar login e senha neste link já passou. Peça ao TI para
            gerar um novo envio, se precisar. As informações abaixo continuam disponíveis.
          </p>
        </div>
      )}

      {status === "unavailable" && (
        <div className="card">
          <span className="badge danger">Credenciais não encontradas</span>
          <p className="lead" style={{ marginTop: 10, marginBottom: 0 }}>
            Não encontramos credenciais associadas a este link (ou falta a chave de acesso
            na URL). As informações abaixo continuam disponíveis.
          </p>
        </div>
      )}

      <FixedContent />
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <div className="credential-row">
      <div>
        <div className="label">{label}</div>
        <div className="value">{value}</div>
      </div>
      <button
        className="ghost"
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? "Copiado" : "Copiar"}
      </button>
    </div>
  );
}
