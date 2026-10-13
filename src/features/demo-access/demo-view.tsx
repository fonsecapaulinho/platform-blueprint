"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AuthCard, FormHeader } from "@/shared/layout/auth-shell";
import { useLocale } from "@/shared/layout/locale-provider";
import { Feedback } from "@/shared/ui/feedback";
import { Icon } from "@/shared/ui/icon";
import styles from "@/shared/layout/auth.module.css";
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
