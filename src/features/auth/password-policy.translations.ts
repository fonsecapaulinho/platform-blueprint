import type { Locale } from "@/shared/layout/locale";
import type { PasswordRule } from "./password-policy";

export const passwordPolicyMessages = {
  "en-US": {
    title: "Password requirements",
    strength: "Password strength",
    levels: ["Not entered", "Weak", "Needs improvement", "Strong"],
    progress: "{passed} of {total} requirements met.",
    met: "Met",
    unmet: "Not met",
    invalid: "Meet all password requirements before continuing.",
    rules: {
      length: "12–128 characters",
      uppercase: "At least one uppercase letter",
      lowercase: "At least one lowercase letter",
      number: "At least one number",
      special: "At least one special character",
      common: "No common passwords or obvious variations",
      patterns: "No sequences of 4 or repetitions of 3",
      personal: "Does not contain your name or email",
    },
  },
} satisfies Record<Locale, { title: string; strength: string; levels: string[]; progress: string; met: string; unmet: string; invalid: string; rules: Record<PasswordRule, string> }>;
