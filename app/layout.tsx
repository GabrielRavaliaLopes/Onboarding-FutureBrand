import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onboarding seguro",
  description: "Compartilhamento seguro de credenciais de acesso para novos colaboradores",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
