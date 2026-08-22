"use client";

import React from "react";
import { TrendingUp, Cpu, RefreshCw, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useAuthContext } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import GitHubConnectButton from "./GitHubConnectButton";

export default function Navbar({ onClearChat, isConnected = true }) {
  const { status, appUser, signOut } = useAuthContext();
  const { user, isSignedIn } = useUser();

  const userEmail = appUser?.email || user?.primaryEmailAddress?.emailAddress;
  const userDisplayName = appUser?.username || user?.username || user?.firstName || userEmail?.split("@")[0] || "User";
  const userIsLoggedIn = status === "authenticated" || isSignedIn;

  return (
    <nav className="h-16 border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30 select-none transition-colors duration-200">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-600/10 rounded-xl text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 shadow-sm shadow-indigo-500/10">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-semibold text-sm tracking-wide text-slate-900 dark:text-zinc-100 flex items-center gap-1.5 sm:text-base">
            AI Salary & Market Insights
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              RAG v1.0
            </span>
          </h1>
        </div>
      </div>

      {/* Connection, LLM Status, Theme & Account Controls */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Backend Connectivity Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-700/50 text-xs">
          <div className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? "bg-emerald-400" : "bg-rose-400"}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? "bg-emerald-500" : "bg-rose-500"}`}></span>
          </div>
          <span className="text-slate-500 dark:text-zinc-400 hidden sm:inline">FAISS Vector DB:</span>
          <span className={`font-medium ${isConnected ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>

        {/* Engine spec pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-800/30 border border-slate-200 dark:border-zinc-800 text-xs text-slate-600 dark:text-zinc-400">
          <Cpu className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          <span>LLM: Gemini / Groq</span>
        </div>

        {/* Account: signed-in user email + sign out, or sign-in link */}
        {userIsLoggedIn && userEmail ? (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-800 dark:text-zinc-200">
            <User className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            <span className="max-w-[180px] truncate font-medium" title={userEmail}>
              {userDisplayName}
            </span>
            <button
              onClick={signOut}
              className="p-1 rounded-md text-slate-400 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-zinc-800 cursor-pointer transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/20 transition-all duration-200 cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            Sign in
          </Link>
        )}

        {/* Reset Chat Session Action */}
        <button
          onClick={onClearChat}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-200 cursor-pointer"
          title="Reset session and start a new chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Session</span>
        </button>
      </div>
    </nav>
  );
}
