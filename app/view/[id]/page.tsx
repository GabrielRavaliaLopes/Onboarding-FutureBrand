"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { decryptJson, importKeyFromUrlSafeString } from "@/lib/webcrypto";
import FixedContent from "@/lib/FixedContent";
import PasswordRegistrationGuide from "@/lib/PasswordRegistrationGuide";

type CredPayload = {
  loginUsuario?: string;
  adobeUsuario?: string;
  adobeSenha?: string;
  outrasInfos?: string;
};

type CredStatus = "loading" | "ok" | "unavailable";

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
          setStatus("unavailable");
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
        Aqui você encontra suas credenciais temporárias e as informações de apoio
        necessárias para configurar seus acessos.
      </p>

      {status === "loading" && <p className="lead">Carregando...</p>}

      {status === "ok" && data && (
        <>
          <div className="section-title">E-mail corporativo e acesso ao Mac</div>
          <Row label="E-mail" value={data.loginUsuario} />
          <div className="note-box">
            Seu e-mail corporativo também é usado para entrar no Mac. A senha será definida ou
            alterada com você no primeiro acesso. Quando a senha do e-mail mudar, conclua o registro
            no Portal da Empresa para sincronizar a senha do Mac.
          </div>

          <PasswordRegistrationGuide />

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

      {status === "unavailable" && (
        <div className="card">
          <span className="badge danger">Credenciais não encontradas</span>
          <p className="lead" style={{ marginTop: 10, marginBottom: 0 }}>
            Não encontramos credenciais associadas a este link (ou falta a chave de acesso
            na URL). As informações abaixo continuam disponíveis.
          </p>
        </div>
      )}

      {status === "unavailable" && <PasswordRegistrationGuide />}

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
