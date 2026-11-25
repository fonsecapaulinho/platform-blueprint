import { requireSession } from "@/features/session/demo-session";

/**
 * The authenticated route group, separate from `(auth)`. Everything under it
 * requires a simulated session; the guard is demonstrative only, as the notice in
 * demo-session.ts explains.
 *
 * The markup here is deliberately bare: AppShell, Sidebar and Topbar (S1.4)
 * replace it, and guessing at that layout now would be work thrown away.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireSession();
  return (
    <main id="main-content" tabIndex={-1}>
      {children}
    </main>
  );
}
