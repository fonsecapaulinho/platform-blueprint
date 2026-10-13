import type { Locale } from "@/components/auth/locale";

export const dashboardMessages: Record<Locale, { title: string; description: string; signOut: string; student: string; teacher: string }> = {
  "en-US": {
    title: "Google sign-in complete",
    description: "Your session is active. The learning environment will be connected here in a future step.",
    signOut: "Sign out",
    student: "Student",
    teacher: "Teacher",
  },
};
