import type { Locale } from "@/components/auth/locale";

export const notFoundMessages: Record<Locale, { documentTitle: string; title: string; description: string; back: string }> = {
  "en-US": {
    documentTitle: "Page not found",
    title: "Page not found",
    description: "This address is not available.",
    back: "Back to sign in",
  },
};
