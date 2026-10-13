import type { AuthService } from "./auth-service";

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, 650));

/** No network, cookies, storage, email delivery or actual password changes. */
export const mockAuthService: AuthService = {
  async signIn({ email, password, role }) {
    await delay();
    const accounts = {
      student: { email: "aluno@example.com", password: "Demo123!" },
      teacher: { email: "professor@example.com", password: "Demo123!" },
    };
    const account = accounts[role];
    return { ok: email.trim().toLowerCase() === account.email && password === account.password };
  },
  async requestRecovery(_email) { await delay(); },
  async resetPassword(_code, _password) { await delay(); },
};
