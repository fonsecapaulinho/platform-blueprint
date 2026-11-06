import styles from "./ui.module.css";

export function Feedback({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "error" | "success" }) {
  return <div className={`${styles.feedback} ${styles[tone]}`} role={tone === "error" ? "alert" : "status"}>{children}</div>;
}
