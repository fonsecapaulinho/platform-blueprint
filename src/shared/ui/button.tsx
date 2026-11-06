import type { ButtonHTMLAttributes } from "react";
import styles from "./ui.module.css";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean; variant?: "primary" | "secondary" };
export function Button({ children, pending = false, variant = "primary", className = "", disabled, type = "button", ...props }: Props) {
  return <button {...props} type={type} className={`${styles.button} ${styles[variant]} ${className}`} disabled={disabled || pending} aria-busy={pending || undefined}>{children}</button>;
}
