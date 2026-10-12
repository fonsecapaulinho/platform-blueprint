"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PasswordField } from "@/components/ui/password-field";
import { Feedback } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { FormHeader } from "@/components/auth/auth-shell";
import { mockAuthService } from "./mock-auth-service";
import { newPasswordError } from "./validation";
import styles from "@/components/auth/auth.module.css";

export function ResetPasswordForm() {
  const lock = useRef(false);
  const heading = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirmation?: string }>({});
  const [failure, setFailure] = useState("");
  useEffect(() => { if (done) heading.current?.focus(); }, [done]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const password = String(data.get("password") ?? "");
    const confirmation = String(data.get("confirmation") ?? "");
    const nextErrors = { password: newPasswordError(password), confirmation: !confirmation ? "Confirme a nova senha." : password !== confirmation ? "As senhas precisam ser iguais." : undefined };
    setErrors(nextErrors); setFailure("");
    if (nextErrors.password || nextErrors.confirmation) {
      (form.elements.namedItem(nextErrors.password ? "password" : "confirmation") as HTMLInputElement)?.focus(); return;
    }
    lock.current = true; setPending(true);
    try { await mockAuthService.resetPassword(password); form.reset(); setDone(true); }
    catch { setFailure("Não foi possível continuar. Tente novamente."); }
    finally { lock.current = false; setPending(false); }
  }

  return <>
    {done ? <div className={styles.result}>
      <div ref={heading} tabIndex={-1} className={styles.successHeading}><span className={styles.successIcon}><Icon name="check"/></span><FormHeader eyebrow="TUDO PRONTO" title="Você pode continuar" description="A etapa de criação de senha foi concluída na demonstração."/></div>
      <Feedback tone="success">Nenhuma senha foi alterada ou armazenada. O acesso de exemplo continua usando Demo123!.</Feedback>
      <Link className={styles.linkButton} href="/login">Voltar para o login <Icon name="arrow"/></Link>
    </div> : <>
      <FormHeader eyebrow="UM NOVO COMEÇO" title="Crie uma nova senha" description="Escolha uma senha que seja fácil de lembrar para você e difícil de adivinhar."/>
      <form className={styles.form} onSubmit={submit} noValidate aria-label="Redefinir senha">
        <PasswordField id="new-password" name="password" label="Nova senha" autoComplete="new-password" minLength={8} maxLength={128} required hint="Use de 8 a 128 caracteres. Não use uma senha real nesta prévia." error={errors.password}/>
        <PasswordField id="confirm-password" name="confirmation" label="Confirmar nova senha" autoComplete="new-password" maxLength={128} required error={errors.confirmation}/>
        {failure && <Feedback tone="error">{failure}</Feedback>}
        <Button type="submit" pending={pending}>{pending ? "Salvando…" : "Salvar nova senha"}{!pending && <Icon name="arrow"/>}</Button>
        <span role="status" className={styles.statusText}>{pending ? "Processando alteração de demonstração." : ""}</span>
      </form>
      <div className={styles.backRow}><Link className={styles.back} href="/login"><Icon name="back"/>Voltar para o login</Link></div>
    </>}
  </>;
}
