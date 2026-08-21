"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Database, FileSearch, Brain } from "lucide-react";

const STAGES = [
  { text: "Scanning FAISS Vector Database...", icon: Database },
  { text: "Retrieving row-level data chunks...", icon: FileSearch },
  { text: "Synthesizing salary reports with Gemini LLM...", icon: Brain },
];

export default function Loader() {
  const [stageIdx, setStageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStageIdx((prev) => (prev + 1) % STAGES.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const ActiveIcon = STAGES[stageIdx].icon;

  return (
    <div className="flex gap-4 w-full justify-start animate-fade-in">
      {/* Pulse icon wrapper */}
      <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 animate-pulse relative shadow-sm">
        <Sparkles className="w-4 h-4" />
        <div className="absolute inset-0 rounded-lg ring-2 ring-indigo-500/30 animate-ping opacity-30" />
      </div>

      <div className="flex-1 space-y-3.5 max-w-[70%]">
        {/* Header indicator */}
        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-zinc-500 font-medium">
          <span>Market Insights Bot</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
            <ActiveIcon className="w-3 h-3 animate-bounce" />
            {STAGES[stageIdx].text}
          </span>
        </div>

        {/* Shimmering Text Skeleton lines */}
        <div className="space-y-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 rounded-2xl p-4 w-full shadow-sm">
          <div className="h-3.5 bg-slate-200 dark:bg-zinc-800 rounded-md w-[95%] animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/40 dark:via-zinc-700/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
          <div className="h-3.5 bg-slate-200 dark:bg-zinc-800 rounded-md w-[85%] animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/40 dark:via-zinc-700/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
          <div className="h-3.5 bg-slate-200 dark:bg-zinc-800 rounded-md w-[50%] animate-pulse relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-300/40 dark:via-zinc-700/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
