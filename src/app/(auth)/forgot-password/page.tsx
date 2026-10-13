import type { Metadata } from "next";
import { AuthCard } from "@/shared/layout/auth-shell";
import { RecoveryForm } from "@/features/auth/recovery-form";

export const metadata: Metadata = { title: "Recover account" };
export default function RecoveryPage() { return <AuthCard><RecoveryForm/></AuthCard>; }
