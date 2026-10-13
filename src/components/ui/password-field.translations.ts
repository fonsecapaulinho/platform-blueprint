import type { Locale } from "@/components/auth/locale";

export const passwordFieldMessages: Record<Locale, { show: string; hide: string }> = {
  "pt-BR": { show: "Mostrar senha", hide: "Ocultar senha" },
  "en-US": { show: "Show password", hide: "Hide password" },
};
