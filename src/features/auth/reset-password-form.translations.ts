import type { Locale } from "@/shared/layout/locale";

export const resetPasswordMessages = {
  "en-US": {
    documentTitle: "New password",
    title: "Reset password",
    description: "Choose a new password for your account.",
    formLabel: "Reset password",
    password: "New password",
    passwordHint: "Use 8 to 128 characters.",
    confirmation: "Confirm new password",
    confirmationRequired: "Confirm your new password.",
    passwordMismatch: "Passwords must match.",
    passwordTooShort: "Use at least 8 characters.",
    passwordTooLong: "Use no more than 128 characters.",
    submit: "Reset password",
    pending: "Saving…",
    status: "Processing your request.",
    requestFailed: "Unable to continue. Please try again.",
    doneTitle: "Request complete",
    doneDescription: "This preview does not change your password.",
    doneNotice: "No password was changed.",
    back: "Back to sign in",
    successLink: "Back to sign in",
  },
} satisfies Record<Locale, object>;
