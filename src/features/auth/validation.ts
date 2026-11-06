export function emailError(value: string, messages: { required: string; invalid: string }): string | undefined {
  if (!value.trim()) return messages.required;
  if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return messages.invalid;
}
