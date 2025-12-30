import { useEffect, useState } from "react";

import { apiRequest } from "@/lib/apiClient";
import { clearAuthToken, getAuthToken, onAuthTokenChange } from "@/lib/authToken";

export type AuthUser = {
  id: string;
  email: string;
  createdAt: string;
  wallets?: Array<{
    chain: string;
    symbol: string;
    balance: number;
    createdAt: string;
  }>;
  positions?: Record<string, number>;
  trades?: Array<{
    id: string;
    createdAt: string;
    tokenAddress: string;
    side: "buy" | "sell";
    solAmount: number;
    tokenAmount: number;
    rate: number;
    copiedFromUserId?: string;
  }>;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [loading, setLoading] = useState(true);

  const refreshMe = async (tokenOverride?: string | null) => {
    const activeToken = tokenOverride ?? getAuthToken();
    if (!activeToken) {
      setUser(null);
      return;
    }

    try {
      const data = await apiRequest<{ ok: true; user: AuthUser }>("/api/auth/me", {
        method: "GET",
        token: activeToken,
      });
      setUser(data.user);
    } catch {
      clearAuthToken();
      setUser(null);
    }
  };

  useEffect(() => {
    let cancelled = false;

    refreshMe()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return onAuthTokenChange(() => {
      const nextToken = getAuthToken();
      setToken(nextToken);
      refreshMe(nextToken).finally(() => setLoading(false));
    });
  }, []);

  const signOut = async () => {
    const activeToken = getAuthToken();
    try {
      if (activeToken) {
        await apiRequest<{ ok: true }>("/api/auth/logout", {
          method: "POST",
          token: activeToken,
        });
      }
    } catch {
      // ignore logout network errors
    } finally {
      clearAuthToken();
      setUser(null);
      setToken(null);
    }
  };

  return { user, token, loading, signOut, refreshMe };
}
