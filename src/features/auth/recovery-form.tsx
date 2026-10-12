"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { Feedback } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { FormHeader } from "@/components/auth/auth-shell";
import { mockAuthService } from "./mock-auth-service";
import { emailError } from "./validation";
import styles from "@/components/auth/auth.module.css";

export function RecoveryForm() {
  const lock = useRef(false);
  const heading = useRef<HTMLDivElement>(null);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();
  const [failure, setFailure] = useState("");
  useEffect(() => { if (sent) heading.current?.focus(); }, [sent]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current) return;
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") ?? "");
    const invalid = emailError(email); setError(invalid); setFailure("");
    if (invalid) { (form.elements.namedItem("email") as HTMLInputElement)?.focus(); return; }
    lock.current = true; setPending(true);
    try { await mockAuthService.requestRecovery(email); form.reset(); setSent(true); }
    catch { setFailure("Não foi possível continuar. Tente novamente."); }
    finally { lock.current = false; setPending(false); }
  }

  return <>
    {sent ? <div className={styles.result}>
      <div ref={heading} tabIndex={-1} className={styles.successHeading}>
        <span className={styles.successIcon}><Icon name="check"/></span>
        <FormHeader eyebrow="SOLICITAÇÃO CONCLUÍDA" title="Confira seu e-mail" description="Se houver uma conta associada ao endereço informado, você receberá as instruções de recuperação."/>
      </div>
      <Feedback>Esta é uma simulação. Nenhum e-mail foi enviado. Você pode conhecer a próxima tela abaixo.</Feedback>
      <Link className={styles.linkButton} href="/redefinir-senha">Prévia da nova senha <Icon name="arrow"/></Link>
      <Button variant="secondary" onClick={() => { setSent(false); setError(undefined); }}>Usar outro e-mail</Button>
    </div> : <>
      <FormHeader eyebrow="VAMOS AJUDAR" title="Esqueceu sua senha?" description="Acontece. Informe seu e-mail e vamos ajudar você a retomar seu aprendizado."/>
      <form className={styles.form} onSubmit={submit} noValidate aria-label="Recuperar conta">
        <TextField id="recovery-email" name="email" label="E-mail da sua conta" type="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} maxLength={254} placeholder="voce@exemplo.com" required error={error}/>
        {failure && <Feedback tone="error">{failure}</Feedback>}
        <Button type="submit" pending={pending}>{pending ? "Enviando…" : "Enviar instruções"}{!pending && <Icon name="arrow"/>}</Button>
        <span role="status" className={styles.statusText}>{pending ? "Processando solicitação de demonstração." : ""}</span>
      </form>
    </>}
    <div className={styles.backRow}><Link className={styles.back} href="/login"><Icon name="back"/>Voltar para o login</Link></div>
  </>;
}
