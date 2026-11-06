/** Shared client/server policy. Enforce again on the server when auth is connected. */
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;
export type PasswordIdentity = { name?: string; email?: string };
export const passwordRules = ["length", "uppercase", "lowercase", "number", "special", "common", "patterns", "personal"] as const;
export type PasswordRule = typeof passwordRules[number];

// A local baseline, not a replacement for a maintained breached-password corpus.
const commonPasswords = ["password", "passw0rd", "letmein", "welcome", "qwerty", "admin", "administrator", "iloveyou", "monkey", "dragon", "football", "baseball", "sunshine", "princess", "trustno1", "changeme", "abc123", "senha", "senhaforte", "blueprint", "fonseca"];
const sequences = ["0123456789", "abcdefghijklmnopqrstuvwxyz", "qwertyuiop", "asdfghjkl", "zxcvbnm"];
const fold = (value: string) => value.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase();
const unleet = (value: string) => value.replace(/[013457@$!]/g, char => ({ "0": "o", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t", "@": "a", "$": "s", "!": "i" })[char]!);

function hasPattern(value: string) {
  if (/(.)\1{2,}/u.test(value) || /(.{2,})\1{2,}/u.test(value)) return true;
  return sequences.some(sequence => {
    for (let i = 0; i <= sequence.length - 4; i++) {
      const part = sequence.slice(i, i + 4);
      if (value.includes(part) || value.includes([...part].reverse().join(""))) return true;
    }
    return false;
  });
}

export function evaluatePassword(value: string, identity: PasswordIdentity = {}) {
  const normalized = value.normalize("NFC");
  const folded = fold(normalized);
  const simplified = unleet(folded).replace(/[^\p{L}\p{N}]/gu, "");
  const name = fold(identity.name?.trim() ?? "");
  const email = fold(identity.email?.trim() ?? "");
  const localPart = email.split("@")[0];
  const personal = [name, email, localPart, ...name.split(/\s+/), ...localPart.split(/[._+\-]/)]
    .filter(part => part.length >= 2 && /[\p{L}\p{N}]/u.test(part));
  const length = [...normalized].length;
  const checks: Record<PasswordRule, boolean> = {
    length: length >= PASSWORD_MIN_LENGTH && length <= PASSWORD_MAX_LENGTH,
    uppercase: /\p{Lu}/u.test(normalized),
    lowercase: /\p{Ll}/u.test(normalized),
    number: /\p{N}/u.test(normalized),
    special: /[^\p{L}\p{N}\s]/u.test(normalized),
    common: !!value && !commonPasswords.some(word => simplified.includes(unleet(word))),
    patterns: !!value && !hasPattern(folded),
    personal: !!value && !personal.some(part => folded.includes(part) || simplified.includes(unleet(part).replace(/[^\p{L}\p{N}]/gu, ""))),
  };
  const passed = passwordRules.filter(rule => checks[rule]).length;
  const valid = passed === passwordRules.length;
  // This is a transparent policy indicator, not an entropy/crack-time estimate.
  const strength = !value ? 0 : valid ? 3 : checks.common && checks.patterns && checks.personal && passed >= 6 ? 2 : 1;
  return { checks, passed, valid, strength };
}
