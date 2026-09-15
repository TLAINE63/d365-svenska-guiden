import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const TOKEN_KEY = "editor_token";
const TOKEN_EXPIRY_KEY = "editor_token_expiry";

const safeSessionStorage = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string) {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      /* ignore */
    }
  },
  removeItem(key: string) {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};

function getStoredToken(): string | null {
  const token = safeSessionStorage.getItem(TOKEN_KEY);
  const expiry = safeSessionStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!token || !expiry) return null;
  const expiryTime = parseInt(expiry, 10);
  if (!Number.isFinite(expiryTime) || Date.now() >= expiryTime) {
    safeSessionStorage.removeItem(TOKEN_KEY);
    safeSessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    return null;
  }
  return token;
}

export interface EditorAuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  token: string | null;
  email: string | null;
  accessError: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
}

export function useEditorAuth(): EditorAuthState {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [email, setEmail] = useState<string | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);

  const exchangeSession = useCallback(async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData.session;
    if (!session) {
      setToken(null);
      setEmail(null);
      return;
    }
    setEmail(session.user.email ?? null);

    const existing = getStoredToken();
    if (existing) {
      setToken(existing);
      setAccessError(null);
      return;
    }

    const { data, error } = await supabase.functions.invoke("editor-session", { body: {} });
    if (error || !data?.token) {
      const message =
        (data as { error?: string } | null)?.error ??
        "Kontot saknar redaktörsbehörighet.";
      setAccessError(message);
      setToken(null);
      return;
    }
    safeSessionStorage.setItem(TOKEN_KEY, data.token);
    safeSessionStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + data.expiresIn));
    setToken(data.token);
    setAccessError(null);
  }, []);

  useEffect(() => {
    let active = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (!session) {
        safeSessionStorage.removeItem(TOKEN_KEY);
        safeSessionStorage.removeItem(TOKEN_EXPIRY_KEY);
        setToken(null);
        setEmail(null);
      }
    });

    (async () => {
      await exchangeSession();
      if (active) setIsLoading(false);
    })();

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [exchangeSession]);

  const login = useCallback(
    async (loginEmail: string, password: string) => {
      setAccessError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim(),
        password,
      });
      if (error) {
        return { success: false, error: "Fel e-postadress eller lösenord" };
      }
      await exchangeSession();
      return { success: true };
    },
    [exchangeSession],
  );

  const logout = useCallback(async () => {
    safeSessionStorage.removeItem(TOKEN_KEY);
    safeSessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    setToken(null);
    setAccessError(null);
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (resetEmail: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, error: "Kunde inte skicka återställningslänk" };
    return { success: true };
  }, []);

  return {
    isLoading,
    isAuthenticated: !!token,
    token,
    email,
    accessError,
    login,
    logout,
    resetPassword,
  };
}
