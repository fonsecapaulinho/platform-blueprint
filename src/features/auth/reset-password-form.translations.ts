import type { Locale } from "@/shared/layout/locale";

export const resetPasswordMessages = {
  "en-US": {
    documentTitle: "New password",
    title: "Reset password",
    description: "Choose a new password for your account.",
    formLabel: "Reset password",
    password: "New password",
    confirmation: "Confirm new password",
    confirmationRequired: "Confirm your new password.",
    passwordMismatch: "Passwords must match.",
    submit: "Reset password",
    pending: "Saving…",
    status: "Processing your request.",
    requestFailed: "Unable to continue. Please try again.",
    doneTitle: "Request complete",
    doneDescription: "Return to sign in to continue.",
    back: "Back to sign in",
    successLink: "Back to sign in",
  },
} satisfies Record<Locale, object>;
