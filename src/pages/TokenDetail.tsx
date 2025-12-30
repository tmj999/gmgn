import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { KlineChart } from "@/components/KlineChart";
import { TradeDrawer, type TradeSide } from "@/components/TradeDrawer";
import { ArrowLeft, Share2, Star, ExternalLink, Copy, ChevronDown, Settings, RefreshCw, Zap, Tag, AlertCircle, Filter, Clock, Users } from "lucide-react";
import { apiRequest } from "@/lib/apiClient";
import { useAuth } from "@/hooks/useAuth";

// Mock token data
const mockTokenData = {
  symbol: "LIT",
  name: "litDRIve Lightteray L1",
  logo: "https://ui-avatars.com/api/?name=LIT&background=1a1a1a&color=22c55e&size=64",
  address: "5sHv...pYWs",
  fullAddress: "5sHvh8AwE3tcZh6W7EdUM7J2fxKhZ3A9jn57g4nRpYWs",
  age: "3m",
  price: "$15.72K",
  priceRaw: "$0.0157",
  liq: "$4.98K",
  vol24h: "$4.21K",
  totalFees: "0.048",
  supply: "1B",
  taxes: "0.25%",
  changes: {
    "1m": { value: 4.59, positive: true },
    "5m": { value: 28.1, positive: true },
    "1h": { value: 41.65, positive: true },
    "24h": { value: 61.65, positive: true },
  },
  top10: 11.82,
  dev: 0,
  holders: 125,
  holdersPercent: 83.59,
  snipers: 0.14,
  insiders: 2.2,
  pooling: 0.2,
  bundler: 0,
  dexPair: "Unpaid",
  notMint: true,
  noBlacklist: true,
  burnt: 100,
  rug: 0,
};

type TokenChange = { value: number; positive: boolean };
type TokenDetailData = typeof mockTokenData & {
  changes: Record<string, TokenChange>;
};

function buildTradeTabs(holdersPercent: number) {
  return [
    { id: "Trades", label: "Trades", hasDropdown: true },
    { id: "Positions", label: "Positions" },
    { id: "Orders", label: "Orders" },
    { id: "Holders", label: `Holders 7 🔥${holdersPercent}%` },
    { id: "TopTraders", label: "Top Traders" },
    { id: "Tracking", label: "Tra..." },
  ];
}

export default function TokenDetail() {
  const { address } = useParams();
  const navigate = useNavigate();
  const { user, token: authToken, refreshMe } = useAuth();
  const [activeTradeTab, setActiveTradeTab] = useState("Trades");
  const [copied, setCopied] = useState(false);

  const [tradeOpen, setTradeOpen] = useState(false);
  const [tradeSide, setTradeSide] = useState<TradeSide>("buy");

  const [trades, setTrades] = useState<
    Array<{
      id: string;
      createdAt: string;
      tokenAddress: string;
      userId: string;
      side: "buy" | "sell";
      solAmount: number;
      tokenAmount: number;
      rate: number;
      copiedFromUserId?: string;
    }>
  >([]);
  const [loadingTrades, setLoadingTrades] = useState(false);

  const [backendToken, setBackendToken] = useState<Partial<TokenDetailData> | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const addr = String(address || "");
    if (!addr) {
      setBackendToken(null);
      setLoadingToken(false);
      return;
    }

    setLoadingToken(true);
    apiRequest<{ ok: true; token: Partial<TokenDetailData> }>(`/api/tokens/${addr}`, {
      method: "GET",
    })
      .then((data) => {
        if (cancelled) return;
        setBackendToken(data.token ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setBackendToken(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingToken(false);
      });

    return () => {
      cancelled = true;
    };
  }, [address]);

  const token: TokenDetailData = useMemo(() => {
    const merged: any = { ...mockTokenData, ...(backendToken ?? {}) };
    if (!merged.fullAddress && address) merged.fullAddress = String(address);
    if (!merged.address && address) merged.address = String(address);
    if (!merged.logo && merged.symbol) {
      merged.logo = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        String(merged.symbol)
      )}&background=1a1a1a&color=22c55e&size=64`;
    }
    if (!merged.changes || typeof merged.changes !== "object") {
      merged.changes = mockTokenData.changes;
    }
    return merged as TokenDetailData;
  }, [backendToken, address]);

  const tradeTabs = useMemo(() => buildTradeTabs(token.holdersPercent), [token.holdersPercent]);

  const solBalance =
    user?.wallets?.find((w) => w.chain === "sol")?.balance ?? 0;

  const activeTokenAddress = address || token.fullAddress;

  const formatAge = (iso: string) => {
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
  };

  const loadTrades = async () => {
    if (!activeTokenAddress) {
      setTrades([]);
      return;
    }

    setLoadingTrades(true);
    try {
      const data = await apiRequest<{ ok: true; trades: typeof trades }>(
        `/api/trade/token-history?tokenAddress=${encodeURIComponent(activeTokenAddress)}`,
        { method: "GET" }
      );
      setTrades(Array.isArray(data.trades) ? data.trades : []);
    } catch {
      setTrades([]);
    } finally {
      setLoadingTrades(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    if (!activeTokenAddress) {
      setTrades([]);
      return;
    }

    setLoadingTrades(true);
    apiRequest<{ ok: true; trades: typeof trades }>(
      `/api/trade/token-history?tokenAddress=${encodeURIComponent(activeTokenAddress)}`,
      { method: "GET" }
    )
      .then((data) => {
        if (cancelled) return;
        setTrades(Array.isArray(data.trades) ? data.trades : []);
      })
      .catch(() => {
        if (cancelled) return;
        setTrades([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingTrades(false);
      });

    return () => {
      cancelled = true;
    };
  }, [authToken, activeTokenAddress]);

  const handleCopy = () => {
    navigator.clipboard.writeText(token.fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleTraderClick = (traderAddress: string) => {
    navigate(`/trader/${traderAddress}`);
  };

  const tradeRows = useMemo(() => {
    return trades.map((t) => {
      const isBuy = t.side === "buy";
      const type = isBuy ? "Buy" : "Sell";
      const amount = `${t.tokenAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })}`;
      const totalUsd = `${isBuy ? "-" : "+"}${t.solAmount.toLocaleString(undefined, {
        maximumFractionDigits: 4,
      })} SOL`;
      return {
        id: t.id,
        age: formatAge(t.createdAt),
        type,
        mc: "-",
        amount,
        totalUsd,
        trader: {
          address: t.userId || "-",
          icon: "👤",
          badge: undefined as string | undefined,
          count: 1,
        },
      };
    });
  }, [trades]);

  return (
    <div className="mx-auto w-full max-w-[480px] flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#1a1a1a]">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <button className="p-1.5 text-muted-foreground hover:text-foreground">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground">
            <Star className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Token Info */}
      <div className="px-3 py-3 border-b border-[#1a1a1a]">
        {loadingToken && (
          <div className="mb-2 text-xs text-muted-foreground">Loading...</div>
        )}
        <div className="flex items-center gap-3">
          <img
            src={token.logo}
            alt={token.symbol}
            className="w-10 h-10 rounded-lg object-cover bg-[#1a1a1a]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${token.symbol}&background=1a1a1a&color=22c55e&size=40`;
            }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{token.symbol}</span>
              <span className="text-xs text-muted-foreground truncate max-w-[120px]">{token.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-muted-foreground">{token.age}</span>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground"
              >
                <span className="font-mono">{token.address}</span>
                <Copy className="w-2.5 h-2.5" />
              </button>
              <button className="text-muted-foreground hover:text-foreground">
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{token.price}</div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-2 mt-3 text-[10px]">
          <div>
            <div className="text-muted-foreground">Price</div>
            <div className="text-foreground font-medium">{token.priceRaw}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Liq</div>
            <div className="text-foreground font-medium">{token.liq}</div>
          </div>
          <div>
            <div className="text-muted-foreground">24h Vol</div>
            <div className="text-foreground font-medium">{token.vol24h}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Total Fees</div>
            <div className="text-foreground font-medium">{token.totalFees}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Supply</div>
            <div className="text-foreground font-medium">{token.supply}</div>
          </div>
        </div>

        {/* Price Changes */}
        <div className="flex items-center gap-3 mt-3">
          {Object.entries(token.changes).map(([period, data]) => (
            <div key={period} className="flex items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{period}</span>
              <span className={`text-[10px] font-medium ${data.positive ? "text-gmgn-green" : "text-gmgn-red"}`}>
                {data.positive ? "+" : "-"}{data.value}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-shrink-0">
        {/* K-Line Chart */}
        <KlineChart tokenAddress={address || token.fullAddress} />
      </div>

      {/* Trade Tabs - Horizontal Scroll */}
      <div className="border-b border-[#1a1a1a] overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-0 px-2 min-w-max">
          {tradeTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTradeTab(tab.id)}
              className={`flex items-center gap-0.5 px-2.5 py-2.5 text-xs whitespace-nowrap border-b-2 transition-colors ${
                activeTradeTab === tab.id
                  ? "text-foreground border-foreground"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tab.label}
              {tab.hasDropdown && <ChevronDown className="w-3 h-3" />}
            </button>
          ))}
          <button className="px-2 py-2.5 text-muted-foreground hover:text-foreground">
            <Users className="w-4 h-4" />
          </button>
          <button className="px-2 py-2.5 text-muted-foreground hover:text-foreground">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Trade List Header */}
      <div className="grid grid-cols-6 gap-1 px-3 py-2 text-[10px] text-muted-foreground border-b border-[#1a1a1a] bg-[#0a0a0a]">
        <div className="flex items-center gap-0.5">
          <Settings className="w-3 h-3" />
          Age
          <ChevronDown className="w-2.5 h-2.5" />
          <Clock className="w-2.5 h-2.5" />
          <Filter className="w-2.5 h-2.5" />
        </div>
        <div className="flex items-center gap-0.5">
          Type
          <Filter className="w-2.5 h-2.5" />
        </div>
        <div className="flex items-center gap-0.5">
          MC
          <ChevronDown className="w-2.5 h-2.5" />
        </div>
        <div>Amount</div>
        <div className="flex items-center gap-0.5">
          Total USD
          <span className="text-[8px]">💰</span>
          <Filter className="w-2.5 h-2.5" />
        </div>
        <div className="flex items-center gap-0.5 justify-end">
          Trader
          <Filter className="w-2.5 h-2.5" />
          <span className="text-[8px]">T&gt;</span>
        </div>
      </div>

      {/* Trade List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loadingTrades ? (
          <div className="p-4 text-sm text-muted-foreground">Loading trades...</div>
        ) : tradeRows.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground">
            No trades yet
          </div>
        ) : (
          tradeRows.map((trade) => (
            <div key={trade.id} className="grid grid-cols-6 gap-1 px-3 py-2.5 text-xs border-b border-[#0d0d0d] items-center">
            <div className="text-muted-foreground">{trade.age}</div>
            <div className={
              trade.type === "Buy" ? "text-gmgn-green" : 
              trade.type === "Sell" ? "text-gmgn-red" : 
              "text-purple-400"
            }>
              {trade.type}
            </div>
            <div className={
              trade.type === "Buy" ? "text-foreground" : 
              trade.type === "Sell" ? "text-foreground" : 
              "text-purple-400"
            }>{trade.mc}</div>
            <div className="text-foreground">{trade.amount}</div>
            <div className={
              trade.type === "Buy" ? "text-gmgn-green" : 
              trade.type === "Sell" ? "text-gmgn-red" : 
              "text-gmgn-green"
            }>
              {trade.totalUsd}
            </div>
            <div 
              className="flex items-center gap-0.5 justify-end cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleTraderClick(trade.trader.address)}
            >
              <span className="text-[10px]">{trade.trader.icon}</span>
              {trade.trader.badge && <span className="text-[10px]">{trade.trader.badge}</span>}
              <span className="text-yellow-400 font-mono text-[10px]">{trade.trader.address}</span>
              <ExternalLink className="w-2.5 h-2.5 text-muted-foreground" />
              <span className="text-muted-foreground text-[10px]">{trade.trader.count}</span>
            </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation - Buy/Sell/Info */}
      <div className="border-t border-[#1a1a1a] bg-[#0a0a0a] px-4 py-3">
        <div className="flex items-center justify-around">
          <button
            className="flex flex-col items-center gap-1 text-foreground hover:opacity-80 transition-opacity"
            onClick={() => {
              setTradeSide("buy");
              setTradeOpen(true);
            }}
          >
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xs">Buy</span>
          </button>
          <button
            className="flex flex-col items-center gap-1 text-foreground hover:opacity-80 transition-opacity"
            onClick={() => {
              setTradeSide("sell");
              setTradeOpen(true);
            }}
          >
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <span className="text-xs">Sell</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-foreground hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-xs">Info</span>
          </button>
        </div>
      </div>

      <TradeDrawer
        open={tradeOpen}
        onOpenChange={setTradeOpen}
        side={tradeSide}
        tokenAddress={activeTokenAddress}
        tokenSymbol={token.symbol}
        authToken={authToken}
        solBalance={solBalance}
        onTraded={() => {
          refreshMe(authToken).catch(() => {});
          loadTrades().catch(() => {});
        }}
      />
    </div>
  );
}
