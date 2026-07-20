"use client";

import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import Loader from "./Loader";
import EmptyState from "./EmptyState";
import { AlertCircle, RefreshCw } from "lucide-react";
import { scrollToBottom } from "../utils/scrollToBottom";

export default function ChatContainer({
  messages = [],
  isLoading = false,
  error = null,
  onRetry = null,
  onSelectSuggestion,
}) {
  const bottomRef = useRef(null);

  // Auto scroll logic when messages update or loading state changes
  useEffect(() => {
    scrollToBottom(bottomRef);
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 scroll-smooth">
      <div className="max-w-3xl mx-auto w-full flex flex-col space-y-6 min-h-full">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center py-8">
            <EmptyState onSelectSuggestion={onSelectSuggestion} />
          </div>
        ) : (
          <div className="flex-col space-y-6 flex-1">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}

            {/* RAG Bot Reasoning Loader */}
            {isLoading && <Loader />}

            {/* Error Message Display with Retry Trigger */}
            {error && (
              <div className="rounded-xl border border-rose-900/50 bg-rose-950/20 p-4 flex gap-3 text-rose-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rose-400">
                    Query Delivery Error
                  </p>
                  <p className="text-sm leading-relaxed text-rose-300/95">{error}</p>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-medium border border-rose-500/30 transition-all cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Try Sending Again
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
