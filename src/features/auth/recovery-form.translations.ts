import type { Locale } from "@/shared/layout/locale";

export const recoveryMessages = {
  "en-US": {
    documentTitle: "Recover account",
    title: "Recover your account",
    description: "Enter the email address for your account.",
    formLabel: "Recover account",
    email: "Email",
    emailPlaceholder: "you@example.com",
    submit: "Continue",
    pending: "Sending…",
    status: "Processing your request.",
    emailRequired: "Enter your email.",
    invalidEmail: "Enter a valid email address.",
    requestFailed: "Unable to continue. Please try again.",
    sentTitle: "Request received",
    sentDescription: "If an account matches this email, check your inbox for the recovery code.",
    enterCode: "Enter recovery code",
    useAnotherEmail: "Use another email",
    back: "Back to sign in",
  },
} satisfies Record<Locale, object>;
