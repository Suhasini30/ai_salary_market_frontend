"use client";

import React from "react";
import { SUGGESTED_QUESTIONS } from "../constants/suggestions";
import { MessageSquare, CornerDownLeft } from "lucide-react";

export default function SuggestedQuestions({ onSelectSuggestion }) {
  return (
    <div className="w-full space-y-4 select-none">
      <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5 px-1">
        <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
        Suggested Research Queries
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SUGGESTED_QUESTIONS.map((question) => (
          <button
            key={question.id}
            onClick={() => onSelectSuggestion(question.text)}
            className="text-left p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/80 hover:bg-zinc-900/90 hover:border-zinc-700/80 transition-all duration-200 group flex items-start justify-between gap-3 shadow-sm hover:shadow-md cursor-pointer hover:scale-[1.01]"
          >
            <div className="space-y-1 overflow-hidden">
              <p className="text-xs font-semibold text-zinc-200 group-hover:text-indigo-400 transition-colors truncate">
                {question.label}
              </p>
              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {question.description}
              </p>
            </div>
            
            <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 flex-shrink-0 transition-all self-center">
              <CornerDownLeft className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
