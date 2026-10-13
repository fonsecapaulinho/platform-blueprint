import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/components/auth/locale-provider";
import { SkipLink } from "@/components/auth/skip-link";

export const metadata: Metadata = {
  title: { default: "Fonseca | Aprenda com propósito", template: "%s | Fonseca" },
  description: "Seu espaço de aprendizagem de inglês. Aulas com propósito, prática e acompanhamento próximo.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><LocaleProvider><SkipLink/>{children}</LocaleProvider></body></html>;
}
