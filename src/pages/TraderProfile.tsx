import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Star, Copy, ExternalLink, Bell, Users, TrendingUp, Wallet, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { CopyTradeDrawer } from "@/components/CopyTradeDrawer";
import { apiRequest } from "@/lib/apiClient";
import { useAuth } from "@/hooks/useAuth";

// Mock trader data
const mockTraderData = {
  address: "BEeF...nM53",
  fullAddress: "BEeFNEjzFKkbApUoBYDCm4es9YVKAunfM6xQEt8tnM53",
  name: "Smart Money 🐳",
  avatar: "https://ui-avatars.com/api/?name=SM&background=22c55e&color=000&size=64",
  tags: ["Smart Money", "Top Trader", "Whale"],
  balance: "2,345.67 SOL",
  balanceUsd: "$523,456",
  pnl7d: {
    value: "+$45,678",
    percent: "+12.5%",
    positive: true
  },
  pnl30d: {
    value: "+$234,567",
    percent: "+89.2%",
    positive: true
  },
  winRate: "68.5%",
  avgHoldTime: "4.2h",
  totalTrades: 1245,
  followers: 3456,
  following: 123,
};

type BackendTrader = {
  id: string;
  email: string;
  createdAt: string;
  displayName: string;
  avatar: string;
  solBalance: number;
  wallets?: Array<{ chain: string; symbol: string; balance: number; createdAt: string }>;
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

function shortId(id: string): string {
  if (id.length <= 10) return id;
  return `${id.slice(0, 4)}...${id.slice(-4)}`;
}

const profileTabs = ["Wallet", "Track", "Monitor", "Renames"];

function formatAge(iso: string) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "-";
  const diffMs = Date.now() - t;
  const diffSec = Math.max(0, Math.floor(diffMs / 1000));
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d`;
}

export default function TraderProfile() {
  const { address } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState("Wallet");
  const [copied, setCopied] = useState(false);
  const [copyTradeOpen, setCopyTradeOpen] = useState(false);

  const [follows, setFollows] = useState<
    Array<{
      traderId: string;
      createdAt: string;
      buyMode: string;
      maxBuySol?: number;
      fixedBuySol?: number;
      fixedRatio?: number;
      sellMethod: string;
    }>
  >([]);

  const [unfollowing, setUnfollowing] = useState(false);

  const [backendTrader, setBackendTrader] = useState<BackendTrader | null>(null);
  const [loadingTrader, setLoadingTrader] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const id = String(address || "");
    if (!id) {
      setBackendTrader(null);
      setLoadingTrader(false);
      return;
    }

    setLoadingTrader(true);
    apiRequest<{ ok: true; trader: BackendTrader }>(`/api/traders/${id}`, { method: "GET" })
      .then((data) => {
        if (cancelled) return;
        setBackendTrader(data.trader);
      })
      .catch(() => {
        if (cancelled) return;
        setBackendTrader(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingTrader(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address]);

  const trader = useMemo(() => {
    if (!backendTrader) return mockTraderData;

    const fullAddress = backendTrader.id;
    const short = shortId(fullAddress);
    const solStr = `${backendTrader.solBalance.toLocaleString()} SOL`;

    return {
      ...mockTraderData,
      name: backendTrader.displayName,
      avatar: backendTrader.avatar,
      fullAddress,
      address: short,
      balance: solStr,
      // balanceUsd/pnl/winRate/etc 暂时沿用 mock
      tags: mockTraderData.tags,
    };
  }, [backendTrader]);

  const holdings = useMemo(() => {
    const sol = backendTrader?.solBalance ?? null;
    const positions = backendTrader?.positions && typeof backendTrader.positions === "object" ? backendTrader.positions : {};

    const items: Array<{ symbol: string; name: string; amount: string; value: string; change: string; positive: boolean }> = [];

    if (typeof sol === "number") {
      items.push({
        symbol: "SOL",
        name: "Solana",
        amount: sol.toLocaleString(undefined, { maximumFractionDigits: 4 }),
        value: "-",
        change: "-",
        positive: true,
      });
    }

    for (const [tokenAddr, amt] of Object.entries(positions)) {
      if (!Number.isFinite(amt) || amt <= 0) continue;
      items.push({
        symbol: shortId(tokenAddr),
        name: "Token",
        amount: amt.toLocaleString(undefined, { maximumFractionDigits: 4 }),
        value: "-",
        change: "-",
        positive: true,
      });
    }

    return items;
  }, [backendTrader]);

  const recentTrades = useMemo(() => {
    const list = Array.isArray(backendTrader?.trades) ? backendTrader!.trades! : [];
    return list.map((t) => {
      const isBuy = t.side === "buy";
      return {
        id: t.id,
        age: formatAge(t.createdAt),
        token: shortId(t.tokenAddress),
        type: isBuy ? "Buy" : "Sell",
        amount: `${t.tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} tok`,
        pnl: `${isBuy ? "-" : "+"}${t.solAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })} SOL`,
        positive: !isBuy,
      };
    });
  }, [backendTrader]);

  const loadFollowing = async (tokenValue: string, traderId?: string) => {
    try {
      const data = await apiRequest<{ ok: true; follows: typeof follows }>("/api/copytrade/following", {
        method: "GET",
        token: tokenValue,
      });
      const list = Array.isArray(data.follows) ? data.follows : [];
      setFollows(list);
    } catch {
      setFollows([]);
    }
  };

  useEffect(() => {
    if (!token) {
      setFollows([]);
      return;
    }
    loadFollowing(token, trader.fullAddress).catch(() => {});
    // trader.fullAddress derived from backendTrader; refresh when it changes.
  }, [token, trader.fullAddress]);

  const isFollowing = useMemo(() => {
    return !!trader.fullAddress && follows.some((f) => f.traderId === trader.fullAddress);
  }, [follows, trader.fullAddress]);

  const myFollow = useMemo(() => {
    if (!trader.fullAddress) return null;
    return follows.find((f) => f.traderId === trader.fullAddress) ?? null;
  }, [follows, trader.fullAddress]);

  const strategySummary = useMemo(() => {
    if (!myFollow) return null;

    const buyLabel =
      myFollow.buyMode === "max_buy_amount"
        ? `Max Buy ${myFollow.maxBuySol ?? "-"} SOL`
        : myFollow.buyMode === "fixed_buy"
          ? `Fixed Buy ${myFollow.fixedBuySol ?? "-"} SOL`
          : `Fixed Ratio ${myFollow.fixedRatio ?? "-"}x`;

    const sellLabel =
      myFollow.sellMethod === "copy_sell"
        ? "Copy Sell"
        : myFollow.sellMethod === "not_sell"
          ? "Not Sell"
          : myFollow.sellMethod === "tp_sl"
            ? "TP & SL"
            : "Adv Strategy";

    return `Buy: ${buyLabel} · Sell: ${sellLabel}`;
  }, [myFollow]);

  const handleUnfollow = async () => {
    if (!token || !trader.fullAddress) return;

    setUnfollowing(true);
    try {
      await apiRequest<{ ok: true }>(`/api/copytrade/follow/${encodeURIComponent(trader.fullAddress)}`, {
        method: "DELETE",
        token,
      });
      toast.success("Unfollowed");
      await loadFollowing(token, trader.fullAddress);
    } catch (e: any) {
      toast.error(typeof e?.message === "string" ? e.message : "REQUEST_FAILED");
    } finally {
      setUnfollowing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(trader.fullAddress);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopyTrade = () => {
    setCopyTradeOpen(true);
  };

  return (
    <div className="mx-auto w-full max-w-[480px] flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#1a1a1a]">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-muted-foreground hover:text-foreground">
            <Bell className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground">
            <Star className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trader Info */}
      <div className="px-3 py-4 border-b border-[#1a1a1a]">
        {loadingTrader && (
          <div className="mb-3 text-xs text-muted-foreground">Loading...</div>
        )}
        <div className="flex items-start gap-3">
          <img
            src={trader.avatar}
            alt="Trader"
            className="w-14 h-14 rounded-full object-cover bg-[#1a1a1a]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">{trader.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                <span className="font-mono">{trader.address}</span>
                <Copy className="w-3 h-3" />
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {trader.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-0.5 text-[10px] bg-gmgn-green/10 text-gmgn-green rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="text-center">
            <div className="text-lg font-bold">{trader.winRate}</div>
            <div className="text-[10px] text-muted-foreground">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{trader.avgHoldTime}</div>
            <div className="text-[10px] text-muted-foreground">Avg Hold</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{trader.totalTrades}</div>
            <div className="text-[10px] text-muted-foreground">Trades</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">{trader.followers}</div>
            <div className="text-[10px] text-muted-foreground">Followers</div>
          </div>
        </div>

        {/* PnL Cards */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-[#111] rounded-lg p-3">
            <div className="text-[10px] text-muted-foreground">7D PnL</div>
            <div className={`text-base font-bold ${trader.pnl7d.positive ? "text-gmgn-green" : "text-gmgn-red"}`}>
              {trader.pnl7d.value}
            </div>
            <div className={`text-xs ${trader.pnl7d.positive ? "text-gmgn-green" : "text-gmgn-red"}`}>
              {trader.pnl7d.percent}
            </div>
          </div>
          <div className="bg-[#111] rounded-lg p-3">
            <div className="text-[10px] text-muted-foreground">30D PnL</div>
            <div className={`text-base font-bold ${trader.pnl30d.positive ? "text-gmgn-green" : "text-gmgn-red"}`}>
              {trader.pnl30d.value}
            </div>
            <div className={`text-xs ${trader.pnl30d.positive ? "text-gmgn-green" : "text-gmgn-red"}`}>
              {trader.pnl30d.percent}
            </div>
          </div>
        </div>

        {/* Copy Trade Button */}
        <button 
          onClick={handleCopyTrade}
          className={`w-full mt-4 py-3 font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity ${
            isFollowing
              ? "bg-[#111] border border-border text-foreground"
              : "bg-gmgn-green text-black"
          }`}
        >
          <Users className="w-4 h-4" />
          {isFollowing ? "Copy Trading Enabled" : "Copy Trade"}
        </button>

        {isFollowing && (
          <div className="mt-2">
            <div className="text-[10px] text-muted-foreground">
              You are currently copying this trader.
            </div>
            {strategySummary && (
              <div className="mt-1 text-[10px] text-muted-foreground">
                {strategySummary}
              </div>
            )}
            <button
              type="button"
              onClick={handleUnfollow}
              disabled={unfollowing}
              className="mt-3 w-full py-2.5 rounded-lg border border-border bg-transparent text-foreground text-xs font-semibold disabled:opacity-50"
            >
              {unfollowing ? "Unfollowing..." : "Unfollow"}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#1a1a1a] overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-3 py-2 min-w-max">
          {profileTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs whitespace-nowrap rounded-md transition-colors ${
                activeTab === tab
                  ? "bg-[#222] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {activeTab === "Wallet" && (
          <>
            {/* Balance */}
            <div className="px-3 py-3 border-b border-[#1a1a1a]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-muted-foreground">Total Balance</div>
                  <div className="text-xl font-bold">{trader.balanceUsd}</div>
                  <div className="text-xs text-muted-foreground">{trader.balance}</div>
                </div>
                <Wallet className="w-8 h-8 text-muted-foreground" />
              </div>
            </div>

            {/* Holdings List */}
            <div className="px-3 py-2 text-xs text-muted-foreground border-b border-[#1a1a1a]">
              Holdings
            </div>
            {holdings.length === 0 ? (
              <div className="px-3 py-6 text-sm text-muted-foreground">No holdings yet</div>
            ) : (
              holdings.map((holding, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 px-3 py-3 border-b border-[#0d0d0d] hover:bg-[#111] transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-xs font-bold">
                  {holding.symbol.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{holding.symbol}</div>
                  <div className="text-[10px] text-muted-foreground">{holding.amount}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{holding.value}</div>
                  <div className={`text-[10px] ${holding.positive ? "text-gmgn-green" : "text-gmgn-red"}`}>
                    {holding.change}
                  </div>
                </div>
              </div>
              ))
            )}
          </>
        )}

        {activeTab === "Track" && (
          <>
            <div className="px-3 py-2 text-xs text-muted-foreground border-b border-[#1a1a1a] flex items-center justify-between">
              <span>Recent Trades</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            {recentTrades.length === 0 ? (
              <div className="px-3 py-6 text-sm text-muted-foreground">No trades yet</div>
            ) : (
              recentTrades.map((trade) => (
              <div 
                key={trade.id} 
                className="flex items-center gap-3 px-3 py-3 border-b border-[#0d0d0d] hover:bg-[#111] transition-colors"
              >
                <div className="text-[10px] text-muted-foreground w-8">{trade.age}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{trade.token}</div>
                  <div className={`text-[10px] ${trade.type === "Buy" ? "text-gmgn-green" : "text-gmgn-red"}`}>
                    {trade.type}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{trade.amount}</div>
                  <div className={`text-[10px] ${trade.positive ? "text-gmgn-green" : "text-gmgn-red"}`}>
                    {trade.pnl}
                  </div>
                </div>
              </div>
              ))
            )}
          </>
        )}

        {(activeTab === "Monitor" || activeTab === "Renames") && (
          <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
            No data available
          </div>
        )}
      </div>

      {/* Copy Trade Drawer */}
      <CopyTradeDrawer
        open={copyTradeOpen}
        onOpenChange={setCopyTradeOpen}
        traderAddress={trader.fullAddress}
        pnl7d="320.14%($17.5K)"
        winRate="99.22%"
        lastTime="11m ago"
        onConfirmed={() => {
          if (token) loadFollowing(token, trader.fullAddress).catch(() => {});
        }}
      />
    </div>
  );
}
