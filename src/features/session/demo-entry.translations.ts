import type { Locale } from "@/shared/layout/locale";

export const demoEntryMessages: Record<
  Locale,
  { title: string; description: string; student: string; teacher: string }
> = {
  "en-US": {
    title: "Continue into the demonstration",
    description:
      "Pick the role to explore. This is demonstration data, not a login, and it grants no real access.",
    student: "Continue as a student",
    teacher: "Continue as a teacher",
  },
};
