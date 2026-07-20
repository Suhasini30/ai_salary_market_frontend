"use client";

import { useState, useEffect, useCallback } from "react";
import { chatService } from "../services/chatService";

export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [history, setHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [lastUserPrompt, setLastUserPrompt] = useState("");

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("salary_chat_history");
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        if (parsed.length > 0) {
          // Default to the most recent chat session
          setCurrentChatId(parsed[0].id);
          setMessages(parsed[0].messages || []);
        }
      } catch (err) {
        console.error("Failed to parse chat history from localStorage:", err);
      }
    }
  }, []);

  // Periodic health check to backend
  useEffect(() => {
    const checkApiHealth = async () => {
      const active = await chatService.checkConnection();
      setIsConnected(active);
    };

    checkApiHealth();
    const interval = setInterval(checkApiHealth, 10000); // Check health every 10s
    return () => clearInterval(interval);
  }, []);

  // Save history helper
  const saveHistoryToStorage = useCallback((updatedHistory) => {
    setHistory(updatedHistory);
    localStorage.setItem("salary_chat_history", JSON.stringify(updatedHistory));
  }, []);

  // Start a fresh empty session
  const startNewChat = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setCurrentChatId(null);
  }, []);

  // Select a past session from Sidebar
  const selectChat = useCallback((chatId) => {
    const session = history.find((h) => h.id === chatId);
    if (session) {
      setCurrentChatId(chatId);
      setMessages(session.messages || []);
      setError(null);
    }
  }, [history]);

  // Send query action with event streaming support
  const sendMessage = useCallback(async (promptText) => {
    if (!promptText.trim()) return;

    setError(null);
    setLastUserPrompt(promptText);

    // Create user message
    const userMsg = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: "user",
      content: promptText,
      timestamp: new Date().toISOString(),
      sources: null,
    };

    // Append user message immediately
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    // Prepare container for the bot response
    const botMsgId = `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const botMsg = {
      id: botMsgId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      sources: null, // Note: sources cards can render here if sources list is returned
    };

    try {
      // Connect to the stream reader
      const reader = await chatService.getChatStream(promptText, "fast");
      
      // Insert empty bot message in list to stream into
      setMessages((prev) => [...prev, botMsg]);

      const decoder = new TextDecoder("utf-8");
      let botContent = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        // Decode binary chunk to text stream
        const chunkText = decoder.decode(value, { stream: true });
        botContent += chunkText;

        // Progressively update text stream in real-time
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsgId ? { ...msg, content: botContent } : msg
          )
        );
      }

      // Stream completed successfully, update history
      let activeId = currentChatId;
      let newHistory = [...history];
      
      const finalBotMsg = { ...botMsg, content: botContent };
      const finalMessages = [...updatedMessages, finalBotMsg];

      if (!activeId) {
        activeId = `session-${Date.now()}`;
        setCurrentChatId(activeId);
        
        const newSession = {
          id: activeId,
          title: promptText.length > 28 ? `${promptText.substring(0, 25)}...` : promptText,
          messages: finalMessages,
          timestamp: new Date().toISOString(),
        };
        newHistory = [newSession, ...newHistory];
      } else {
        newHistory = newHistory.map((session) => {
          if (session.id === activeId) {
            return {
              ...session,
              messages: finalMessages,
              timestamp: new Date().toISOString(),
            };
          }
          return session;
        });
      }
      
      saveHistoryToStorage(newHistory);
    } catch (err) {
      setError(err.message || "Failed to retrieve streaming response from backend.");
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentChatId, history, saveHistoryToStorage]);

  // Retry trigger
  const retryLastMessage = useCallback(() => {
    if (!lastUserPrompt) return;
    sendMessage(lastUserPrompt);
  }, [lastUserPrompt, sendMessage]);

  // Clear history list
  const clearHistory = useCallback(() => {
    saveHistoryToStorage([]);
    startNewChat();
  }, [saveHistoryToStorage, startNewChat]);

  return {
    messages,
    isLoading,
    error,
    isConnected,
    history,
    currentChatId,
    sendMessage,
    retryLastMessage,
    startNewChat,
    selectChat,
    clearHistory,
  };
}
