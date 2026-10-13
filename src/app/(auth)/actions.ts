"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "../../../auth";

export async function signInWithGoogle(formData: FormData) {
  const entryRoute = formData.get("flow") === "sign-up" ? "/sign-up" : "/sign-in";
  if (!process.env.AUTH_SECRET || !process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
    redirect(`${entryRoute}?error=google-not-configured`);
  }

  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutUser() {
  await signOut({ redirectTo: "/sign-in" });
}
