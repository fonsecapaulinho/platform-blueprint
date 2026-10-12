import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export const metadata: Metadata = { title: "Nova senha" };
export default function ResetPage() { return <AuthCard><ResetPasswordForm/></AuthCard>; }
