import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, createSessionCookieValue } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SECRET) {
    return NextResponse.json(
      { error: "Servidor mal configurado: defina ADMIN_PASSWORD e ADMIN_SECRET." },
      { status: 500 }
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, await createSessionCookieValue(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
