import type { SelectHTMLAttributes } from "react";
import styles from "./ui.module.css";

export type SelectOption = { value: string; label: string };
type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  options: SelectOption[];
  placeholder: string;
  error?: string;
};

export function SelectField({ id, label, options, placeholder, error, className = "", ...props }: SelectFieldProps) {
  return <div className={styles.field}>
    <label htmlFor={id}>{label}</label>
    <select
      {...props}
      id={id}
      className={`${styles.input} ${styles.select} ${className}`}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
    {error && <p id={`${id}-error`} className={styles.error}>{error}</p>}
  </div>;
}
