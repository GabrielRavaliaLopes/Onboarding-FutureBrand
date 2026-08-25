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
        Gere um link e um QR Code por colaborador com credenciais temporárias e orientações
        para configurar os primeiros acessos.
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
