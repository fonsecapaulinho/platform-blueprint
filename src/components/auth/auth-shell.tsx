"use client";

import { Brand } from "@/components/brand/brand";
import { useLocale } from "./locale-provider";
import { authShellMessages } from "./auth-shell.translations";
import styles from "./auth.module.css";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { locale, setLocale } = useLocale();
  const messages = authShellMessages[locale];

  return <div className={styles.shell}>
    <header className={styles.header}>
      <Brand/>
      <nav className={styles.language} aria-label={messages.language}>
        <button type="button" onClick={() => setLocale("pt-BR")} aria-label={messages.portuguese} aria-pressed={locale === "pt-BR"}>PT</button>
        <button type="button" onClick={() => setLocale("en-US")} aria-label={messages.english} aria-pressed={locale === "en-US"}>EN</button>
      </nav>
    </header>
    <main id="main-content" className={styles.main} tabIndex={-1}>{children}</main>
  </div>;
}

export function AuthCard({ children }: { children: React.ReactNode }) { return <section className={styles.card}>{children}</section>; }
export function FormHeader({ title, description }: { title: string; description?: string }) {
  return <div className={styles.formHeader}><h1>{title}</h1>{description && <p>{description}</p>}</div>;
}
