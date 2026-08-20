"use client";

import { useState, useEffect, useCallback } from "react";
import { chatService } from "../services/chatService";
import { useAuthContext } from "../context/AuthContext";

/**
 * Parses an SSE response body from the backend. The wire format is:
 *   event: <name>\n data: <json>\n\n
 */
async function readSSE(reader, onEvent) {
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let idx;
    while ((idx = buffer.indexOf("\n\n")) !== -1) {
      const raw = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);

      let eventName = null;
      let data = null;
      for (const line of raw.split("\n")) {
        if (line.startsWith("event:")) eventName = line.slice(6).trim();
        else if (line.startsWith("data:")) data = line.slice(5).trim();
      }
      if (eventName && data) {
        try {
          onEvent(eventName, JSON.parse(data));
        } catch {
          onEvent(eventName, { raw: data });
        }
      }
    }
  }
}

export default function useChat() {
  const { status: authStatus } = useAuthContext();

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [lastUserPrompt, setLastUserPrompt] = useState("");

  // Load the user's conversations whenever the auth state settles (guest or
  // authenticated). Every request carries a token / guest id, so the backend
  // only ever returns THIS user's own conversation history.
  const loadConversations = useCallback(async () => {
    try {
      const list = await chatService.listConversations();
      setConversations(list || []);
    } catch (e) {
      console.error("Failed to load conversations:", e);
    }
  }, []);

  useEffect(() => {
    if (authStatus === "loading") return;
    let cancelled = false;
    chatService
      .listConversations()
      .then((list) => {
        if (!cancelled) setConversations(list || []);
      })
      .catch((e) => console.error("Failed to load conversations:", e));
    return () => {
      cancelled = true;
    };
  }, [authStatus]);

  // Periodic backend health check.
  useEffect(() => {
    const checkApiHealth = async () => {
      setIsConnected(await chatService.checkConnection());
    };
    checkApiHealth();
    const interval = setInterval(checkApiHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setCurrentChatId(null);
  }, []);

  // Select a past conversation (loads its messages from the backend).
  const selectChat = useCallback(
    async (chatId) => {
      setCurrentChatId(chatId);
      setError(null);
      try {
        const detail = await chatService.getConversation(chatId);
        const loaded = (detail.messages || []).map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          sources: m.sources || [],
          timestamp: m.created_at,
        }));
        setMessages(loaded);
      } catch (e) {
        setError("Could not load this conversation.");
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (promptText) => {
      if (!promptText.trim()) return;

      setError(null);
      setLastUserPrompt(promptText);

      const userMsg = {
        id: `user-${Date.now()}`,
        role: "user",
        content: promptText,
        timestamp: new Date().toISOString(),
        sources: null,
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      const botMsgId = `bot-${Date.now()}`;
      let botContent = "";
      let streamSources = [];
      let activeId = currentChatId;

      const applyBot = (content, sources) =>
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== botMsgId),
          {
            id: botMsgId,
            role: "assistant",
            content,
            timestamp: new Date().toISOString(),
            sources: sources || [],
          },
        ]);

      // Insert a placeholder bot bubble immediately.
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: "assistant",
          content: "",
          timestamp: new Date().toISOString(),
          sources: [],
        },
      ]);

      try {
        const reader = await chatService.getChatStream(promptText, activeId);

        await readSSE(reader, (eventName, data) => {
          if (eventName === "meta") {
            activeId = data.conversation_id || activeId;
            setCurrentChatId(activeId);
          } else if (eventName === "sources") {
            streamSources = data.sources || [];
          } else if (eventName === "token") {
            botContent += data.content || "";
            applyBot(botContent, streamSources);
          } else if (eventName === "done") {
            if (data.conversation_id) {
              activeId = data.conversation_id;
              setCurrentChatId(activeId);
            }
            applyBot(botContent, streamSources);
          } else if (eventName === "error") {
            setError(data.detail || data.raw || "Something went wrong.");
          }
        });

        applyBot(botContent, streamSources);
        loadConversations();
      } catch (err) {
        // Remove the placeholder bubble on failure.
        setMessages((prev) => prev.filter((m) => m.id !== botMsgId));
        setError(err.message || "Failed to retrieve streaming response from backend.");
      } finally {
        setIsLoading(false);
      }
    },
    [currentChatId, loadConversations]
  );

  const retryLastMessage = useCallback(() => {
    if (!lastUserPrompt) return;
    sendMessage(lastUserPrompt);
  }, [lastUserPrompt, sendMessage]);

  const clearHistory = useCallback(async () => {
    for (const c of conversations) {
      try {
        await chatService.deleteConversation(c.id);
      } catch {
        // Ignore per-item failures.
      }
    }
    setConversations([]);
    startNewChat();
  }, [conversations, startNewChat]);

  return {
    messages,
    isLoading,
    error,
    isConnected,
    history: conversations,
    currentChatId,
    sendMessage,
    retryLastMessage,
    startNewChat,
    selectChat,
    clearHistory,
  };
}