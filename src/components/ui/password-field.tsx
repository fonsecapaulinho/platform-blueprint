"use client";

import { useState } from "react";
import { TextField, type TextFieldProps } from "./text-field";
import { Icon } from "./icon";
import styles from "./ui.module.css";

export function PasswordField(props: Omit<TextFieldProps, "type" | "endAdornment">) {
  const [visible, setVisible] = useState(false);
  return <TextField {...props} type={visible ? "text" : "password"} endAdornment={<button type="button" className={styles.reveal} onClick={() => setVisible(!visible)} aria-label={visible ? "Ocultar senha" : "Mostrar senha"} aria-controls={props.id}><Icon name={visible ? "eye-off" : "eye"}/></button>}/>;
}
