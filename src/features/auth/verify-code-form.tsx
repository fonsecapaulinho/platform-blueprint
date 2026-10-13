"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { TextField } from "@/shared/ui/text-field";
import { FormHeader } from "@/shared/layout/auth-shell";
import { useLocale } from "@/shared/layout/locale-provider";
import { verifyCodeMessages } from "./verify-code-form.translations";
import styles from "@/shared/layout/auth.module.css";

export function VerifyCodeForm() {
  const router = useRouter();
  const { locale } = useLocale();
  const messages = verifyCodeMessages[locale];
  const [error, setError] = useState<string>();

  useEffect(() => {
    document.title = `${messages.documentTitle} | BLUEPRINT`;
  }, [messages.documentTitle]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const code = String(new FormData(form).get("code") ?? "").trim();

    if (!/^\d{6}$/.test(code)) {
      setError(messages.codeRequired);
      (form.elements.namedItem("code") as HTMLInputElement)?.focus();
      return;
    }

    setError(undefined);
    router.push("/reset-password");
  }

  return <>
    <FormHeader title={messages.title} description={messages.description}/>
    <form className={styles.form} onSubmit={submit} noValidate aria-label={messages.formLabel}>
      <TextField
        id="recovery-code"
        name="code"
        label={messages.code}
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        pattern="[0-9]{6}"
        required
        hint={messages.codeHint}
        error={error}
        className={styles.codeInput}
      />
      <Button type="submit">{messages.submit}</Button>
    </form>
    <div className={styles.backRow}>
      <span className={styles.recoveryPrompt}>{messages.requestAnother} </span>
      <Link className={styles.inlineLink} href="/forgot-password">{messages.requestLink}</Link>
    </div>
    <div className={styles.backRow}>
      <Link className={styles.back} href="/forgot-password">{messages.back}</Link>
    </div>
  </>;
}
