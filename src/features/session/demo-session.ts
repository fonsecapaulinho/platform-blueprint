import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { teacher } from "@/shared/data/fixtures";
import { services } from "@/shared/data/services";
import { roleSchema, type Role, type Session } from "@/shared/domain";

/**
 * DEMONSTRATION ONLY — THIS IS NOT AUTHORIZATION.
 *
 * The cookie below is unsigned, unencrypted and trivially editable from the
 * browser: anyone can set `role` to "teacher" and reach every teacher route.
 * That is deliberate for this stage, where the delivery scope says sessions and
 * permissions are represented with controlled data and real security is enforced
 * by the services that are not part of these 120 hours.
 *
 * When the real API arrives, every guard in this file has to be replaced by a
 * server-side check against an authenticated session, and the routes must not
 * trust anything the client sends about who it is.
 */
const COOKIE = "blueprint-demo-session";

export type StoredSession = { userId: string; role: Role };

/** Exported so the untrusted-input handling can be tested without a request. */
export function parseDemoSession(raw: string | undefined): StoredSession | null {
  if (raw === undefined) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return null;
    const { userId, role } = value as Record<string, unknown>;
    const parsedRole = roleSchema.safeParse(role);
    if (typeof userId !== "string" || userId === "" || !parsedRole.success) return null;
    return { userId, role: parsedRole.data };
  } catch {
    return null;
  }
}

export async function writeDemoSession(stored: StoredSession): Promise<void> {
  const store = await cookies();
  store.set(COOKIE, JSON.stringify(stored), { httpOnly: true, sameSite: "lax", path: "/" });
}

export async function clearDemoSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

/**
 * Resolves the stored id against the mock data layer, so the role a page sees is
 * the one the data says, never a value a component was handed.
 */
export async function getSession(): Promise<Session | null> {
  const stored = parseDemoSession((await cookies()).get(COOKIE)?.value);
  if (stored === null) return null;
  return resolveSession(stored);
}

/** Exported for tests: the cookie-free half of getSession. */
export async function resolveSession(stored: StoredSession): Promise<Session | null> {

  if (stored.role === "teacher") {
    if (stored.userId !== teacher.id) return null;
    return { user: teacher, level: null };
  }

  try {
    const student = await services.students.get(stored.userId);
    return { user: student, level: student.level };
  } catch {
    return null;
  }
}

/** Guards the authenticated route group. */
export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (session === null) redirect("/sign-in?from=session-expired");
  return session;
}

/**
 * Guards a route that belongs to one role. Demonstrative only — see the notice
 * at the top of this file.
 */
export async function requireRole(role: Role): Promise<Session> {
  const session = await requireSession();
  if (session.user.role !== role) redirect(`/dashboard?denied=${role}`);
  return session;
}
