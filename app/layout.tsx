import type { Metadata } from "next";
import Image from "next/image";
import localFont from "next/font/local";
import "./globals.css";

const mwSans = localFont({
  src: [
    { path: "../public/fonts/MWSans-Regular.otf", weight: "400", style: "normal" },
    { path: "../public/fonts/MWSans-Italic.otf", weight: "400", style: "italic" },
    { path: "../public/fonts/MWSans-SemiBold.otf", weight: "600", style: "normal" },
    { path: "../public/fonts/MWSans-SemiBoldItalic.otf", weight: "600", style: "italic" },
    { path: "../public/fonts/MWSans-Bold.otf", weight: "700", style: "normal" },
    { path: "../public/fonts/MWSans-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-mw-sans",
  display: "swap",
  fallback: [],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Compartilhamento seguro de credenciais de acesso para novos colaboradores",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={mwSans.variable}>
      <body>
        <header className="brand-header">
          <Image
            className="brand-logo"
            src="/futurebrand-logo.png"
            alt="FutureBrand"
            width={280}
            height={46}
            priority
          />
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
