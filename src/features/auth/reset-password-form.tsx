"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { PasswordField } from "@/shared/ui/password-field";
import { Feedback } from "@/shared/ui/feedback";
import { Icon } from "@/shared/ui/icon";
import { FormHeader } from "@/shared/layout/auth-shell";
import { useLocale } from "@/shared/layout/locale-provider";
import { mockAuthService } from "./mock-auth-service";
import { resetPasswordMessages } from "./reset-password-form.translations";

import { evaluatePassword } from "./password-policy";
import { passwordPolicyMessages } from "./password-policy.translations";
import { PasswordRequirements } from "./password-requirements";
import styles from "@/shared/layout/auth.module.css";

export function ResetPasswordForm() {
  const { locale } = useLocale();
  const messages = resetPasswordMessages[locale];
  const lock = useRef(false);
  const heading = useRef<HTMLDivElement>(null);
  const [password, setPassword] = useState("");
  const [identity, setIdentity] = useState<{ email?: string }>({});
  useEffect(() => { setIdentity({ email: sessionStorage.getItem("blueprint.recovery.email") ?? undefined }); }, []);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmation?: string }>({});
  const [failure, setFailure] = useState("");
  useEffect(() => { if (done) heading.current?.focus(); }, [done]);
  useEffect(() => { document.title = `${messages.documentTitle} | BLUEPRINT`; }, [messages.documentTitle]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmation") ?? "");
    const nextErrors = {
      password: evaluatePassword(password, identity).valid ? undefined : passwordPolicyMessages[locale].invalid,
      confirmation: !confirmation ? messages.confirmationRequired : password !== confirmation ? messages.passwordMismatch : undefined,
    };
    setErrors(nextErrors); setFailure("");
    if (nextErrors.password || nextErrors.confirmation) {
      (form.elements.namedItem(nextErrors.password ? "password" : "confirmation") as HTMLInputElement)?.focus(); return;
    }
    lock.current = true; setPending(true);
    try { await mockAuthService.resetPassword(password); form.reset(); setPassword(""); sessionStorage.removeItem("blueprint.recovery.email"); setDone(true); }
    catch { setFailure(messages.requestFailed); }
    finally { lock.current = false; setPending(false); }
  }

  return <>
    {done ? <div className={styles.result}>
      <div ref={heading} tabIndex={-1} className={styles.successHeading}><span className={styles.successIcon}><Icon name="check"/></span><FormHeader title={messages.doneTitle} description={messages.doneDescription}/></div>
      <Link prefetch={false} className={styles.linkButton} href="/sign-in">{messages.successLink} <Icon name="arrow"/></Link>
    </div> : <>
      <FormHeader title={messages.title} description={messages.description}/>
      <form className={styles.form} onSubmit={submit} noValidate aria-label={messages.formLabel}>
        <PasswordField value={password} onChange={event => { setPassword(event.target.value); setErrors(current => ({ ...current, password: undefined })); }} aria-describedby="reset-password-rules" id="new-password" name="password" label={messages.password} autoComplete="new-password" minLength={12} maxLength={128} required error={errors.password}/>
        <PasswordRequirements id="reset-password-rules" password={password} identity={identity}/>
        <PasswordField id="confirm-password" name="confirmation" label={messages.confirmation} autoComplete="new-password" maxLength={128} required error={errors.confirmation}/>
        {failure && <Feedback tone="error">{failure}</Feedback>}
        <Button type="submit" pending={pending}>{pending ? messages.pending : messages.submit}{!pending && <Icon name="arrow"/>}</Button>
        <span role="status" className={styles.statusText}>{pending ? messages.status : ""}</span>
      </form>
      <div className={styles.backRow}><Link prefetch={false} className={styles.back} href="/sign-in"><Icon name="back"/>{messages.back}</Link></div>
    </>}
  </>;
}
