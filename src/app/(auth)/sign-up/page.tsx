import type { Metadata } from "next";
import { AuthCard } from "@/shared/layout/auth-shell";
import { SignUpForm } from "@/features/auth/sign-up-form";

export const metadata: Metadata = { title: "Create account" };

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const googleError = error === "google-not-configured" ? "not-configured" : error ? "failed" : undefined;
  return <AuthCard><SignUpForm googleError={googleError}/></AuthCard>;
}
