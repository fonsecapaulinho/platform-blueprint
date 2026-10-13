"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Feedback } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { FormHeader } from "@/components/auth/auth-shell";
import { useLocale } from "@/components/auth/locale-provider";
import { mockAuthService } from "./mock-auth-service";
import { recoveryMessages } from "./recovery-form.translations";
import { emailError } from "./validation";
import styles from "@/components/auth/auth.module.css";

export function RecoveryForm() {
  const { locale } = useLocale();
  const messages = recoveryMessages[locale];
  const lock = useRef(false);
  const heading = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  const [failure, setFailure] = useState("");
  useEffect(() => { document.title = `${messages.documentTitle} | Fonseca`; }, [messages.documentTitle]);
  useEffect(() => { if (sent) heading.current?.focus(); }, [sent]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    const invalid = emailError(email, { required: messages.emailRequired, invalid: messages.invalidEmail }); setError(invalid); setFailure("");
    if (invalid) { (form.elements.namedItem("email") as HTMLInputElement)?.focus(); return; }
    lock.current = true; setPending(true);
    try { await mockAuthService.requestRecovery(email); form.reset(); setSent(true); }
    catch { setFailure(messages.requestFailed); }
    finally { lock.current = false; setPending(false); }
  }

  return <>
    {sent ? <div className={styles.result}>
      <div ref={heading} tabIndex={-1} className={styles.successHeading}>
        <span className={styles.successIcon}><Icon name="check"/></span>
        <FormHeader title={messages.sentTitle} description={messages.sentDescription}/>
      </div>
      <Feedback>{messages.previewNotice}</Feedback>
      <Link className={styles.linkButton} href="/redefinir-senha">{messages.preview} <Icon name="arrow"/></Link>
      <Button variant="secondary" onClick={() => { setSent(false); setError(undefined); }}>{messages.useAnotherEmail}</Button>
    </div> : <>
      <FormHeader title={messages.title} description={messages.description}/>
      <form className={styles.form} onSubmit={submit} noValidate aria-label={messages.formLabel}>
        <TextField id="recovery-email" name="email" label={messages.email} type="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} maxLength={254} placeholder={messages.emailPlaceholder} required error={error}/>
        {failure && <Feedback tone="error">{failure}</Feedback>}
        <Button type="submit" pending={pending}>{pending ? messages.pending : messages.submit}{!pending && <Icon name="arrow"/>}</Button>
        <span role="status" className={styles.statusText}>{pending ? messages.status : ""}</span>
      </form>
    </>}
    <div className={styles.backRow}><Link className={styles.back} href="/login"><Icon name="back"/>{messages.back}</Link></div>
  </>;
}
