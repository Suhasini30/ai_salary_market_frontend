"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import ChatContainer from "../components/ChatContainer";
import ChatInput from "../components/ChatInput";
import useChat from "../hooks/useChat";

export default function Home() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const {
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
  } = useChat();

  if (!isLoaded) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-sm text-zinc-400">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex h-full w-full overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Sidebar drawer on left */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        history={history}
        currentChatId={currentChatId}
        onSelectChat={selectChat}
        onNewChat={startNewChat}
        onClearHistory={clearHistory}
      />

      {/* Main chat interface viewport */}
      <div className="flex flex-1 flex-col h-full overflow-hidden relative bg-zinc-900/20">
        {/* Mobile top header bar */}
        <Header
          onMenuToggle={() => setIsSidebarOpen(true)}
          onClearChat={startNewChat}
        />

        {/* Global branding & Status Navbar */}
        <Navbar
          onClearChat={startNewChat}
          isConnected={isConnected}
        />

        {/* Messaging conversation scroll box */}
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          error={error}
          onRetry={retryLastMessage}
          onSelectSuggestion={sendMessage}
        />

        {/* Message entry inputs */}
        <ChatInput
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
