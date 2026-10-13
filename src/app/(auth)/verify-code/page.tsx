import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-shell";
import { VerifyCodeForm } from "@/features/auth/verify-code-form";

export const metadata: Metadata = { title: "Recovery code" };

export default function VerifyCodePage() {
  return <AuthCard><VerifyCodeForm/></AuthCard>;
}
