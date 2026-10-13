/** UI contract. A production implementation must validate everything on the server. */
export interface AuthService {
  signIn(input: { email: string; password: string; role: "student" | "teacher" }): Promise<{ ok: boolean }>;
  requestRecovery(email: string): Promise<void>;
  resetPassword(password: string): Promise<void>;
}
