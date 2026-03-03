import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const TOKEN_STORAGE_KEY = "admin_token";
const TOKEN_EXPIRY_KEY = "admin_token_expiry";

interface AdminAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

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
      // Ignore storage errors (e.g. blocked in iframe/private mode)
    }
  },
  removeItem(key: string) {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.removeItem(key);
    } catch {
      // Ignore storage errors
    }
  },
};

const getStoredAuth = () => {
  const storedToken = safeSessionStorage.getItem(TOKEN_STORAGE_KEY);
  const storedExpiry = safeSessionStorage.getItem(TOKEN_EXPIRY_KEY);

  if (!storedToken || !storedExpiry) {
    return { token: null, isAuthenticated: false };
  }

  const expiryTime = parseInt(storedExpiry, 10);
  if (!Number.isFinite(expiryTime) || Date.now() >= expiryTime) {
    safeSessionStorage.removeItem(TOKEN_STORAGE_KEY);
    safeSessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    return { token: null, isAuthenticated: false };
  }

  return { token: storedToken, isAuthenticated: true };
};

export function useAdminAuth(): AdminAuthState {
  const initialAuth = getStoredAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth.isAuthenticated);
  const [isLoading] = useState(false);
  const [token, setToken] = useState<string | null>(initialAuth.token);

  const login = useCallback(async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-login", {
        body: { password },
      });

      if (error) {
        console.error("Login error:", error);
        return { success: false, error: "Kunde inte ansluta till servern" };
      }

      if (data.error) {
        return { success: false, error: data.error };
      }

      if (data.success && data.token) {
        const expiryTime = Date.now() + data.expiresIn;
        safeSessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        safeSessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());

        setToken(data.token);
        setIsAuthenticated(true);
        return { success: true };
      }

      return { success: false, error: "Oväntat svar från servern" };
    } catch (err) {
      console.error("Login exception:", err);
      return { success: false, error: "Ett fel uppstod vid inloggning" };
    }
  }, []);

  const logout = useCallback(() => {
    safeSessionStorage.removeItem(TOKEN_STORAGE_KEY);
    safeSessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    setToken(null);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    token,
    login,
    logout,
  };
}


