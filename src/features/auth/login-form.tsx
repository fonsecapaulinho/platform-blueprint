"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { PasswordField } from "@/components/ui/password-field";
import { Feedback } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { DEMO_ACCOUNT, mockAuthService } from "./mock-auth-service";
import { emailError } from "./validation";
import styles from "@/components/auth/auth.module.css";

export function LoginForm() {
  const router = useRouter();
  const lock = useRef(false);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [failure, setFailure] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "");
    const password = String(data.get("password") ?? "");
    const nextErrors = { email: emailError(email), password: password ? undefined : "Informe sua senha." };
    setErrors(nextErrors); setFailure("");
    if (nextErrors.email || nextErrors.password) {
      (form.elements.namedItem(nextErrors.email ? "email" : "password") as HTMLInputElement)?.focus();
      return;
    }
    lock.current = true; setPending(true);
    try {
      const result = await mockAuthService.signIn({ email, password });
      if (!result.ok) { setFailure(result.message); return; }
      form.reset();
      router.push("/acesso-demo");
    } catch { setFailure("Não foi possível continuar. Tente novamente."); }
    finally { lock.current = false; setPending(false); }
  }

  return <>
    <form onSubmit={submit} className={styles.form} noValidate aria-label="Entrar na plataforma">
      <TextField id="login-email" name="email" label="E-mail" type="email" autoComplete="username" inputMode="email" autoCapitalize="none" spellCheck={false} maxLength={254} placeholder="voce@exemplo.com" required error={errors.email}/>
      <PasswordField id="login-password" name="password" label="Senha" autoComplete="current-password" placeholder="Digite sua senha" maxLength={128} required error={errors.password}/>
      <div className={styles.forgot}><Link href="/recuperar-conta">Esqueci minha senha</Link></div>
      {failure && <Feedback tone="error">{failure}</Feedback>}
      <Button type="submit" pending={pending}>{pending ? "Entrando…" : "Entrar na plataforma"}{!pending && <Icon name="arrow"/>}</Button>
      <span role="status" className={styles.statusText}>{pending ? "Validando acesso de demonstração." : ""}</span>
    </form>
    <div className={styles.formFooter}>Ainda não tem acesso?<br/><strong>Converse com seu professor para começar.</strong></div>
    <details className={styles.demoDetails}><summary>Dados para experimentar</summary><p>E-mail: <code>{DEMO_ACCOUNT.email}</code><br/>Senha: <code>{DEMO_ACCOUNT.password}</code></p><p>Um acesso fictício para conhecer esta primeira versão.</p></details>
  </>;
}
