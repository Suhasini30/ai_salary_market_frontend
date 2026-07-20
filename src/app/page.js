"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import ChatContainer from "../components/ChatContainer";
import ChatInput from "../components/ChatInput";
import useChat from "../hooks/useChat";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
