"use client";

import { Brand } from "@/shared/brand/brand";
import { useLocale } from "./locale-provider";
import { authShellMessages } from "./auth-shell.translations";
import styles from "./auth.module.css";

export function AuthShell({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  return <div className={styles.shell}>
    <header className={styles.header}>
      <Brand/>
    </header>
    <main id="main-content" className={styles.main} tabIndex={-1}>{children}</main>
    <footer className={styles.footer}>{authShellMessages[locale].copyright.replace("{year}", String(new Date().getFullYear()))}</footer>
  </div>;
}

export function AuthCard({ children }: { children: React.ReactNode }) { return <section className={styles.card}>{children}</section>; }
export function FormHeader({ title, description }: { title: string; description?: string }) {
  return <div className={styles.formHeader}><h1>{title}</h1>{description && <p>{description}</p>}</div>;
}
