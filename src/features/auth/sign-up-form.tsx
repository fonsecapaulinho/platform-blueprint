"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { PasswordField } from "@/components/ui/password-field";
import { Feedback } from "@/components/ui/feedback";
import { FormHeader } from "@/components/auth/auth-shell";
import { useLocale } from "@/components/auth/locale-provider";
import { signInWithGoogle } from "@/app/(auth)/actions";
import { signUpMessages } from "./sign-up-form.translations";
import { emailError, newPasswordError } from "./validation";
import styles from "@/components/auth/auth.module.css";

export function SignUpForm({ googleError }: { googleError?: "not-configured" | "failed" }) {
  const { locale } = useLocale();
  const messages = signUpMessages[locale];
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [notice, setNotice] = useState("");

  useEffect(() => { document.title = `${messages.documentTitle} | BLUEPRINT`; }, [messages.documentTitle]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const nextErrors = {
      name: name ? undefined : messages.nameRequired,
      email: emailError(email, { required: messages.emailRequired, invalid: messages.invalidEmail }),
      password: newPasswordError(password, { tooShort: messages.passwordTooShort, tooLong: messages.passwordTooLong }),
    };

    setErrors(nextErrors);
    setNotice("");
    const firstInvalid = nextErrors.name ? "name" : nextErrors.email ? "email" : nextErrors.password ? "password" : undefined;
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLInputElement)?.focus();
      return;
    }

    setNotice(messages.emailNotConnected);
    form.reset();
  }

  return <>
    <FormHeader title={messages.title} description={messages.description}/>
    {googleError && <Feedback tone="error">{googleError === "not-configured" ? messages.googleNotConfigured : messages.googleFailed}</Feedback>}
    <form action={signInWithGoogle} className={styles.oauthForm}>
      <input type="hidden" name="flow" value="sign-up"/>
      <Button type="submit" variant="secondary" className={styles.googleButton}>
        <span className={styles.googleMark} aria-hidden="true">G</span>{messages.google}
      </Button>
    </form>
    <div className={styles.divider}><span>{messages.divider}</span></div>
    <p className={styles.recoveryPrompt}>{messages.emailSignupNotice}</p>
    <form className={styles.form} onSubmit={submit} noValidate aria-label={messages.title}>
      <TextField id="signup-name" name="name" label={messages.name} autoComplete="name" maxLength={120} placeholder={messages.namePlaceholder} required error={errors.name}/>
      <TextField id="signup-email" name="email" label={messages.email} type="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} maxLength={254} placeholder={messages.emailPlaceholder} required error={errors.email}/>
      <PasswordField id="signup-password" name="password" label={messages.password} autoComplete="new-password" minLength={8} maxLength={128} required hint={messages.passwordHint} error={errors.password}/>
      {notice && <Feedback>{notice}</Feedback>}
      <Button type="submit">{messages.submit}</Button>
    </form>
    <p className={styles.signupPrompt}>{messages.alreadyHaveAccount} <Link href="/sign-in">{messages.signIn}</Link></p>
  </>;
}
