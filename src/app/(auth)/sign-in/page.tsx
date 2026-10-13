import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-shell";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = { title: "Entrar" };
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const googleError = error === "google-not-configured" ? "not-configured" : error ? "failed" : undefined;
  return <AuthCard><LoginForm googleError={googleError}/></AuthCard>;
}
