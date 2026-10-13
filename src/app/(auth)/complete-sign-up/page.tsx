import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-shell";
import { CompleteSignUpForm } from "@/features/auth/complete-sign-up-form";

export const metadata: Metadata = { title: "Complete sign-up" };

export default function CompleteSignUpPage() {
  return <AuthCard><CompleteSignUpForm/></AuthCard>;
}
