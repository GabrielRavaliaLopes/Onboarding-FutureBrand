import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div className="eyebrow">
        <span className="seal" style={{ width: 20, height: 20 }} />
        onboarding seguro
      </div>
      <h1>Compartilhamento seguro de credenciais</h1>
      <p className="lead">
        Gere um link (e QR code) por colaborador e escolha a data e a hora exatas de
        vencimento. Depois disso, as credenciais somem, mas o passo a passo de impressora,
        SoloApp e ferramentas de trabalho continua disponível no mesmo link.
      </p>
      <div className="card">
        <Link href="/admin">
          <button className="primary">Entrar na área do TI</button>
        </Link>
      </div>
      <p className="footer-note">
        As credenciais são criptografadas no seu navegador antes de saírem da sua máquina.
        O servidor nunca vê o conteúdo em texto puro.
      </p>
    </div>
  );
}
