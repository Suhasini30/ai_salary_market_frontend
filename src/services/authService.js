import api from "./api";

export const authService = {
  /**
   * Exchanges a Clerk session token for our own access token + refresh cookie.
   * Clerk tokens only carry `sub`; email/username come from Clerk's user object.
   */
  async login(clerkToken, { email, username } = {}) {
    const res = await api.post("/api/auth/login", {
      clerk_token: clerkToken,
      email: email || undefined,
      username: username || undefined,
    });
    return res.data;
  },

  async verify(clerkToken, { email, username } = {}) {
    const res = await api.post("/api/auth/verify", {
      clerk_token: clerkToken,
      email: email || undefined,
      username: username || undefined,
    });
    return res.data;
  },

  async refresh() {
    const res = await api.post(
      "/api/auth/refresh",
      {},
      { withCredentials: true }
    );
    return res.data;
  },

  async logout() {
    await api.post("/api/auth/logout", {}, { withCredentials: true });
  },

  async me() {
    const res = await api.get("/api/auth/me");
    return res.data;
  },

  async session() {
    const res = await api.get("/api/auth/session", { withCredentials: true });
    return res.data;
  },
};