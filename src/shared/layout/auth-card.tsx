"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./auth.module.css";

type AuthCardProps = {
  children: ReactNode;
  /** Opt in to the role flip. Ordinary cards remain static by default. */
  enableFlip?: boolean;
  flipped?: boolean;
  back?: ReactNode;
};

export function AuthCard({ children, enableFlip = false, flipped = false, back }: AuthCardProps) {
  const container = useRef<HTMLDivElement>(null);
  const previous = useRef(flipped);

  useEffect(() => {
    if (previous.current !== flipped) {
      container.current?.querySelector<HTMLButtonElement>('[aria-hidden="false"] button[aria-pressed="true"]')?.focus({ preventScroll: true });
    }
    previous.current = flipped;
  }, [flipped]);

  if (!enableFlip || back === undefined) return <section className={styles.card}>{flipped && back !== undefined ? back : children}</section>;

  return <div ref={container} className={styles.cardScene}>
    <div className={styles.cardFlipper} data-flipped={flipped}>
      <section className={`${styles.card} ${styles.cardFace}`} data-face="front" inert={flipped} aria-hidden={flipped}>{children}</section>
      <section className={`${styles.card} ${styles.cardFace}`} data-face="back" inert={!flipped} aria-hidden={!flipped}>{back}</section>
    </div>
  </div>;
}
