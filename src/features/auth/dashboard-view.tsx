"use client";

import { FormHeader } from "@/components/auth/auth-shell";
import { useLocale } from "@/components/auth/locale-provider";
import { signOutUser } from "@/app/(auth)/actions";
import { dashboardMessages } from "./dashboard-view.translations";
import styles from "@/components/auth/auth.module.css";

export function DashboardView({ name, email }: { name: string; email: string }) {
  const { locale } = useLocale();
  const messages = dashboardMessages[locale];

  return <>
    <FormHeader title={messages.title} description={messages.description}/>
    <p className={styles.userIdentity}>{name || email}</p>
    {name && <p className={styles.userEmail}>{email}</p>}
    <form action={signOutUser} className={styles.form}>
      <button className={styles.signOutButton} type="submit">{messages.signOut}</button>
    </form>
  </>;
}
