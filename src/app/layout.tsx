import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Fonseca | Aprenda com propósito", template: "%s | Fonseca" },
  description: "Seu espaço de aprendizagem de inglês. Aulas com propósito, prática e acompanhamento próximo.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><a className="skip-link" href="#main-content">Pular para o conteúdo</a>{children}</body></html>;
}
