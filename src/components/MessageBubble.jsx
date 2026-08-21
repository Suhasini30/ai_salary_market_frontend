"use client";

import React, { useState } from "react";
import { User, Sparkles, Copy, Check, ChevronDown, ChevronUp, FileText, BarChart2 } from "lucide-react";
import { formatTime } from "../utils/formatTime";

export default function MessageBubble({ message }) {
  const { role, content, timestamp, sources } = message;
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 w-full group ${isUser ? "justify-end" : "justify-start"}`}>
      {/* Avatar Indicator */}
      {!isUser && (
        <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 shadow-sm">
          <Sparkles className="w-4 h-4" />
        </div>
      )}

      {/* Message content panel */}
      <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col space-y-2 ${isUser ? "items-end" : "items-start"}`}>
        {/* Header Metadata */}
        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-zinc-500 font-medium">
          <span>{isUser ? "You" : "Market Insights Bot"}</span>
          <span>•</span>
          <span>{formatTime(timestamp)}</span>
        </div>

        {/* Text bubble */}
        <div
          className={`rounded-2xl px-4 py-3.5 text-sm leading-relaxed border transition-all duration-200 shadow-sm ${
            isUser
              ? "bg-indigo-600 border-indigo-500/50 text-white rounded-tr-none shadow-indigo-600/10"
              : "bg-white dark:bg-zinc-900 border-slate-200/90 dark:border-zinc-800/80 text-slate-800 dark:text-zinc-200 rounded-tl-none"
          }`}
        >
          {/* Simple line break and bold parsing for premium look */}
          <div className="whitespace-pre-wrap select-text">
            {content.split("\n").map((line, idx) => {
              // Basic bold markdown simulation (**bold**)
              if (line.includes("**")) {
                const parts = line.split("**");
                return (
                  <p key={idx} className="mb-2 last:mb-0">
                    {parts.map((part, pIdx) => (pIdx % 2 === 1 ? <strong key={pIdx} className="font-semibold text-slate-900 dark:text-zinc-100">{part}</strong> : part))}
                  </p>
                );
              }
              // Basic list item simulation
              if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
                return (
                  <li key={idx} className="list-disc list-inside ml-2 mb-1.5 text-slate-700 dark:text-zinc-300">
                    {line.replace(/^[-*]\s+/, "")}
                  </li>
                );
              }
              return <p key={idx} className="mb-2 last:mb-0">{line}</p>;
            })}
          </div>
        </div>

        {/* RAG Source Cards Expandable Panel (Bot Only) */}
        {!isUser && sources && sources.length > 0 && (
          <div className="w-full mt-2">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 cursor-pointer select-none bg-indigo-500/5 border border-indigo-500/15 rounded-lg px-2.5 py-1.5 transition-all"
            >
              <FileText className="w-3 h-3" />
              <span>{showSources ? "Hide Cited Sources" : `View Sources (${sources.length})`}</span>
              {showSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showSources && (
              <div className="mt-2 grid grid-cols-1 gap-2.5 w-full">
                {sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800/80 flex flex-col space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      {/* Document details */}
                      <span className="text-[11px] font-bold text-slate-800 dark:text-zinc-300 flex items-center gap-1.5 truncate">
                        <FileText className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        {source.document || "salary_database.csv"}
                      </span>
                      
                      {/* Search metrics */}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-semibold text-slate-600 dark:text-zinc-500 bg-slate-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                          {source.type || "Row Retrieval"}
                        </span>
                        {source.score !== undefined && (
                          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                            <BarChart2 className="w-2.5 h-2.5" />
                            {Math.round(source.score * 100)}% Match
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Source content snippet */}
                    <p className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-400 italic bg-white dark:bg-zinc-950/40 p-2 rounded border border-slate-200 dark:border-zinc-900 font-mono overflow-x-auto whitespace-pre-wrap">
                      {source.chunk_content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Copy Button (Bot Only) */}
        {!isUser && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1 select-none">
            <button
              onClick={handleCopy}
              className="p-1 rounded-md text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300 hover:bg-slate-200/60 dark:hover:bg-zinc-800/60 cursor-pointer flex items-center gap-1 text-[10px]"
              title="Copy answer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700/50 flex items-center justify-center flex-shrink-0 shadow-sm">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
