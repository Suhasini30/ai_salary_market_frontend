"use client";

import React from "react";
import SuggestedQuestions from "./SuggestedQuestions";
import { TrendingUp, Database, Sparkles, MessageSquareCode } from "lucide-react";

export default function EmptyState({ onSelectSuggestion }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-10 max-w-2xl mx-auto text-center px-4 select-none animate-fade-in">
      {/* Central Illustration and Logo Glow */}
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-600/20 rounded-full blur-3xl scale-[1.5] -z-10 animate-pulse-slow" />
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/10">
          <TrendingUp className="w-8 h-8" />
        </div>
      </div>

      {/* Main onboarding typography */}
      <div className="space-y-3.5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 sm:text-3xl">
          Salary & Market Insights Hub
        </h2>
        <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Ask data-driven questions about compensations, salary percentiles, and market trends. Our vector retrieval system citations back every answer.
        </p>
      </div>

      {/* Feature capabilities grid cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-xl">
        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800/60 space-y-1.5 text-center shadow-sm">
          <Database className="w-4 h-4 text-indigo-500 dark:text-indigo-400 mx-auto" />
          <h3 className="text-xs font-semibold text-slate-800 dark:text-zinc-200">FAISS Storage</h3>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">
            Direct retrieval from row and domain salary datasets.
          </p>
        </div>
        
        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800/60 space-y-1.5 text-center shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto" />
          <h3 className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Contextual RAG</h3>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">
            No hallucination. Responses are synthesized from retrieved chunks.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800/60 space-y-1.5 text-center shadow-sm">
          <MessageSquareCode className="w-4 h-4 text-amber-500 dark:text-amber-400 mx-auto" />
          <h3 className="text-xs font-semibold text-slate-800 dark:text-zinc-200">Citations Cited</h3>
          <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-normal">
            View exact matching records & file logs under answer cards.
          </p>
        </div>
      </div>

      {/* Suggested Questions Grid pills */}
      <div className="w-full pt-4 border-t border-slate-200 dark:border-zinc-900">
        <SuggestedQuestions onSelectSuggestion={onSelectSuggestion} />
      </div>
    </div>
  );
}
