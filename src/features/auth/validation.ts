export function emailError(value: string, messages: { required: string; invalid: string }): string | undefined {
  if (!value.trim()) return messages.required;
  if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) return messages.invalid;
}

export function newPasswordError(value: string, messages: { tooShort: string; tooLong: string }): string | undefined {
  if (value.length < 8) return messages.tooShort;
  if (value.length > 128) return messages.tooLong;
}
