"use client";

import { useState } from "react";
import { useLocale } from "@/components/auth/locale-provider";
import { TextField, type TextFieldProps } from "./text-field";
import { Icon } from "./icon";
import styles from "./ui.module.css";
import { passwordFieldMessages } from "./password-field.translations";

export function PasswordField(props: Omit<TextFieldProps, "type" | "endAdornment">) {
  const [visible, setVisible] = useState(false);
  const { locale } = useLocale();
  const messages = passwordFieldMessages[locale];
  return <TextField {...props} type={visible ? "text" : "password"} endAdornment={<button type="button" className={styles.reveal} onClick={() => setVisible(!visible)} aria-label={visible ? messages.hide : messages.show} aria-controls={props.id}><Icon name={visible ? "eye-off" : "eye"}/></button>} />;
}
