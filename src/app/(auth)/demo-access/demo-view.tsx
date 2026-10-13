"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AuthCard, FormHeader } from "@/components/auth/auth-shell";
import { useLocale } from "@/components/auth/locale-provider";
import { Feedback } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import styles from "@/components/auth/auth.module.css";
import { demoViewMessages } from "./demo-view.translations";

export function DemoView() {
  const { locale } = useLocale();
  const messages = demoViewMessages[locale];
  useEffect(() => { document.title = `${messages.documentTitle} | BLUEPRINT`; }, [messages.documentTitle]);

  return <AuthCard>
    <span className={styles.successIcon}><Icon name="check"/></span>
    <FormHeader title={messages.title} description={messages.description}/>
    <div className={styles.result}>
      <Feedback>{messages.notice}</Feedback>
      <Link className={styles.linkButton} href="/sign-in"><Icon name="back"/>{messages.back}</Link>
    </div>
  </AuthCard>;
}
