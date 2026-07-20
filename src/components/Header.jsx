"use client";

import React from "react";
import { Menu, TrendingUp, RefreshCw } from "lucide-react";

export default function Header({ onMenuToggle, onClearChat }) {
  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-4 sticky top-0 z-30 md:hidden select-none">
      {/* Sidebar Mobile Toggle Hamburger */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 cursor-pointer"
        aria-label="Toggle Sidebar Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Brand logo & mobile title */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-indigo-400" />
        <span className="font-semibold text-xs tracking-wide text-zinc-100">
          Salary Insights Bot
        </span>
      </div>

      {/* Reset session button */}
      <button
        onClick={onClearChat}
        className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-rose-400 cursor-pointer"
        title="Reset Chat"
      >
        <RefreshCw className="w-4 h-4" />
      </button>
    </header>
  );
}
