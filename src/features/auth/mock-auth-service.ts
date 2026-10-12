import type { AuthService } from "./auth-service";

/** Public, fictitious demo credentials. Never replace with real credentials. */
export const DEMO_ACCOUNT = { email: "aluno@example.com", password: "Demo123!" } as const;
const delay = () => new Promise<void>((resolve) => setTimeout(resolve, 650));

/** No network, cookies, storage, email delivery or actual password changes. */
export const mockAuthService: AuthService = {
  async signIn({ email, password }) {
    await delay();
    if (email.trim().toLowerCase() === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password) return { ok: true };
    return { ok: false, message: "E-mail ou senha não conferem. Use os dados de demonstração abaixo." };
  },
  async requestRecovery(_email) { await delay(); },
  async resetPassword(_password) { await delay(); },
};
