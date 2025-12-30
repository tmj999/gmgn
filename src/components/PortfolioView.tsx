import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ExternalLink, Calendar, Settings, ChevronDown, Copy } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

const tabs = [
  { id: "holding", label: "Holding" },
  { id: "history", label: "History" },
  { id: "orders", label: "Orders" },
];

// Solana icon component
const SolanaIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="solGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00FFA3" />
        <stop offset="50%" stopColor="#03E1FF" />
        <stop offset="100%" stopColor="#DC1FFF" />
      </linearGradient>
    </defs>
    <path d="M5 17.5l2.5-2.5h12l-2.5 2.5H5z" fill="url(#solGradient)" />
    <path d="M5 6.5l2.5 2.5h12L17 6.5H5z" fill="url(#solGradient)" />
    <path d="M5 12l2.5-2.5h12L17 12H5z" fill="url(#solGradient)" />
  </svg>
);

// Action button icons
const DepositIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BuyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 5v14M19 12H5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WithdrawIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ConvertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 8h18" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 20l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 16H3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Chain icons
const ChainIcon = ({ type }: { type: string }) => {
  const colors: Record<string, string> = {
    sol: "#9333ea",
    eth: "#627eea",
    bsc: "#f3ba2f",
    base: "#0052ff",
  };
  return (
    <div 
      className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
      style={{ backgroundColor: colors[type] || "#666" }}
    >
      {type.charAt(0).toUpperCase()}
    </div>
  );
};

export function PortfolioView() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const solBalance =
    user?.wallets?.find((w) => w.chain === "sol")?.balance ?? 0;

  const positions = user?.positions ?? {};
  const trades = Array.isArray(user?.trades) ? user!.trades! : [];

  const holdings = useMemo(() => {
    return Object.entries(positions)
      .map(([tokenAddress, balance]) => ({ tokenAddress, balance }))
      .filter((h) => typeof h.balance === "number" && Number.isFinite(h.balance) && h.balance > 0)
      .sort((a, b) => b.balance - a.balance);
  }, [positions]);

  const tokenCount = holdings.length;

  const tokenStats = useMemo(() => {
    const byToken = new Map<
      string,
      {
        lastActiveAt?: string;
        buySol: number;
        buyWeightedRate: number;
        sellSol: number;
        sellWeightedRate: number;
      }
    >();

    for (const t of trades) {
      if (!t || typeof t.tokenAddress !== "string") continue;
      const key = t.tokenAddress;
      const prev = byToken.get(key) ?? {
        lastActiveAt: undefined,
        buySol: 0,
        buyWeightedRate: 0,
        sellSol: 0,
        sellWeightedRate: 0,
      };

      if (typeof t.createdAt === "string") {
        if (!prev.lastActiveAt || new Date(t.createdAt).getTime() > new Date(prev.lastActiveAt).getTime()) {
          prev.lastActiveAt = t.createdAt;
        }
      }

      const sol = typeof t.solAmount === "number" && Number.isFinite(t.solAmount) ? t.solAmount : 0;
      const rate = typeof t.rate === "number" && Number.isFinite(t.rate) ? t.rate : 0;
      if (t.side === "buy") {
        prev.buySol += sol;
        prev.buyWeightedRate += sol * rate;
      } else if (t.side === "sell") {
        prev.sellSol += sol;
        prev.sellWeightedRate += sol * rate;
      }

      byToken.set(key, prev);
    }

    return byToken;
  }, [trades]);

  const shortAddr = (addr: string) => {
    const s = (addr ?? "").trim();
    if (!s) return "-";
    if (s.length <= 10) return s;
    return `${s.slice(0, 4)}...${s.slice(-4)}`;
  };

  const formatAge = (iso: string) => {
    const t = new Date(iso).getTime();
    if (!Number.isFinite(t)) return "-";
    const sec = Math.max(0, Math.floor((Date.now() - t) / 1000));
    if (sec < 60) return `${sec}s`;
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}m`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}h`;
    const day = Math.floor(hr / 24);
    return `${day}d`;
  };

  const [activeTab, setActiveTab] = useState("holding");
  const [selectedWallets, setSelectedWallets] = useState<string[]>(["wallet1"]);
  const [showHidden, setShowHidden] = useState(true);
  const [didntBuy, setDidntBuy] = useState(true);
  const [lowLiq, setLowLiq] = useState(true);
  const [hideClosed, setHideClosed] = useState(true);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-sm text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
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

  const toggleWallet = (id: string) => {
    setSelectedWallets(prev => 
      prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedWallets.length === 1) {
      setSelectedWallets(["wallet1"]);
    } else {
      setSelectedWallets([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Wallet Section */}
      <div className="m-3 rounded-xl bg-[#111] border border-[#1a1a1a]">
        {/* Header */}
        <div className="flex items-center justify-between p-3 pb-2">
          <h2 className="text-sm font-semibold text-foreground">SOL Wallet (1)</h2>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ExternalLink className="w-3.5 h-3.5" />
            Share
          </button>
        </div>

        {/* Chain selector and actions */}
        <div className="flex items-center justify-between px-3 pb-2">
          <div className="flex items-center gap-2">
            <button className="text-xs text-muted-foreground hover:text-foreground">Log &gt;</button>
            <ChainIcon type="sol" />
            <ChainIcon type="eth" />
            <ChainIcon type="bsc" />
            <ChainIcon type="base" />
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
              </svg>
              Import
            </button>
            <button className="flex items-center gap-1 text-xs text-gmgn-green hover:opacity-80">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
              </svg>
              Create Wallet
            </button>
          </div>
        </div>

        {/* Wallet table header */}
        <div className="grid grid-cols-[auto_1fr_60px_60px_70px_auto] items-center gap-2 px-3 py-2 border-t border-[#1a1a1a] text-2xs text-muted-foreground">
          <button 
            onClick={toggleAll}
            className={`w-4 h-4 rounded border flex items-center justify-center ${
              selectedWallets.length > 0 ? "bg-gmgn-green border-gmgn-green" : "border-[#333]"
            }`}
          >
            {selectedWallets.length > 0 && <Check className="w-3 h-3 text-black" />}
          </button>
          <span>Select All</span>
          <span className="text-center">Vol ↕</span>
          <span className="text-center">Tokens</span>
          <span className="text-center">Balance ↕</span>
          <span></span>
        </div>

        {/* Wallet row */}
        <div className="grid grid-cols-[auto_1fr_60px_60px_70px_auto] items-center gap-2 px-3 py-2 border-t border-[#1a1a1a]">
          <button 
            onClick={() => toggleWallet("wallet1")}
            className={`w-4 h-4 rounded border flex items-center justify-center ${
              selectedWallets.includes("wallet1") ? "bg-gmgn-green border-gmgn-green" : "border-[#333]"
            }`}
          >
            {selectedWallets.includes("wallet1") && <Check className="w-3 h-3 text-black" />}
          </button>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[#444] cursor-move">⋮⋮</span>
            <div className="w-5 h-5 rounded bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-[8px] text-white">📋</div>
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-green-500 flex items-center justify-center">
              <span className="text-[8px]">🐸</span>
            </div>
            <span className="text-xs text-foreground font-medium">Wallet1</span>
            <span className="text-2xs text-muted-foreground">✏️</span>
            <span className="text-2xs text-muted-foreground truncate">64XC...dzTe</span>
            <button className="text-muted-foreground hover:text-foreground">
              <Copy className="w-3 h-3" />
            </button>
          </div>
          <span className="text-xs text-muted-foreground text-center">$0</span>
          <span className="text-xs text-muted-foreground text-center">{tokenCount}</span>
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <SolanaIcon className="w-3.5 h-3.5" />
            <span>{solBalance}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1 text-muted-foreground hover:text-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18M9 21V9"/>
              </svg>
            </button>
            <button className="p-1 text-muted-foreground hover:text-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/>
              </svg>
            </button>
            <button className="p-1 text-muted-foreground hover:text-foreground">
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 text-muted-foreground hover:text-foreground">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="mx-3 rounded-xl bg-[#111] border border-[#1a1a1a] p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Wallet (1)</h3>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <Calendar className="w-3.5 h-3.5" />
            PNL Calendar
          </button>
        </div>

        <div className="text-xs text-muted-foreground mb-1">Total Value</div>
        <div className="flex items-center gap-2 mb-3">
          <SolanaIcon className="w-6 h-6" />
          <span className="text-2xl font-bold text-foreground">{solBalance}</span>
          <span className="text-sm text-muted-foreground">$0</span>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total PnL</span>
            <span className="text-muted-foreground">USD</span>
            <span className="text-muted-foreground">Ⓢ</span>
            <span className="text-foreground font-medium">$0 (--)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Unrealized Profits</span>
            <span className="text-foreground font-medium">$0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Total Volume</span>
            <span className="text-foreground font-medium">$0</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { icon: <DepositIcon />, label: "Deposit" },
            { icon: <BuyIcon />, label: "Buy" },
            { icon: <WithdrawIcon />, label: "Withdraw" },
            { icon: <ConvertIcon />, label: "Convert" },
          ].map((action) => (
            <button key={action.label} className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center text-foreground hover:border-gmgn-green transition-colors">
                {action.icon}
              </div>
              <span className="text-2xs text-muted-foreground">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-3 pt-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-sm font-medium transition-colors relative ${
              activeTab === tab.id
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-muted-foreground" />
            )}
          </button>
        ))}
      </div>

      {/* Table header - changes based on active tab */}
      {activeTab === "history" ? (
        <div className="grid grid-cols-4 gap-2 px-3 py-3 text-xs text-muted-foreground border-t border-[#1a1a1a] mt-2">
          <div className="flex items-center gap-1">
            Token / <span className="text-foreground">Last Active</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <div className="flex items-center justify-center gap-1">
            Bought
            <ChevronDown className="w-3 h-3" />
            / Avg
          </div>
          <div className="flex items-center justify-center gap-1">
            Sold
            <ChevronDown className="w-3 h-3" />
            / Avg
          </div>
          <div className="flex items-center justify-end gap-1">
            Total Profit
            <ChevronDown className="w-3 h-3" />
            USD
            <span className="text-[10px]">Ⓢ</span>
          </div>
        </div>
      ) : activeTab === "holding" ? (
        <>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 px-3 py-2 mt-2">
            {[
              { label: "Show Hidden", value: showHidden, setter: setShowHidden },
              { label: "Didn't Buy", value: didntBuy, setter: setDidntBuy },
              { label: "Low Liq/Honeypot", value: lowLiq, setter: setLowLiq },
              { label: "Hide Closed", value: hideClosed, setter: setHideClosed },
            ].map((filter) => (
              <button
                key={filter.label}
                onClick={() => filter.setter(!filter.value)}
                className="flex items-center gap-1.5"
              >
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                  filter.value ? "bg-gmgn-green border-gmgn-green" : "border-[#333]"
                }`}>
                  {filter.value && <Check className="w-3 h-3 text-black" />}
                </div>
                <span className="text-2xs text-muted-foreground">{filter.label}</span>
              </button>
            ))}
          </div>

          {/* Settings row */}
          <div className="flex items-center gap-2 px-3 py-2">
            <button className="p-1.5 rounded bg-[#1a1a1a] text-muted-foreground hover:text-foreground">
              <Settings className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 px-2 py-1 rounded bg-[#1a1a1a]">
              <span className="text-yellow-500">⚡</span>
              <span className="text-xs text-foreground">100</span>
              <span className="text-xs text-muted-foreground">%</span>
            </div>
            <button className="flex items-center gap-1 px-2 py-1 rounded bg-[#1a1a1a] text-xs text-foreground">
              P1
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          {/* Table header for holding */}
          <div className="grid grid-cols-5 gap-2 px-3 py-2 text-2xs text-muted-foreground border-t border-[#1a1a1a]">
            <div>Token / Last Active ↕</div>
            <div className="text-center">Bought ↕ / Avg</div>
            <div className="text-center">Sold ↕ / Avg</div>
            <div className="text-center">Balance ↕ USD Ⓢ</div>
            <div className="text-right">Unrealized ↕</div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-4 gap-2 px-3 py-3 text-xs text-muted-foreground border-t border-[#1a1a1a] mt-2">
          <div>Token</div>
          <div className="text-center">Type</div>
          <div className="text-center">Amount</div>
          <div className="text-right">Status</div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto pb-20">
        {activeTab === "holding" ? (
          holdings.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No holdings yet
            </div>
          ) : (
            <div>
              {holdings.map((h) => {
                const stats = tokenStats.get(h.tokenAddress);
                const buyAvgRate =
                  stats && stats.buySol > 0 ? stats.buyWeightedRate / stats.buySol : 0;
                const sellAvgRate =
                  stats && stats.sellSol > 0 ? stats.sellWeightedRate / stats.sellSol : 0;

                return (
                  <div
                    key={h.tokenAddress}
                    className="grid grid-cols-5 gap-2 px-3 py-2 border-t border-[#1a1a1a]"
                  >
                    <div className="min-w-0">
                      <div className="text-xs text-foreground font-medium truncate">{shortAddr(h.tokenAddress)}</div>
                      <div className="text-2xs text-muted-foreground">
                        {stats?.lastActiveAt ? formatAge(stats.lastActiveAt) : "-"}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-foreground">{(stats?.buySol ?? 0).toFixed(4)} SOL</div>
                      <div className="text-2xs text-muted-foreground">
                        {buyAvgRate > 0 ? `@${Math.round(buyAvgRate)}` : "-"}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-foreground">{(stats?.sellSol ?? 0).toFixed(4)} SOL</div>
                      <div className="text-2xs text-muted-foreground">
                        {sellAvgRate > 0 ? `@${Math.round(sellAvgRate)}` : "-"}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-xs text-foreground">{h.balance.toFixed(4)}</div>
                      <div className="text-2xs text-muted-foreground">USD - · Ⓢ -</div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">-</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : activeTab === "history" ? (
          trades.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No trades yet
            </div>
          ) : (
            <div>
              {trades.map((t) => (
                <div
                  key={t.id}
                  className="grid grid-cols-4 gap-2 px-3 py-2 border-t border-[#1a1a1a]"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-foreground font-medium truncate">{shortAddr(t.tokenAddress)}</div>
                    <div className="text-2xs text-muted-foreground">
                      {formatAge(t.createdAt)}
                      {t.copiedFromUserId ? " · Copied" : ""}
                    </div>
                  </div>

                  <div className="text-center">
                    {t.side === "buy" ? (
                      <>
                        <div className="text-xs text-foreground">{t.solAmount.toFixed(4)} SOL</div>
                        <div className="text-2xs text-muted-foreground">@{Math.round(t.rate)}</div>
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground">-</div>
                    )}
                  </div>

                  <div className="text-center">
                    {t.side === "sell" ? (
                      <>
                        <div className="text-xs text-foreground">{t.solAmount.toFixed(4)} SOL</div>
                        <div className="text-2xs text-muted-foreground">@{Math.round(t.rate)}</div>
                      </>
                    ) : (
                      <div className="text-xs text-muted-foreground">-</div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">-</div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No orders yet
          </div>
        )}
      </div>
    </div>
  );
}