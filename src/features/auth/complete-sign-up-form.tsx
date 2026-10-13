"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Feedback } from "@/components/ui/feedback";
import { FormHeader } from "@/components/auth/auth-shell";
import { useLocale } from "@/components/auth/locale-provider";
import { signUpMessages } from "./sign-up-form.translations";
import { SignUpForm, signupDraftKeys, type SignUpDraft } from "./sign-up-form";
import styles from "@/components/auth/auth.module.css";

export function CompleteSignUpForm() {
  const { locale } = useLocale();
  const messages = signUpMessages[locale];
  const [draft, setDraft] = useState<SignUpDraft | null>();

  useEffect(() => {
    document.title = `${messages.accountTitle} | BLUEPRINT`;
    const name = sessionStorage.getItem(signupDraftKeys.name);
    const email = sessionStorage.getItem(signupDraftKeys.email);
    const role = sessionStorage.getItem(signupDraftKeys.role);
    setDraft(name && email && (role === "student" || role === "teacher")
      ? { name, email, role }
      : null);
  }, [messages.accountTitle]);

  if (draft) return <SignUpForm initialDraft={draft}/>;

  return <>
    <FormHeader title={messages.accountTitle}/>
    {draft === null && <>
      <Feedback>{messages.accountLinkUnavailable}</Feedback>
      <p className={styles.signupPrompt}>
        <Link href="/sign-up">{messages.startSignUp}</Link>
      </p>
    </>}
  </>;
}
