import { useState, useEffect, useCallback } from "react";
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

export function useAdminAuth(): AdminAuthState {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  // Check for existing valid token on mount
  useEffect(() => {
    const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    const storedExpiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);

    if (storedToken && storedExpiry) {
      const expiryTime = parseInt(storedExpiry, 10);
      if (Date.now() < expiryTime) {
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        // Token expired, clean up
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
      }
    }
    setIsLoading(false);
  }, []);

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
        // Store token in sessionStorage (not localStorage for better security)
        const expiryTime = Date.now() + data.expiresIn;
        sessionStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
        
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
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
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
