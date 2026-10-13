import type { Metadata } from "next";
import { AuthCard } from "@/shared/layout/auth-shell";
import { CompleteSignUpForm } from "@/features/auth/complete-sign-up-form";

export const metadata: Metadata = { title: "Complete sign-up" };

export default function CompleteSignUpPage() {
  return <AuthCard><CompleteSignUpForm/></AuthCard>;
}
