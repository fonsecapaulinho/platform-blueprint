"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { GoogleIcon } from "@/shared/brand/google-icon";
import { TextField } from "@/shared/ui/text-field";
import { PasswordField } from "@/shared/ui/password-field";
import { Feedback } from "@/shared/ui/feedback";
import { Icon } from "@/shared/ui/icon";
import { FormHeader } from "@/shared/layout/auth-shell";
import { useLocale } from "@/shared/layout/locale-provider";
import { mockAuthService } from "./mock-auth-service";
import { loginMessages } from "./login-form.translations";
import { emailError } from "./validation";
import styles from "@/shared/layout/auth.module.css";
import { signInWithGoogle } from "@/features/auth/actions";

type LoginProps = { googleError?: "not-configured" | "failed" };
type LoginRole = "student" | "teacher";

export function LoginForm({ googleError }: LoginProps) {
  const [role, setRole] = useState<LoginRole>("student");
  const container = useRef<HTMLDivElement>(null);

  function switchRole(nextRole: LoginRole) {
    if (role === nextRole) return;
    setRole(nextRole);
  }

  useEffect(() => {
    if (container.current?.contains(document.activeElement)) {
      container.current.querySelector<HTMLButtonElement>(`[data-role="${role}"] button[aria-pressed="true"]`)?.focus({ preventScroll: true });
    }
  }, [role]);

  return <div ref={container} className={styles.loginScene}>
    <div className={styles.loginFlipper} data-flipped={role === "teacher"}>
      {(["student", "teacher"] as const).map(face => <section key={face}
        data-role={face} className={`${styles.card} ${styles.loginFace}`}
        inert={role !== face} aria-hidden={role !== face}>
        <LoginFace role={face} onRoleChange={switchRole} googleError={googleError}/>
      </section>)}
    </div>
  </div>;
}

function LoginFace({ googleError, role, onRoleChange }: LoginProps & { role: LoginRole; onRoleChange: (role: LoginRole) => void }) {
  const router = useRouter();
  const { locale } = useLocale();
  const messages = loginMessages[locale];
  const lock = useRef(false);

  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [failure, setFailure] = useState("");
  useEffect(() => { document.title = `${messages.documentTitle} | BLUEPRINT`; }, [messages.documentTitle]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const nextErrors = {
      email: emailError(email, { required: messages.emailRequired, invalid: messages.invalidEmail }),
      password: password ? undefined : messages.passwordRequired,
    };
    setErrors(nextErrors); setFailure("");
    if (nextErrors.email || nextErrors.password) {
      (form.elements.namedItem(nextErrors.email ? "email" : "password") as HTMLInputElement)?.focus();
      return;
    }
    lock.current = true; setPending(true);
    try {
      const result = await mockAuthService.signIn({ email, password, role });
      if (!result.ok) { setFailure(messages.loginFailed); return; }
      form.reset();
      router.push("/demo-access");
    } catch { setFailure(messages.requestFailed); }
    finally { lock.current = false; setPending(false); }
  }

  return <>
    <FormHeader title={messages.title} description={messages.description}/>
    {googleError && <Feedback tone="error">{googleError === "not-configured" ? messages.googleNotConfigured : messages.googleFailed}</Feedback>}
    <form action={signInWithGoogle} className={styles.oauthForm}>
      <input type="hidden" name="flow" value="sign-in"/>
      <Button type="submit" variant="secondary" className={styles.googleButton}>
        <GoogleIcon/>{messages.google}
      </Button>
    </form>
    <div className={styles.divider}><span>{messages.divider}</span></div>
    <form onSubmit={submit} className={styles.form} noValidate aria-label={`${messages.formLabel} — ${messages[role]}`}>
      <div>
        <span className={styles.roleLabel} id={`${role}-role-label`}>{messages.roleLabel}</span>
        <div className={styles.rolePicker} role="group" aria-labelledby={`${role}-role-label`}>
          <button type="button" onClick={() => { onRoleChange("student"); setFailure(""); setErrors({}); }} aria-pressed={role === "student"}>{messages.student}</button>
          <button type="button" onClick={() => { onRoleChange("teacher"); setFailure(""); setErrors({}); }} aria-pressed={role === "teacher"}>{messages.teacher}</button>
        </div>
      </div>
      <TextField id={`${role}-email`} name="email" label={messages.email} type="email" autoComplete="username" inputMode="email" autoCapitalize="none" spellCheck={false} maxLength={254} placeholder={messages.emailPlaceholder} required error={errors.email}/>
      <PasswordField id={`${role}-password`} name="password" label={messages.password} autoComplete="current-password" placeholder={messages.passwordPlaceholder} maxLength={128} required error={errors.password}/>
      <div className={styles.forgot}><Link href="/forgot-password">{messages.forgotPassword}</Link></div>
      {failure && <Feedback tone="error">{failure}</Feedback>}
      <Button type="submit" pending={pending}>{pending ? messages.pending : messages.submit}{!pending && <Icon name="arrow"/>}</Button>
      <span role="status" className={styles.statusText}>{pending ? messages.status : ""}</span>
    </form>
    <p className={styles.signupPrompt}>{messages.signupPrompt} <Link href="/sign-up">{messages.signupLink}</Link></p>
  </>;
}
