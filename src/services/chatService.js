import api, { getAccessToken, getGuestId } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/**
 * Chat + conversation service. All calls go through the axios instance which
 * attaches the user's access token (or a per-session guest id) so the backend
 * scopes every conversation to exactly one user.
 */
export const chatService = {
  /**
   * Stream an answer from the backend (SSE over fetch so we can read tokens).
   */
  async getChatStream(message, conversationId = null) {
    const headers = { "Content-Type": "application/json", "X-Guest-Id": getGuestId() };
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message, conversation_id: conversationId }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(errorText || `API error status: ${response.status}`);
    }
    if (!response.body) {
      throw new Error("No response stream body returned from the server.");
    }
    return response.body.getReader();
  },

  async listConversations() {
    const res = await api.get("/api/conversations");
    return res.data;
  },

  async getConversation(id) {
    const res = await api.get(`/api/conversations/${id}`);
    return res.data;
  },

  async deleteConversation(id) {
    const res = await api.delete(`/api/conversations/${id}`);
    return res.data;
  },

  async checkConnection() {
    try {
      const res = await api.get("/health");
      return res.status >= 200 && res.status < 300;
    } catch {
      return false;
    }
  },
};