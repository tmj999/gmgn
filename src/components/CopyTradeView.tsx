import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TabBar } from "./TabBar";
import { Users } from "lucide-react";

import { apiRequest } from "@/lib/apiClient";
import { useAuth } from "@/hooks/useAuth";

const tabs = [
  { id: "smart", label: "Smart Money" },
  { id: "kol", label: "KOL" },
  { id: "fresh", label: "Fresh Wallet" },
  { id: "sniper", label: "Sniper" },
];

interface Trader {
  rank: number;
  id: string;
  email: string;
  solBalance: number;
}

function displayNameFromEmail(email: string): string {
  const at = email.indexOf("@");
  const base = at > 0 ? email.slice(0, at) : email;
  return base.length > 0 ? base : "Trader";
}

function shortId(id: string): string {
  if (id.length <= 10) return id;
  return `${id.slice(0, 4)}...${id.slice(-4)}`;
}

export function CopyTradeView() {
  const navigate = useNavigate();
  const { user, token, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("smart");
  const [traders, setTraders] = useState<Trader[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!token) {
      setTraders([]);
      return;
    }

    setError(null);
    apiRequest<{ ok: true; traders: Trader[] }>("/api/copytrade/leaderboard", {
      method: "GET",
      token,
    })
      .then((data) => {
        if (cancelled) return;
        setTraders(Array.isArray(data.traders) ? data.traders : []);
      })
      .catch((err: any) => {
        if (cancelled) return;
        setError(typeof err?.message === "string" ? err.message : "REQUEST_FAILED");
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const isAuthed = useMemo(() => !!user && !!token, [user, token]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthed) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="text-sm text-muted-foreground">You are not logged in to GMGN</div>
        <button
          onClick={() => navigate("/auth?mode=login")}
          className="mt-3 h-9 px-4 rounded-lg bg-foreground text-background text-[12px] font-semibold hover:opacity-90 transition-opacity"
        >
          Log in
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3 pb-20">
        <div className="flex flex-col gap-2">
          {error && (
            <div className="text-xs text-gmgn-red">Failed to load: {error}</div>
          )}

          {traders.map((trader) => (
            <button
              key={trader.id}
              type="button"
              onClick={() => navigate(`/trader/${trader.id}`)}
              className="token-card-gradient border border-border rounded-lg p-3 animate-slide-up"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xs font-semibold text-foreground">
                  #{trader.rank}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">
                      {displayNameFromEmail(trader.email)}
                    </span>
                    <span className="text-2xs text-muted-foreground font-mono">{shortId(trader.id)}</span>
                  </div>

                  <div className="mt-1 text-2xs text-muted-foreground truncate">
                    {trader.email}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-3 text-2xs">
                <div>
                  <span className="text-muted-foreground">Balance </span>
                  <span className="text-foreground font-medium">{trader.solBalance} SOL</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-foreground font-medium">Trader</span>
                </div>
              </div>

            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
