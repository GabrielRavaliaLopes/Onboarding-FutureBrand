"use client";

import { useEffect, useRef, useState } from "react";

import {
  FERRAMENTAS,
  TEXTO_AJUDA,
  TEXTO_IMPRESSORA,
  TEXTO_SOLOAPP_IMPORTANTE,
  TEXTO_SOLOAPP_PASSOS,
} from "@/lib/fixedContentData";

export default function FixedContent() {
  const whatsapp = process.env.NEXT_PUBLIC_RECEPCAO_WHATSAPP;
  const [showSupportChannels, setShowSupportChannels] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showSupportChannels) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSupportChannels(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [showSupportChannels]);

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
        <button
          className="support-trigger"
          type="button"
          onClick={() => setShowSupportChannels(true)}
          aria-haspopup="dialog"
        >
          Ver canais de atendimento
        </button>
      </div>

      {showSupportChannels && (
        <div
          className="support-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowSupportChannels(false);
          }}
        >
          <section
            className="support-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="support-modal-title"
            aria-describedby="support-modal-description"
          >
            <div className="support-modal-header">
              <div>
                <div className="support-modal-eyebrow">Canais de atendimento</div>
                <h2 id="support-modal-title">Como podemos ajudar?</h2>
              </div>
              <button
                ref={closeButtonRef}
                className="support-modal-close"
                type="button"
                onClick={() => setShowSupportChannels(false)}
                aria-label="Fechar canais de atendimento"
              >
                ×
              </button>
            </div>

            <p id="support-modal-description" className="support-modal-intro">
              Para assuntos internos, fale com a recepção da FutureBrand. Para dúvidas,
              acessos ou suporte técnico, abra um ticket com a Solo Tecnologia.
            </p>

            <div className="support-group">
              <h3>FutureBrand</h3>
              {whatsapp ? (
                <a
                  className="support-channel"
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="support-channel-icon" aria-hidden="true">💬</span>
                  <span>
                    <strong>Recepção via WhatsApp</strong>
                    <small>Fale com a recepção da FutureBrand</small>
                  </span>
                  <span className="support-channel-arrow" aria-hidden="true">↗</span>
                </a>
              ) : (
                <p className="support-unavailable">Contato da recepção indisponível.</p>
              )}
            </div>

            <div className="support-group">
              <h3>Suporte de TI — Solo Tecnologia / ZDesk</h3>
              <div className="support-channel-grid">
                <a className="support-channel" href="https://api.whatsapp.com/send/?phone=551139958350" target="_blank" rel="noopener noreferrer">
                  <span className="support-channel-icon" aria-hidden="true">🐸</span>
                  <span><strong>SoloZap</strong><small>WhatsApp: (11) 3995-8350</small></span>
                  <span className="support-channel-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="support-channel" href="https://teams.microsoft.com/l/chat/0/0?users=suporte@zdesk.com.br" target="_blank" rel="noopener noreferrer">
                  <span className="support-channel-icon" aria-hidden="true">🟪</span>
                  <span><strong>Teams</strong><small>Chat com suporte@zdesk.com.br</small></span>
                  <span className="support-channel-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="support-channel" href="mailto:suporte@zdesk.com.br">
                  <span className="support-channel-icon" aria-hidden="true">📧</span>
                  <span><strong>E-mail</strong><small>suporte@zdesk.com.br</small></span>
                  <span className="support-channel-arrow" aria-hidden="true">↗</span>
                </a>
                <a className="support-channel" href="https://zdesk.com.br" target="_blank" rel="noopener noreferrer">
                  <span className="support-channel-icon" aria-hidden="true">🦓</span>
                  <span><strong>Portal ZDesk</strong><small>Acesse com suas credenciais</small></span>
                  <span className="support-channel-arrow" aria-hidden="true">↗</span>
                </a>
                <div className="support-channel support-channel-static">
                  <span className="support-channel-icon" aria-hidden="true">🟧</span>
                  <span><strong>SoloApp</strong><small>Aplicativo instalado em seu computador</small></span>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
