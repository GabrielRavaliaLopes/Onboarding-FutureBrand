"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const PASSWORD_CHANGE_URL =
  "https://mysignins.microsoft.com/security-info/password/change";

const STEPS = [
  {
    title: "Inicie o registro",
    description: (
      <>
        Assim que você alterar sua senha, aparecerá a notificação <strong>“Registro Obrigatório”</strong> no Mac.
        Passe o mouse sobre a notificação e clique em <strong>“Registrar”</strong>.
      </>
    ),
    image: "/onboarding/entra/passo-1.png",
    width: 740,
    height: 200,
    alt: "Notificação Registro Obrigatório exibida no Mac",
  },
  {
    title: "Informe a senha antiga do Mac",
    description: (
      <>
        Na tela de <strong>SSO de Plataforma</strong>, digite a senha antiga do seu Mac — a senha usada para entrar
        no computador antes da alteração — e clique em <strong>“OK”</strong>.
      </>
    ),
    image: "/onboarding/entra/passo-2.png",
    width: 732,
    height: 692,
    alt: "Tela SSO de Plataforma solicitando a senha antiga do Mac",
  },
  {
    title: "Entre com sua conta da FutureBrand",
    description: (
      <>
        Na tela de registro do Microsoft Entra, digite seu <strong>e-mail corporativo da FutureBrand</strong> e avance.
        Depois, informe a <strong>nova senha da sua conta</strong>.
      </>
    ),
    image: "/onboarding/entra/passo-3.png",
    width: 1666,
    height: 1454,
    alt: "Tela do Microsoft Entra para entrar com o e-mail corporativo",
  },
  {
    title: "Aprove a solicitação no Microsoft Authenticator",
    description: (
      <>
        Abra o aplicativo <strong>Microsoft Authenticator</strong> no celular e aprove a solicitação. Caso seja
        solicitado, digite no aplicativo o número exibido na tela do Mac.
      </>
    ),
    image: "/onboarding/entra/passo-4.png",
    width: 1666,
    height: 1454,
    alt: "Tela do Microsoft Entra solicitando aprovação no Microsoft Authenticator",
  },
  {
    title: "Informe a nova senha",
    description: (
      <>
        Após a aprovação no Authenticator, digite a <strong>nova senha que você acabou de criar</strong> na janela do
        Microsoft Entra e clique em <strong>“Iniciar Sessão”</strong>.
      </>
    ),
    image: "/onboarding/entra/passo-5.png",
    width: 636,
    height: 604,
    alt: "Janela do Microsoft Entra solicitando a nova senha",
  },
  {
    title: "Confirme a sincronização",
    description: (
      <>
        Ao concluir corretamente, aparecerá a notificação <strong>“Conta Atualizada”</strong>, confirmando que a senha
        foi sincronizada com a conta do Microsoft Entra.
      </>
    ),
    image: "/onboarding/entra/passo-6.png",
    width: 700,
    height: 186,
    alt: "Notificação Conta Atualizada confirmando a sincronização da senha",
  },
];

export default function PasswordRegistrationGuide() {
  const [showGuide, setShowGuide] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showGuide) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowGuide(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [showGuide]);

  return (
    <section className="password-guide" aria-labelledby="password-guide-title">
      <div className="password-reset-card">
        <div>
          <div className="password-reset-eyebrow">Senha corporativa</div>
          <h2>Altere ou redefina sua senha</h2>
          <p>
            Clique no botão caso queira trocar sua senha temporária ou tenha esquecido sua senha.
          </p>
        </div>
        <a href={PASSWORD_CHANGE_URL} target="_blank" rel="noopener noreferrer">
          Alterar ou redefinir minha senha
          <span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="registration-callout">
        <div className="registration-callout-eyebrow">
          <span aria-hidden="true">!</span>
          Próxima etapa obrigatória
        </div>
        <h2 id="password-guide-title">Registro no Portal da Empresa</h2>
        <p className="password-guide-intro">
          Após alterar sua senha corporativa, conclua o registro no <strong>Microsoft Entra</strong> para sincronizar a
          nova senha com o seu Mac.
        </p>
        <button
          className="support-trigger"
          type="button"
          onClick={() => setShowGuide(true)}
          aria-haspopup="dialog"
        >
          Abrir passo a passo do registro
        </button>
      </div>

      {showGuide && (
        <div
          className="support-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowGuide(false);
          }}
        >
          <section
            className="support-modal registration-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="registration-modal-title"
            aria-describedby="registration-modal-description"
          >
            <div className="support-modal-header">
              <div>
                <div className="support-modal-eyebrow">Microsoft Entra</div>
                <h2 id="registration-modal-title">Registro no Portal da Empresa</h2>
              </div>
              <button
                ref={closeButtonRef}
                className="support-modal-close"
                type="button"
                onClick={() => setShowGuide(false)}
                aria-label="Fechar passo a passo do registro"
              >
                ×
              </button>
            </div>

            <p id="registration-modal-description" className="support-modal-intro">
              Siga as etapas abaixo para sincronizar a nova senha corporativa com o seu Mac.
            </p>

            <ol className="password-steps">
              {STEPS.map((step, index) => (
                <li className="password-step" key={step.title}>
                  <div className="password-step-heading">
                    <span>{index + 1}</span>
                    <h3>{step.title}</h3>
                  </div>
                  <p>{step.description}</p>
                  <div className="password-step-image">
                    <Image
                      src={step.image}
                      width={step.width}
                      height={step.height}
                      sizes="(max-width: 640px) calc(100vw - 76px), 700px"
                      alt={step.alt}
                    />
                  </div>
                </li>
              ))}
            </ol>

            <div className="password-complete">
              <strong>Processo concluído!</strong>
              <p>
                A senha da sua conta corporativa e a senha usada para iniciar sessão no Mac estarão sincronizadas.
              </p>
              <p>
                <strong>Importante:</strong> Outlook, Teams e OneDrive podem solicitar que você entre novamente. Nesse
                caso, use seu e-mail corporativo e a nova senha.
              </p>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
