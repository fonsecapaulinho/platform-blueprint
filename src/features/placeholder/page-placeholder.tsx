import type { ReactNode } from "react";

/**
 * Stand-in body for a route that exists but whose page is built by a later card.
 * Keeps the route real — it renders, it is reachable, it carries one h1 — without
 * guessing at a layout that S1.4 and the page cards will decide.
 */
export function PagePlaceholder({
  title,
  page,
  card,
  children,
}: {
  title: string;
  /** Page number from the delivery scope, e.g. "04". */
  page: string;
  /** Card that builds this page for real. */
  card: string;
  children?: ReactNode;
}) {
  return (
    <section>
      <p>
        Page {page} · built by {card}
      </p>
      <h1>{title}</h1>
      {children}
    </section>
  );
}
