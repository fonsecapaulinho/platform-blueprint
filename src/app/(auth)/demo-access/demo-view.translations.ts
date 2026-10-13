import type { Locale } from "@/components/auth/locale";

export const demoViewMessages: Record<Locale, { documentTitle: string; title: string; description: string; notice: string; back: string }> = {
  "pt-BR": {
    documentTitle: "Acesso de demonstração",
    title: "Acesso concluído",
    description: "Esta demonstração não cria uma sessão nem abre uma área autenticada.",
    notice: "Versão ilustrativa. Nenhuma conta real foi acessada.",
    back: "Voltar ao login",
  },
  "en-US": {
    documentTitle: "Demo sign-in",
    title: "Sign-in complete",
    description: "This demo does not create a session or open an authenticated area.",
    notice: "Illustrative version. No real account was accessed.",
    back: "Back to sign in",
  },
};
