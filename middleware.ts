import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidSessionCookieValue } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authenticated = await isValidSessionCookieValue(cookie);

  if (!authenticated) {
    if (request.nextUrl.pathname.startsWith("/api/admin/")) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }
    const loginUrl = new URL("/admin", request.url);
    loginUrl.searchParams.set("auth", "0");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/painel", "/api/admin/:path*"],
};
