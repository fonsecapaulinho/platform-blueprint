import styles from "./brand.module.css";

export function Brand() {
  return <div className={styles.brand} aria-label="Fonseca Consulting">
    <span className={styles.symbol} aria-hidden="true">f<span/></span>
    <span className={styles.wordmark}>fonseca<span>CONSULTING</span></span>
  </div>;
}
