"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";
import { TextField } from "@/components/ui/text-field";
import { Feedback } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { FormHeader } from "@/components/auth/auth-shell";
import { useLocale } from "@/components/auth/locale-provider";
import { mockAuthService } from "./mock-auth-service";
import { resetPasswordMessages } from "./reset-password-form.translations";
import { newPasswordError } from "./validation";
import styles from "@/components/auth/auth.module.css";

export function ResetPasswordForm() {
  const { locale } = useLocale();
  const messages = resetPasswordMessages[locale];
  const lock = useRef(false);
  const heading = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ code?: string; password?: string; confirmation?: string }>({});
  const [failure, setFailure] = useState("");
  useEffect(() => { if (done) heading.current?.focus(); }, [done]);
  useEffect(() => { document.title = `${messages.documentTitle} | Fonseca`; }, [messages.documentTitle]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const code = String(data.get("code") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmation") ?? "");
    const nextErrors = {
      code: /^\d{6}$/.test(code) ? undefined : messages.codeRequired,
      password: newPasswordError(password, { tooShort: messages.passwordTooShort, tooLong: messages.passwordTooLong }),
      confirmation: !confirmation ? messages.confirmationRequired : password !== confirmation ? messages.passwordMismatch : undefined,
    };
    setErrors(nextErrors); setFailure("");
    if (nextErrors.code || nextErrors.password || nextErrors.confirmation) {
      (form.elements.namedItem(nextErrors.code ? "code" : nextErrors.password ? "password" : "confirmation") as HTMLInputElement)?.focus(); return;
    }
    lock.current = true; setPending(true);
    try { await mockAuthService.resetPassword(code, password); form.reset(); setDone(true); }
    catch { setFailure(messages.requestFailed); }
    finally { lock.current = false; setPending(false); }
  }

  return <>
    {done ? <div className={styles.result}>
      <div ref={heading} tabIndex={-1} className={styles.successHeading}><span className={styles.successIcon}><Icon name="check"/></span><FormHeader title={messages.doneTitle} description={messages.doneDescription}/></div>
      <Feedback tone="info">{messages.codeHint}</Feedback>
      <Link className={styles.linkButton} href="/login">{messages.successLink} <Icon name="arrow"/></Link>
    </div> : <>
      <FormHeader title={messages.title} description={messages.description}/>
      <form className={styles.form} onSubmit={submit} noValidate aria-label={messages.formLabel}>
        <TextField id="recovery-code" name="code" label={messages.code} inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" required hint={messages.codeHint} error={errors.code} className={styles.codeInput}/>
        <PasswordField id="new-password" name="password" label={messages.password} autoComplete="new-password" minLength={8} maxLength={128} required hint={messages.passwordHint} error={errors.password}/>
        <PasswordField id="confirm-password" name="confirmation" label={messages.confirmation} autoComplete="new-password" maxLength={128} required error={errors.confirmation}/>
        {failure && <Feedback tone="error">{failure}</Feedback>}
        <Button type="submit" pending={pending}>{pending ? messages.pending : messages.submit}{!pending && <Icon name="arrow"/>}</Button>
        <span role="status" className={styles.statusText}>{pending ? messages.status : ""}</span>
      </form>
      <div className={styles.backRow}><Link className={styles.back} href="/login"><Icon name="back"/>{messages.back}</Link></div>
    </>}
  </>;
}
