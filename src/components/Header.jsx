"use client";

import React from "react";
import { Menu, TrendingUp, RefreshCw, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useAuthContext } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Header({ onMenuToggle, onClearChat }) {
  const { status, appUser, signOut } = useAuthContext();
  const { user, isSignedIn } = useUser();

  const userEmail = appUser?.email || user?.primaryEmailAddress?.emailAddress;
  const displayName =
    appUser?.username || user?.username || user?.firstName || userEmail?.split("@")[0] || "User";
  const userIsLoggedIn = status === "authenticated" || isSignedIn;

  return (
    <header className="h-14 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center justify-between px-4 sticky top-0 z-30 md:hidden select-none transition-colors duration-200">
      {/* Sidebar Mobile Toggle Hamburger */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 cursor-pointer"
        aria-label="Toggle Sidebar Menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Brand logo & mobile title */}
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
        <span className="font-semibold text-xs tracking-wide text-slate-900 dark:text-zinc-100">
          Salary Insights Bot
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Mobile Theme Toggle */}
        <ThemeToggle compact={true} />

        {/* User badge */}
        {userIsLoggedIn && userEmail ? (
          <div className="flex items-center gap-1.5 max-w-[140px] bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">
            <User className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
            <span className="text-xs text-slate-800 dark:text-zinc-200 font-medium truncate" title={userEmail}>
              {displayName}
            </span>
            <button
              onClick={signOut}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer ml-0.5"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <Link
            href="/sign-in"
            className="text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg shadow-sm cursor-pointer"
          >
            Sign in
          </Link>
        )}

        {/* Reset session button */}
        <button
          onClick={onClearChat}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
          title="Reset Chat"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}