"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import { GoogleIcon } from "@/shared/brand/google-icon";
import { TextField } from "@/shared/ui/text-field";
import { SelectField } from "@/shared/ui/select-field";
import { PasswordField } from "@/shared/ui/password-field";
import { Feedback } from "@/shared/ui/feedback";
import { AuthCard, FormHeader } from "@/shared/layout/auth-shell";
import { useLocale } from "@/shared/layout/locale-provider";
import { signInWithGoogle } from "@/features/auth/actions";
import { signUpMessages } from "./sign-up-form.translations";
import { getCountryOptions } from "./country-options";
import { emailError } from "./validation";
import { evaluatePassword } from "./password-policy";
import { passwordPolicyMessages } from "./password-policy.translations";
import { PasswordRequirements } from "./password-requirements";
import styles from "@/shared/layout/auth.module.css";

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

type SignUpProps = { googleError?: "not-configured" | "failed"; initialDraft?: SignUpDraft; enableFlip?: boolean };

export function SignUpForm({ googleError, initialDraft, enableFlip = false }: SignUpProps) {
  const [role, setRole] = useState<SignUpDraft["role"]>(initialDraft?.role ?? "student");
  if (initialDraft) return <SignUpFace initialDraft={initialDraft} role={role} onRoleChange={setRole}/>;
  return <AuthCard enableFlip={enableFlip} flipped={role === "teacher"}
    back={<SignUpFace role="teacher" onRoleChange={setRole} googleError={googleError}/>}>
    <SignUpFace role="student" onRoleChange={setRole} googleError={googleError}/>
  </AuthCard>;
}

function SignUpFace({ googleError, initialDraft, role, onRoleChange }: SignUpProps & {
  role: SignUpDraft["role"]; onRoleChange: (role: SignUpDraft["role"]) => void;
}) {
  const router = useRouter();
  const { locale } = useLocale();
  const messages = signUpMessages[locale];
  const [step, setStep] = useState<SignUpStep>(initialDraft ? "account" : "identity");
  const [name, setName] = useState(initialDraft?.name ?? "");
  const [email, setEmail] = useState(initialDraft?.email ?? "");
  const [code, setCode] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const countryOptions = useMemo(() => step === "account" ? getCountryOptions(locale) : [], [step, locale]);
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

  useEffect(() => {
    document.title = `${documentTitle} | BLUEPRINT`;
  }, [documentTitle, locale]);

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

  function finishSignUp(event: FormEvent<HTMLFormElement>) {
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
      password: evaluatePassword(password, { name, email }).valid ? undefined : passwordPolicyMessages[locale].invalid,
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
            <button type="button" onClick={() => onRoleChange("student")} aria-pressed={role === "student"}>{messages.student}</button>
            <button type="button" onClick={() => onRoleChange("teacher")} aria-pressed={role === "teacher"}>{messages.teacher}</button>
          </div>
        </fieldset>
        <TextField
          id={`signup-name-${role}`}
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
          id={`signup-email-${role}`}
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
      <p className={styles.userEmail}>{messages.email}: {email}</p>
      <form className={styles.form} onSubmit={continueFromCode} noValidate aria-label={messages.codeTitle}>
        <TextField
          id={`signup-code-${role}`}
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
      <form className={styles.form} onSubmit={finishSignUp} noValidate aria-label={messages.accountTitle}>
        <input type="hidden" name="role" value={role}/>
        <TextField
          id={`signup-complete-name-${role}`}
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
          id={`signup-complete-email-${role}`}
          name="email"
          label={messages.email}
          type="email"
          autoComplete="email"
          value={email}
          readOnly
        />
        <TextField
          id={`signup-birth-date-${role}`}
          name="birthDate"
          label={messages.birthDate}
          type="date"
          lang={locale}
          autoComplete="bday"
          max={maxBirthDate}
          required
          value={birthDate}
          onChange={(event) => setBirthDate(event.target.value)}
          error={errors.birthDate}
        />
        <SelectField
          id={`signup-country-${role}`}
          name="country"
          label={messages.country}
          autoComplete="country"
          placeholder={messages.countryPlaceholder}
          options={countryOptions}
          required
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          error={errors.country}
        />
        <PasswordField
          aria-describedby={`signup-password-rules-${role}`}
          id={`signup-password-${role}`}
          name="password"
          label={messages.password}
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required

          value={password}
          onChange={(event) => { setPassword(event.target.value); setErrors(current => ({ ...current, password: undefined })); }}
          error={errors.password}
        />
        <PasswordRequirements id={`signup-password-rules-${role}`} password={password} identity={{ name, email }}/>
        <PasswordField
          id={`signup-confirm-password-${role}`}
          name="confirmPassword"
          label={messages.confirmPassword}
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
          value={confirmPassword}
          onChange={(event) => { setConfirmPassword(event.target.value); setErrors(current => ({ ...current, confirmPassword: undefined })); }}
          error={errors.confirmPassword}
        />
        <Button type="submit">{messages.finish}</Button>
      </form>
      <button type="button" className={styles.stepBack} onClick={() => goBack("code")}>{messages.back}</button>
    </>}
    {step === "done" && <Feedback>{messages.complete}</Feedback>}
    <p className={styles.signupPrompt}>{messages.alreadyHaveAccount} <Link prefetch={false} href="/sign-in">{messages.signIn}</Link></p>
  </>;
}
