"use server";

import { redirect } from "next/navigation";
import { students, teacher } from "@/shared/data/fixtures";
import { signIn, signOut } from "../../../auth";
import { clearDemoSession, writeDemoSession } from "@/features/session/demo-session";

export async function signInWithGoogle(formData: FormData) {
  const entryRoute = formData.get("flow") === "sign-up" ? "/sign-up" : "/sign-in";
  const requestedRole = formData.get("role");
  const role = requestedRole === "teacher" ? "teacher" : "student";
  if (!process.env.AUTH_SECRET || !process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
    redirect(`${entryRoute}?error=google-not-configured`);
  }

  // The role chosen at sign-in becomes the simulated session, so no page has to
  // read it from the URL. Demonstrative only — see demo-session.ts.
  await writeDemoSession({ userId: role === "teacher" ? teacher.id : students[0].id, role });
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signOutUser() {
  await clearDemoSession();
  await signOut({ redirectTo: "/sign-in" });
}
