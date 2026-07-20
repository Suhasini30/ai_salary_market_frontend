"use client";

import React from "react";
import { Plus, MessageSquare, Trash2, X, Sparkles, TrendingUp } from "lucide-react";

export default function Sidebar({
  isOpen,
  onClose,
  history = [],
  currentChatId = null,
  onSelectChat,
  onNewChat,
  onClearHistory,
}) {
  return (
    <>
      {/* Backdrop for mobile drawer mode */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar drawer container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-zinc-800/80 bg-zinc-950 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Branding */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800/50">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-600/10 rounded-lg text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-4.5 h-4.5" />
            </div>
            <span className="font-semibold text-sm tracking-wide text-zinc-200">
              Insights Workspace
            </span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 md:hidden cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Button: Start New Chat */}
        <div className="p-3.5">
          <button
            onClick={() => {
              onNewChat();
              if (onClose) onClose(); // Close mobile drawer
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 hover:scale-[0.98] active:scale-[0.96] transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Salary Search
          </button>
        </div>

        {/* Saved Sessions list / Chat History */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 py-2">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
            Recent Searches
          </div>
          {history.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-zinc-500 italic select-none">
              No recent salary searches.
            </div>
          ) : (
            history.map((chat) => {
              const isActive = chat.id === currentChatId;
              return (
                <button
                  key={chat.id}
                  onClick={() => {
                    onSelectChat(chat.id);
                    if (onClose) onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-all duration-150 group relative cursor-pointer ${
                    isActive
                      ? "bg-zinc-800/80 text-zinc-100 font-medium"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-indigo-400" : "text-zinc-500 group-hover:text-zinc-400"}`} />
                  <span className="truncate pr-4 flex-1">{chat.title || "Salary Insight Query"}</span>
                  {isActive && (
                    <span className="absolute right-2 top-3 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer Area: Info, Credits & Clear History */}
        <div className="p-3 border-t border-zinc-900 bg-zinc-950/80 space-y-2.5">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Recent Searches
            </button>
          )}

          <div className="rounded-xl bg-zinc-900/40 border border-zinc-800/60 p-3 flex gap-2.5 select-none">
            <Sparkles className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-zinc-400">
              <p className="font-semibold text-zinc-300">FastAPI RAG Backend</p>
              <p className="text-zinc-500 mt-0.5"> FAISS database retrieves contextual document chunks instantly.</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
