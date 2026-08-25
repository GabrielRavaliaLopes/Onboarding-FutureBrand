import { NextRequest, NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATA_URL_PREFIX = "data:image/png;base64,";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL || "Onboarding FutureBrand <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json(
      { error: "O envio de e-mail ainda não foi configurado na Vercel." },
      { status: 503 }
    );
  }

  const body = await req.json();
  const { to, collaboratorName, onboardingUrl, qrDataUrl, onboardingId } = body ?? {};

  if (
    typeof to !== "string" ||
    !EMAIL_PATTERN.test(to) ||
    typeof collaboratorName !== "string" ||
    typeof onboardingUrl !== "string" ||
    typeof onboardingId !== "string" ||
    typeof qrDataUrl !== "string" ||
    !qrDataUrl.startsWith(DATA_URL_PREFIX) ||
    qrDataUrl.length > 3_000_000
  ) {
    return NextResponse.json({ error: "Dados de envio inválidos." }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(onboardingUrl);
  } catch {
    return NextResponse.json({ error: "Link de onboarding inválido." }, { status: 400 });
  }

  if (parsedUrl.protocol !== "https:" || !parsedUrl.hash || !parsedUrl.pathname.startsWith("/view/")) {
    return NextResponse.json({ error: "Link de onboarding inválido." }, { status: 400 });
  }

  const allowedHosts = new Set([req.nextUrl.host, "onboarding2-bice.vercel.app"]);
  if (!allowedHosts.has(parsedUrl.host)) {
    return NextResponse.json({ error: "Domínio do onboarding inválido." }, { status: 400 });
  }

  const safeName = escapeHtml(collaboratorName.slice(0, 100));
  const safeUrl = escapeHtml(onboardingUrl);
  const qrBase64 = qrDataUrl.slice(DATA_URL_PREFIX.length);

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `onboarding/${onboardingId}/${to.toLowerCase()}`.slice(0, 256),
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: process.env.RESEND_REPLY_TO || undefined,
      subject: "Seu onboarding FutureBrand",
      html: `
        <div style="margin:0;background:#f5f5f2;padding:32px 16px;color:#161616;font-family:Arial,sans-serif">
          <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #deded8;padding:32px">
            <p style="margin:0 0 20px;font-size:12px;letter-spacing:.12em;text-transform:uppercase">FutureBrand · Onboarding</p>
            <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2">Olá, ${safeName}!</h1>
            <p style="font-size:16px;line-height:1.6">Estamos encaminhando seu QR Code. Se preferir, clique no botão abaixo para acessar suas informações iniciais.</p>
            <p style="margin:28px 0;text-align:center">
              <a href="${safeUrl}" style="display:inline-block;background:#111;color:#fff;padding:14px 22px;text-decoration:none;font-weight:700">Acessar meu onboarding</a>
            </p>
            <p style="text-align:center"><img src="cid:onboarding-qr-code" width="220" height="220" alt="QR Code do onboarding" style="display:block;margin:0 auto" /></p>
            <p style="font-size:16px;line-height:1.6">Nessa página, você encontrará suas credenciais de primeiro acesso, orientações para redefinir a senha e os canais disponíveis para abertura de chamados.</p>
            <p style="font-size:16px;line-height:1.6">Se precisar de ajuda, selecione <strong>Ver canais de atendimento</strong> ou siga o passo a passo disponível na página.</p>
            <p style="margin-top:28px;color:#666;font-size:13px;line-height:1.5">Este link contém a chave necessária para abrir suas credenciais. Não o encaminhe para outras pessoas.</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: "qrcode-onboarding.png",
          content: qrBase64,
          content_id: "onboarding-qr-code",
          content_type: "image/png",
        },
      ],
    }),
  });

  const result = await resendResponse.json().catch(() => null);
  if (!resendResponse.ok) {
    const message = result?.message || "Não foi possível enviar o e-mail.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json({ id: result?.id });
}
