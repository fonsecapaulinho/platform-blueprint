"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/brand/google-icon";
import { TextField } from "@/components/ui/text-field";
import { PasswordField } from "@/components/ui/password-field";
import { Feedback } from "@/components/ui/feedback";
import { FormHeader } from "@/components/auth/auth-shell";
import { useLocale } from "@/components/auth/locale-provider";
import { signInWithGoogle } from "@/app/(auth)/actions";
import { signUpMessages } from "./sign-up-form.translations";
import { emailError, newPasswordError } from "./validation";
import styles from "@/components/auth/auth.module.css";

type SignUpStep = "identity" | "code" | "account" | "done";
type SignUpErrors = {
  name?: string;
  email?: string;
  code?: string;
  birthDate?: string;
  country?: string;
  password?: string;
  confirmPassword?: string;
};
export type SignUpDraft = { name: string; email: string; role: "student" | "teacher" };
export const signupDraftKeys = {
  name: "blueprint.signup.name",
  email: "blueprint.signup.email",
  role: "blueprint.signup.role",
};

export function SignUpForm({
  googleError,
  initialDraft,
}: {
  googleError?: "not-configured" | "failed";
  initialDraft?: SignUpDraft;
}) {
  const router = useRouter();
  const { locale } = useLocale();
  const messages = signUpMessages[locale];
  const [role, setRole] = useState<"student" | "teacher">(initialDraft?.role ?? "student");
  const [step, setStep] = useState<SignUpStep>(initialDraft ? "account" : "identity");
  const [name, setName] = useState(initialDraft?.name ?? "");
  const [email, setEmail] = useState(initialDraft?.email ?? "");
  const [code, setCode] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<SignUpErrors>({});
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxBirthDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const title = step === "identity" || step === "done"
    ? messages.title
    : step === "code" ? messages.codeTitle : messages.accountTitle;
  const documentTitle = initialDraft ? messages.accountTitle : messages.documentTitle;

  useEffect(() => { document.title = `${documentTitle} | BLUEPRINT`; }, [documentTitle]);

  function continueFromIdentity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = {
      name: name.trim() ? undefined : messages.nameRequired,
      email: emailError(email, { required: messages.emailRequired, invalid: messages.invalidEmail }),
    };
    setErrors(nextErrors);
    const firstInvalid = nextErrors.name ? "name" : nextErrors.email ? "email" : undefined;
    if (firstInvalid) {
      (event.currentTarget.elements.namedItem(firstInvalid) as HTMLInputElement)?.focus();
      return;
    }

    setName(name.trim());
    setEmail(email.trim());
    setErrors({});
    setStep("code");
  }

  function continueFromCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(code.trim())) {
      setErrors({ code: messages.codeRequired });
      (event.currentTarget.elements.namedItem("code") as HTMLInputElement)?.focus();
      return;
    }

    setErrors({});
    if (initialDraft) {
      setStep("account");
      return;
    }
    sessionStorage.setItem(signupDraftKeys.name, name);
    sessionStorage.setItem(signupDraftKeys.email, email);
    sessionStorage.setItem(signupDraftKeys.role, role);
    router.push("/complete-sign-up");
  }

  function finishPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedBirthDate = birthDate ? new Date(`${birthDate}T00:00:00`) : undefined;
    const nextErrors = {
      name: name.trim() ? undefined : messages.nameRequired,
      birthDate: !birthDate
        ? messages.birthDateRequired
        : !parsedBirthDate || Number.isNaN(parsedBirthDate.getTime()) || parsedBirthDate > today
          ? messages.invalidBirthDate
          : undefined,
      country: country.trim() ? undefined : messages.countryRequired,
      password: newPasswordError(password, { tooShort: messages.passwordTooShort, tooLong: messages.passwordTooLong }),
      confirmPassword: confirmPassword === password ? undefined : messages.passwordMismatch,
    };
    setErrors(nextErrors);
    const firstInvalid = Object.entries(nextErrors).find(([, error]) => error)?.[0];
    if (firstInvalid) {
      (event.currentTarget.elements.namedItem(firstInvalid) as HTMLInputElement)?.focus();
      return;
    }

    Object.values(signupDraftKeys).forEach((key) => sessionStorage.removeItem(key));
    setStep("done");
  }

  function goBack(nextStep: "identity" | "code") {
    setErrors({});
    setStep(nextStep);
  }

  return <>
    <FormHeader
      title={title}
      description={step === "code" ? messages.codeDescription : undefined}
    />
    {step === "identity" && <>
      {googleError && <Feedback tone="error">{googleError === "not-configured" ? messages.googleNotConfigured : messages.googleFailed}</Feedback>}
      <form action={signInWithGoogle} className={styles.oauthForm}>
        <input type="hidden" name="flow" value="sign-up"/>
        <input type="hidden" name="role" value={role}/>
        <Button type="submit" variant="secondary" className={styles.googleButton}>
          <GoogleIcon/>{messages.google}
        </Button>
      </form>
      <div className={styles.divider}><span>{messages.divider}</span></div>
      <form className={styles.form} onSubmit={continueFromIdentity} noValidate aria-label={messages.title}>
        <fieldset className={styles.signupRole}>
          <legend className={styles.roleLabel}>{messages.roleLabel}</legend>
          <div className={styles.rolePicker}>
            <button type="button" onClick={() => setRole("student")} aria-pressed={role === "student"}>{messages.student}</button>
            <button type="button" onClick={() => setRole("teacher")} aria-pressed={role === "teacher"}>{messages.teacher}</button>
          </div>
        </fieldset>
        <TextField
          id="signup-name"
          name="name"
          label={messages.name}
          autoComplete="name"
          maxLength={120}
          placeholder={messages.namePlaceholder}
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
        />
        <TextField
          id="signup-email"
          name="email"
          label={messages.email}
          type="email"
          autoComplete="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={254}
          placeholder={messages.emailPlaceholder}
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={errors.email}
        />
        <Button type="submit">{messages.continue}</Button>
      </form>
    </>}
    {step === "code" && <>
      <Feedback>{messages.codeHint}</Feedback>
      <p className={styles.userEmail}>{messages.email}: {email}</p>
      <form className={styles.form} onSubmit={continueFromCode} noValidate aria-label={messages.codeTitle}>
        <TextField
          id="signup-code"
          name="code"
          label={messages.code}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="[0-9]{6}"
          required
          value={code}
          onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
          error={errors.code}
          className={styles.codeInput}
        />
        <Button type="submit">{messages.verifyCode}</Button>
      </form>
      <button type="button" className={styles.stepBack} onClick={() => goBack("identity")}>{messages.back}</button>
    </>}
    {step === "account" && <>
      <Feedback>{messages.accountPreview}</Feedback>
      <form className={styles.form} onSubmit={finishPreview} noValidate aria-label={messages.accountTitle}>
        <input type="hidden" name="role" value={role}/>
        <TextField
          id="signup-complete-name"
          name="name"
          label={messages.name}
          autoComplete="name"
          maxLength={120}
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={errors.name}
        />
        <TextField
          id="signup-complete-email"
          name="email"
          label={messages.email}
          type="email"
          autoComplete="email"
          value={email}
          readOnly
        />
        <TextField
          id="signup-birth-date"
          name="birthDate"
          label={messages.birthDate}
          type="date"
          autoComplete="bday"
          max={maxBirthDate}
          required
          value={birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
          error={errors.birthDate}
        />
        <TextField
          id="signup-country"
          name="country"
          label={messages.country}
          autoComplete="country-name"
          maxLength={80}
          placeholder={messages.countryPlaceholder}
          required
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          error={errors.country}
        />
        <PasswordField
          id="signup-password"
          name="password"
          label={messages.password}
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
          hint={messages.passwordHint}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={errors.password}
        />
        <PasswordField
          id="signup-confirm-password"
          name="confirmPassword"
          label={messages.confirmPassword}
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={errors.confirmPassword}
        />
        <Button type="submit">{messages.finish}</Button>
      </form>
      <button type="button" className={styles.stepBack} onClick={() => goBack("code")}>{messages.back}</button>
    </>}
    {step === "done" && <Feedback>{messages.previewOnly}</Feedback>}
    <p className={styles.signupPrompt}>{messages.alreadyHaveAccount} <Link href="/sign-in">{messages.signIn}</Link></p>
  </>;
}
