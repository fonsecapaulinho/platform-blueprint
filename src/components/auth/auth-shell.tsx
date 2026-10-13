"use client";

import { Brand } from "@/components/brand/brand";
import styles from "./auth.module.css";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return <div className={styles.shell}>
    <header className={styles.header}>
      <Brand/>
    </header>
    <main id="main-content" className={styles.main} tabIndex={-1}>{children}</main>
  </div>;
}

export function AuthCard({ children }: { children: React.ReactNode }) { return <section className={styles.card}>{children}</section>; }
export function FormHeader({ title, description }: { title: string; description?: string }) {
  return <div className={styles.formHeader}><h1>{title}</h1>{description && <p>{description}</p>}</div>;
}
