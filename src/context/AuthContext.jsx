"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { authService } from "@/services/authService";
import { setAccessToken, clearGuestId } from "@/services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  const [status, setStatus] = useState("loading"); // loading | unauthenticated | authenticated
  const [appUser, setAppUser] = useState(null); // our backend user record
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  // Exchange the Clerk session token for our own access token whenever the
  // Clerk auth state settles. Signed-in users get their own account + history;
  // signed-out users stay as a per-session guest.
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setAccessToken(null);
      queueMicrotask(() => {
        setAppUser(null);
        setProfile(null);
        setStatus("unauthenticated");
      });
      return;
    }

    let cancelled = false;
    const handshake = async () => {
      try {
        const clerkToken = await getToken();
        if (!clerkToken) {
          setStatus("unauthenticated");
          return;
        }
        const email = user?.primaryEmailAddress?.emailAddress;
        const username =
          user?.username ||
          user?.firstName ||
          email?.split("@")[0] ||
          null;

        let data;
        try {
          data = await authService.login(clerkToken, { email, username });
        } catch (firstErr) {
          // If server was briefly restarting, retry once after 1s delay
          await new Promise((r) => setTimeout(r, 1000));
          if (cancelled) return;
          data = await authService.login(clerkToken, { email, username });
        }
        if (cancelled) return;

        clearGuestId();
        setAccessToken(data.access_token);
        setAppUser(data.user);
        setProfile(data.user);
        setError(null);
        setStatus("authenticated");
      } catch (e) {
        console.error("Auth handshake failed:", e);
        if (!cancelled) {
          setError(e?.response?.data?.detail || e.message || "Auth failed");
          setStatus("unauthenticated");
        }
      }
    };

    handshake();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, getToken, user]);

  const refreshProfile = useCallback(async () => {
    try {
      const data = await authService.me();
      setAppUser(data.user);
      setProfile(data.profile);
      return data;
    } catch (e) {
      console.error("Failed to load profile:", e);
      return null;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout error:", e);
    }
    clearGuestId();
    setAccessToken(null);
    setAppUser(null);
    setProfile(null);
    setStatus("unauthenticated");
    try {
      await clerkSignOut({ redirectUrl: "/sign-in" });
    } catch (e) {
      console.error("Clerk sign-out error:", e);
      window.location.href = "/sign-in";
    }
  }, [clerkSignOut]);

  return (
    <AuthContext.Provider
      value={{ status, appUser, profile, error, refreshProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export default AuthProvider;