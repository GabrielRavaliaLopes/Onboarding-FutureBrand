import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div className="eyebrow">
        <span className="seal" style={{ width: 20, height: 20 }} />
        onboarding
      </div>
      <h1>Onboarding FutureBrand</h1>
      <p className="lead">
        Gere um link (e QR code) por colaborador e escolha a data e a hora exatas de
        vencimento. Depois disso, as credenciais somem, mas o passo a passo fixo, continua disponível no mesmo link.
      </p>
      <div className="card">
        <Link href="/admin">
          <button className="primary">Entrar na área do TI</button>
        </Link>
      </div>
      <p className="footer-note">
        As credenciais são criptografadas no seu navegador antes de saírem da sua máquina.
      </p>
    </div>
  );
}
