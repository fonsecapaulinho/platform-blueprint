import styles from "./brand.module.css";

export function Brand() {
  return <div className={styles.brand} aria-label="BLUEPRINT">
    <span className={styles.symbol} aria-hidden="true">B<span/></span>
    <span className={styles.wordmark}>BLUEPRINT</span>
  </div>;
}
