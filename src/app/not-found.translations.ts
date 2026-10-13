import type { Locale } from "@/components/auth/locale";

export const notFoundMessages: Record<Locale, { documentTitle: string; title: string; description: string; back: string }> = {
  "pt-BR": {
    documentTitle: "Página não encontrada",
    title: "Página não encontrada",
    description: "Este endereço não está disponível.",
    back: "Voltar ao login",
  },
  "en-US": {
    documentTitle: "Page not found",
    title: "Page not found",
    description: "This address is not available.",
    back: "Back to sign in",
  },
};
