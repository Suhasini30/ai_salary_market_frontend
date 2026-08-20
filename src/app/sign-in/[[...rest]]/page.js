"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SignIn,
  useAuth,
  useUser,
  useClerk,
} from "@clerk/nextjs";
import { TrendingUp, Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  // Automatically navigate to Home page upon successful sign-in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loading spinner while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-sm text-zinc-400">Loading authentication...</span>
        </div>
      </div>
    );
  }

  // If user is signed in, redirecting spinner
  if (isSignedIn) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="text-sm text-zinc-400">Redirecting to Chat Insights...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen flex flex-1 flex-col items-center justify-center relative overflow-hidden bg-zinc-950 text-zinc-50 p-4">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)]" />
      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <TrendingUp className="w-6 h-6 text-indigo-400" />
          <span className="text-xl font-bold tracking-wide text-zinc-100">
            Salary Insights Bot
          </span>
        </div>

        {/* Navigation Mode Toggle */}
        <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/80 p-1 shadow-lg">
          <button
            type="button"
            onClick={() => router.push("/sign-in")}
            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all bg-indigo-600 text-white shadow-sm cursor-pointer"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => router.push("/sign-up")}
            className="flex-1 py-2 rounded-lg text-sm font-medium transition-all text-zinc-400 hover:text-zinc-200 cursor-pointer"
          >
            Sign Up
          </button>
        </div>

        {/* Embedded Clerk Sign In Form */}
        <div className="rounded-2xl p-2 bg-zinc-900/60 border border-zinc-800 shadow-2xl backdrop-blur-xl flex justify-center">
          <SignIn
            fallbackRedirectUrl="/"
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}