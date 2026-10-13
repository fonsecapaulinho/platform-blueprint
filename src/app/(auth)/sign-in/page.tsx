import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-shell";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Entrar" };
export default function LoginPage() {
  return <AuthCard><LoginForm/></AuthCard>;
}
