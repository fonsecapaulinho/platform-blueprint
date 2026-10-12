export function emailError(value: string): string | undefined {
  if (!value.trim()) return "Informe seu e-mail.";
  if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return "Informe um e-mail válido, como nome@exemplo.com.";
}

export function newPasswordError(value: string): string | undefined {
  if (value.length < 8) return "Use pelo menos 8 caracteres.";
  if (value.length > 128) return "Use no máximo 128 caracteres.";
}
