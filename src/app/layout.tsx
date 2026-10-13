import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/shared/layout/locale-provider";
import { SkipLink } from "@/shared/layout/skip-link";

export const metadata: Metadata = {
  title: { default: "BLUEPRINT", template: "%s | BLUEPRINT" },
  description: "Your English learning space. Build confidence through practical English.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-US"><body><LocaleProvider><SkipLink/>{children}</LocaleProvider></body></html>;
}
