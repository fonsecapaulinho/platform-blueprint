"use client";

import { FormHeader } from "@/shared/layout/auth-shell";
import { useLocale } from "@/shared/layout/locale-provider";
import { signOutUser } from "@/features/auth/actions";
import { dashboardMessages } from "./dashboard-view.translations";
import styles from "@/shared/layout/auth.module.css";

export function DashboardView({ name, email, role }: { name: string; email: string; role?: "student" | "teacher" }) {
  const { locale } = useLocale();
  const messages = dashboardMessages[locale];

  return <>
    <FormHeader title={messages.title} description={messages.description}/>
    <p className={styles.userIdentity}>{name || email}</p>
    {name && <p className={styles.userEmail}>{email}</p>}
    {role && <p className={styles.userRole}>{role === "teacher" ? messages.teacher : messages.student}</p>}
    <form action={signOutUser} className={styles.form}>
      <button className={styles.signOutButton} type="submit">{messages.signOut}</button>
    </form>
  </>;
}
