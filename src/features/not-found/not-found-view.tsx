"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AuthShell, AuthCard, FormHeader } from "@/shared/layout/auth-shell";
import { useLocale } from "@/shared/layout/locale-provider";
import { notFoundMessages } from "./not-found.translations";
import styles from "@/shared/layout/auth.module.css";

export default function NotFound() {
  const { locale } = useLocale();
  const messages = notFoundMessages[locale];
  useEffect(() => { document.title = `${messages.documentTitle} | BLUEPRINT`; }, [messages.documentTitle]);
  return <AuthShell><AuthCard><FormHeader title={messages.title} description={messages.description}/><Link prefetch={false} className={styles.linkButton} href="/sign-in">{messages.back}</Link></AuthCard></AuthShell>;
}
