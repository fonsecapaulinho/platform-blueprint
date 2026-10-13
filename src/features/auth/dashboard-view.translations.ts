import type { Locale } from "@/components/auth/locale";

export const dashboardMessages: Record<Locale, { title: string; description: string; signOut: string }> = {
  "pt-BR": {
    title: "Acesso Google concluído",
    description: "Sua sessão foi iniciada. O ambiente de aprendizagem será conectado nesta área em uma próxima etapa.",
    signOut: "Sair",
  },
  "en-US": {
    title: "Google sign-in complete",
    description: "Your session is active. The learning environment will be connected here in a future step.",
    signOut: "Sign out",
  },
};
