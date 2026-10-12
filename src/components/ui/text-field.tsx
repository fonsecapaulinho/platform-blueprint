import type { InputHTMLAttributes } from "react";
import styles from "./ui.module.css";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string; label: string; error?: string; hint?: string; endAdornment?: React.ReactNode;
};
export function TextField({ id, label, error, hint, endAdornment, className = "", "aria-describedby": describedBy, ...props }: TextFieldProps) {
  const description = [hint && `${id}-hint`, error && `${id}-error`, describedBy].filter(Boolean).join(" ") || undefined;
  return <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    <div className={styles.inputWrap}>
      <input {...props} id={id} className={`${styles.input} ${endAdornment ? styles.adorned : ""} ${className}`} aria-invalid={error ? true : undefined} aria-describedby={description}/>
      {endAdornment}
    </div>
    {hint && <p id={`${id}-hint`} className={styles.hint}>{hint}</p>}
    {error && <p id={`${id}-error`} className={styles.error}>{error}</p>}
  </div>;
}
