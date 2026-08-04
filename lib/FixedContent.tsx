"use client";

import {
  FERRAMENTAS,
  TEXTO_AJUDA,
  TEXTO_IMPRESSORA,
  TEXTO_SOLOAPP_IMPORTANTE,
  TEXTO_SOLOAPP_PASSOS,
} from "@/lib/fixedContent";

export default function FixedContent() {
  const whatsapp = process.env.NEXT_PUBLIC_RECEPCAO_WHATSAPP;

  return (
    <div>
      <div className="section-title" style={{ margin: "20px 0 10px" }}>
        Passo a passo — Impressora
      </div>
      <div className="card">
        <ol className="fixed-list">
          {TEXTO_IMPRESSORA.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>

      <div className="section-title" style={{ margin: "20px 0 10px" }}>
        Passo a passo — Abrir chamado no SoloApp
      </div>
      <div className="card">
        <ol className="fixed-list">
          {TEXTO_SOLOAPP_PASSOS.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
        <div className="fixed-important">
          <strong>Importante:</strong> {TEXTO_SOLOAPP_IMPORTANTE}
        </div>
      </div>

      <div className="section-title" style={{ margin: "20px 0 10px" }}>
        Ferramentas de trabalho
      </div>
      <div className="card">
        {FERRAMENTAS.map((f, i) => (
          <div className="credential-row" key={i}>
            <div>
              <div className="label">{f.titulo}</div>
              <div className="value">{f.valor}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title" style={{ margin: "20px 0 10px" }}>
        Precisa de ajuda?
      </div>
      <div className="card">
        <p className="lead" style={{ marginTop: 0 }}>{TEXTO_AJUDA}</p>
        {whatsapp && (
          <a
            className="whatsapp-link"
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Falar com a Recepção no WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}
