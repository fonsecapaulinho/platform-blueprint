import type { Metadata } from "next";
import { AuthCard, FormHeader } from "@/components/auth/auth-shell";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Entrar" };
export default function LoginPage() {
  return <AuthCard><FormHeader eyebrow="BOM TER VOCÊ AQUI" title="Continue sua jornada." description="Entre para acompanhar suas aulas e dar o próximo passo no seu inglês."/><LoginForm/></AuthCard>;
}
