"use client";

import React from "react";
import { TrendingUp, Cpu, RefreshCw } from "lucide-react";

export default function Navbar({ onClearChat, isConnected = true }) {
  return (
    <nav className="h-16 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-600/10 rounded-xl text-indigo-400 border border-indigo-500/20 shadow-sm shadow-indigo-500/10">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-semibold text-sm tracking-wide text-zinc-100 flex items-center gap-1.5 sm:text-base">
            AI Salary & Market Insights
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              RAG v1.0
            </span>
          </h1>
        </div>
      </div>

      {/* Connection & LLM Status Controls */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Backend Connectivity Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800/50 border border-zinc-700/50 text-xs">
          <div className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? "bg-emerald-400" : "bg-rose-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-emerald-500" : "bg-rose-500"}`}></span>
          </div>
          <span className="text-zinc-400 hidden sm:inline">FAISS Vector DB:</span>
          <span className={`font-medium ${isConnected ? "text-emerald-400" : "text-rose-400"}`}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {/* Engine spec pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-800/30 border border-zinc-800 text-xs text-zinc-400">
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>LLM: Gemini / Groq</span>
        </div>

        {/* Reset Chat Session Action */}
        <button
          onClick={onClearChat}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 cursor-pointer"
          title="Reset session and start a new chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Session</span>
        </button>
      </div>
    </nav>
  );
}
