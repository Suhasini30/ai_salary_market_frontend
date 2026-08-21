"use client";

import React, { useState, useEffect, useCallback } from "react";
import { LogOut, Loader2, ExternalLink } from "lucide-react";
import { useAuthContext } from "../context/AuthContext";
import api from "@/services/api";

function GitHubIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export default function GitHubConnectButton({ compact = false }) {
  const { status: authStatus } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [githubUser, setGithubUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const fetchStatus = useCallback(async () => {
    if (authStatus !== "authenticated") return;
    try {
      setLoading(true);
      const res = await api.get("/api/auth/github/status");
      setIsConnected(res.data.connected);
      setGithubUser(res.data.github_username);
    } catch (err) {
      console.error("Failed to fetch GitHub OAuth status:", err);
    } finally {
      setLoading(false);
    }
  }, [authStatus]);

  useEffect(() => {
    fetchStatus();

    // Listen for message from OAuth popup callback window
    const handleMessage = (event) => {
      if (event.data && event.data.type === "GITHUB_OAUTH_SUCCESS") {
        fetchStatus();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [fetchStatus]);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/auth/github/authorize");
      if (res.data && res.data.url) {
        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
          res.data.url,
          "github_oauth_popup",
          `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes`
        );
      }
    } catch (err) {
      console.error("Failed to launch GitHub OAuth consent flow:", err);
      const detail = err?.response?.data?.detail || err.message;
      alert(`GitHub Connect Error: ${detail}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      const res = await api.post("/api/auth/github/disconnect");
      if (res.data) {
        setIsConnected(false);
        setGithubUser(null);
      }
    } catch (err) {
      console.error("Failed to disconnect GitHub account:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isConnected) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-zinc-800/40 border border-slate-200 dark:border-zinc-800 text-xs text-slate-500 dark:text-zinc-400">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
        <span>Connecting...</span>
      </div>
    );
  }

  if (isConnected && githubUser) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-800 dark:text-zinc-200 shadow-sm select-none">
        <GitHubIcon className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
        <span className="font-semibold text-emerald-700 dark:text-emerald-400 truncate max-w-[120px]" title={`GitHub: @${githubUser}`}>
          @{githubUser}
        </span>
        <button
          onClick={handleDisconnect}
          className="p-0.5 rounded text-slate-400 dark:text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors ml-1 cursor-pointer"
          title="Disconnect GitHub OAuth"
        >
          <LogOut className="w-3 h-3" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      type="button"
      className={`flex items-center gap-1.5 font-medium rounded-xl transition-all duration-200 cursor-pointer shadow-sm ${
        compact
          ? "px-2.5 py-1.5 text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700"
          : "px-3 py-1.5 text-xs bg-slate-900 dark:bg-zinc-800 hover:bg-slate-800 dark:hover:bg-zinc-700 text-white border border-slate-700 dark:border-zinc-600 hover:scale-[1.02]"
      }`}
      title="Connect your GitHub account for dynamic per-user MCP repository insights"
    >
      <GitHubIcon className="w-3.5 h-3.5 text-indigo-400" />
      <span>Connect GitHub</span>
      <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
    </button>
  );
}
