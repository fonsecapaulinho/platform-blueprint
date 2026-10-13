import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export const metadata: Metadata = { title: "New password" };
export default function ResetPage() { return <AuthCard><ResetPasswordForm/></AuthCard>; }
