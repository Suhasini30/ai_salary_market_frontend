"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "", showLabel = false, compact = false }) {
  const { theme, toggleTheme, mounted } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
        compact
          ? "p-1.5 hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100"
          : "p-2 bg-slate-200/70 hover:bg-slate-300/80 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-slate-300/60 dark:border-zinc-700/50 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 shadow-sm"
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {mounted && (
          isDark ? (
            <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 scale-100" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 rotate-0 scale-100" />
          )
        )}
      </div>

      {showLabel && (
        <span className="ml-2 text-xs font-medium select-none">
          {mounted ? (isDark ? "Light Mode" : "Dark Mode") : "Mode"}
        </span>
      )}
    </button>
  );
}
