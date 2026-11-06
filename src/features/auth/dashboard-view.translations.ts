import type { Locale } from "@/shared/layout/locale";

export const dashboardMessages: Record<Locale, { title: string; description: string; signOut: string; student: string; teacher: string }> = {
  "en-US": {
    title: "Google sign-in complete",
    description: "Welcome to your learning space.",
    signOut: "Sign out",
    student: "Student",
    teacher: "Teacher",
  },
};
