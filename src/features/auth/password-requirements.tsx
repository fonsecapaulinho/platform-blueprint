"use client";

import { useLocale } from "@/shared/layout/locale-provider";
import { evaluatePassword, passwordRules, type PasswordIdentity } from "./password-policy";
import { passwordPolicyMessages } from "./password-policy.translations";
import styles from "./password-requirements.module.css";

export function PasswordRequirements({ id, password, identity }: { id: string; password: string; identity?: PasswordIdentity }) {
  const { locale } = useLocale();
  const messages = passwordPolicyMessages[locale];
  const { checks, passed, strength } = evaluatePassword(password, identity);
  const progress = messages.progress.replace("{passed}", String(passed)).replace("{total}", String(passwordRules.length));
  return <div id={id} className={styles.requirements}>
    <p aria-live="polite" aria-atomic="true">{messages.strength}: <strong>{messages.levels[strength]}</strong>. {progress}</p>
    <meter min={0} max={3} value={strength} aria-label={messages.strength} aria-valuetext={messages.levels[strength]}/>
    <p className={styles.title}>{messages.title}</p>
    <ul>{passwordRules.map(rule => <li key={rule} data-met={checks[rule]}>
      <span aria-hidden="true">{checks[rule] ? "✓" : "○"}</span>
      <span>{messages.rules[rule]}<span className={styles.srOnly}>: {checks[rule] ? messages.met : messages.unmet}</span></span>
    </li>)}</ul>
  </div>;
}
