import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard, FormHeader } from "@/components/auth/auth-shell";
import { Feedback } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import styles from "@/components/auth/auth.module.css";

export const metadata: Metadata = { title: "Acesso de demonstração" };
export default function DemoPage() {
  return <AuthCard><span className={styles.successIcon}><Icon name="check"/></span><FormHeader eyebrow="PRIMEIRO PASSO CONCLUÍDO" title="Bem-vindo à Fonseca." description="Este é o final do fluxo de login de demonstração. Sua próxima etapa será o espaço de aprendizagem."/><div className={styles.result}><Feedback>Esta página é pública e ilustrativa. Não existe sessão autenticada, conta real ou dashboard nesta entrega.</Feedback><Link className={styles.linkButton} href="/login"><Icon name="back"/>Voltar ao início</Link></div></AuthCard>;
}
