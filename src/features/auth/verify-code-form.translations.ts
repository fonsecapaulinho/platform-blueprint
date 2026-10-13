import type { Locale } from "@/components/auth/locale";

export const verifyCodeMessages = {
  "pt-BR": {
    documentTitle: "Código de recuperação",
    title: "Verifique seu e-mail",
    description: "Digite o código de recuperação de seis dígitos.",
    formLabel: "Verificar código de recuperação",
    code: "Código de recuperação",
    codeHint: "A entrega e a validação do código serão conectadas em breve.",
    codeRequired: "Informe um código válido de 6 dígitos.",
    submit: "Continuar",
    back: "Voltar",
    requestAnother: "Precisa de outro código?",
    requestLink: "Solicitar novamente",
  },
  "en-US": {
    documentTitle: "Recovery code",
    title: "Check your email",
    description: "Enter your six-digit recovery code.",
    formLabel: "Verify recovery code",
    code: "Recovery code",
    codeHint: "Code delivery and verification will be connected soon.",
    codeRequired: "Enter a valid 6-digit code.",
    submit: "Continue",
    back: "Back",
    requestAnother: "Need another code?",
    requestLink: "Request a new one",
  },
} satisfies Record<Locale, object>;
