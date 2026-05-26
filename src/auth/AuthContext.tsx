import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getAuthenticatedUser,
  isSupabaseConfigured,
  refreshAuthSession,
  signInWithEmail,
  signOutSession,
  signUpWithEmail,
  type SupabaseSession,
  type SupabaseUser
} from "../lib/supabaseAuth";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface SignUpResult {
  needsEmailConfirmation: boolean;
}

interface AuthContextValue {
  status: AuthStatus;
  session: SupabaseSession | null;
  user: SupabaseUser | null;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<SignUpResult>;
  signOut: () => Promise<void>;
}

const STORAGE_KEY = "aurora-supabase-session-v1";
const AuthContext = createContext<AuthContextValue | null>(null);

const readStoredSession = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as SupabaseSession) : null;
  } catch {
    return null;
  }
};

const storeSession = (session: SupabaseSession | null) => {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const shouldRefresh = (session: SupabaseSession) => {
  if (!session.expires_at) return false;
  const secondsUntilExpiry = session.expires_at - Math.floor(Date.now() / 1000);
  return secondsUntilExpiry < 60;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [session, setSession] = useState<SupabaseSession | null>(null);

  const applySession = useCallback((nextSession: SupabaseSession | null) => {
    setSession(nextSession);
    storeSession(nextSession);
    setStatus(nextSession ? "authenticated" : "unauthenticated");
  }, []);

  useEffect(() => {
    let alive = true;

    async function restoreSession() {
      if (!isSupabaseConfigured) {
        setStatus("unauthenticated");
        return;
      }

      const stored = readStoredSession();

      if (!stored) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const refreshed =
          stored.refresh_token && shouldRefresh(stored)
            ? await refreshAuthSession(stored.refresh_token)
            : { ...stored, user: await getAuthenticatedUser(stored.access_token) };

        if (alive) {
          applySession(refreshed);
        }
      } catch {
        if (alive) {
          applySession(null);
        }
      }
    }

    void restoreSession();
    return () => {
      alive = false;
    };
  }, [applySession]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const nextSession = await signInWithEmail(email, password);
      applySession(nextSession);
    },
    [applySession]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      const result = await signUpWithEmail(email, password);

      if (result.session) {
        applySession(result.session);
      }

      return { needsEmailConfirmation: Boolean(result.needsEmailConfirmation) };
    },
    [applySession]
  );

  const signOut = useCallback(async () => {
    const currentToken = session?.access_token;
    applySession(null);

    if (currentToken) {
      await signOutSession(currentToken).catch(() => undefined);
    }
  }, [applySession, session?.access_token]);

  const value = useMemo(
    () => ({
      status,
      session,
      user: session?.user ?? null,
      isConfigured: isSupabaseConfigured,
      signIn,
      signUp,
      signOut
    }),
    [session, signIn, signOut, signUp, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden.");
  }

  return context;
}
