import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Stable per-browser anonymous id so unauthenticated (guest) users each get
// their OWN conversation history on the backend, never a shared guest account.
const GUEST_ID_KEY = "rag_guest_id";

export function getGuestId() {
  let id = null;
  try {
    id = window.localStorage.getItem(GUEST_ID_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(GUEST_ID_KEY, id);
    }
  } catch {
    id = null;
  }
  return id;
}

let accessToken = null;
export function getAccessToken() {
  return accessToken;
}
export function setAccessToken(token) {
  accessToken = token;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach the access token (when present) and the per-session guest id.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  config.headers["X-Guest-Id"] = getGuestId();
  return config;
});

// On 401, try to rotate the refresh token (HttpOnly cookie) and retry once.
let refreshing = null;

async function tryRefresh() {
  if (!refreshing) {
    refreshing = axios
      .post(`${API_BASE_URL}/api/auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        setAccessToken(res.data.access_token);
        return res.data.access_token;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retried &&
      original.url !== "/api/auth/refresh" &&
      original.url !== "/api/auth/login"
    ) {
      original._retried = true;
      try {
        const token = await tryRefresh();
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        setAccessToken(null);
      }
    }
    return Promise.reject(error);
  }
);

export default api;