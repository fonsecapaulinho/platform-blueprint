"use server";

import { redirect } from "next/navigation";
import { students, teacher } from "@/shared/data/fixtures";
import { writeDemoSession } from "./demo-session";

/**
 * Enters the demonstration as one of the fixture users, so the pages can be
 * walked through before Google OAuth is configured. Not a login — see the notice
 * in demo-session.ts. Signing out goes through `signOutUser` in
 * `features/auth/actions.ts`, which clears this session and the Auth.js one.
 */
export async function startDemoSession(formData: FormData): Promise<void> {
  const requested = formData.get("role");
  if (requested === "teacher") await writeDemoSession({ userId: teacher.id, role: "teacher" });
  else await writeDemoSession({ userId: students[0].id, role: "student" });
  redirect("/dashboard");
}
