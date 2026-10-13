import type { Locale } from "@/shared/layout/locale";

export const verifyCodeMessages = {
  "en-US": {
    documentTitle: "Recovery code",
    title: "Check your email",
    description: "Enter your six-digit recovery code.",
    formLabel: "Verify recovery code",
    code: "Recovery code",
    codeHint: "Code delivery and verification will be connected soon.",
    codeRequired: "Enter a valid 6-digit code.",
    submit: "Continue",
    back: "Back",
    requestAnother: "Need another code?",
    requestLink: "Request a new one",
  },
} satisfies Record<Locale, object>;
