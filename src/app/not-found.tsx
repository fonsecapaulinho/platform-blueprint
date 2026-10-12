import Link from "next/link";
import { AuthShell, AuthCard, FormHeader } from "@/components/auth/auth-shell";
import styles from "@/components/auth/auth.module.css";

export default function NotFound() {
  return <AuthShell><AuthCard><FormHeader eyebrow="PÁGINA NÃO ENCONTRADA" title="Vamos voltar ao início?" description="Este endereço não está disponível. Você pode retomar seu caminho pela tela de login."/><Link className={styles.linkButton} href="/login">Ir para o login</Link></AuthCard></AuthShell>;
}
