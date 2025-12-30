import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Star, ExternalLink, Copy, ChevronDown, Settings, RefreshCw } from "lucide-react";

// Mock token data
const mockTokenData = {
  symbol: "LIT",
  name: "litDRIve Lightteray L1",
  logo: "https://gmgn.ai/external-res/c1bad918931e3f14ec447351a541843a_v2.webp",
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

const timeFrames = ["1s", "30s", "1m", "1H", "4H", "1D"];
const tradeTabs = ["Trades", "Positions", "Holders 125", "Top Traders", "Tracking", "DCA", "Liquidity Pool", "Dev Token"];

export default function TokenDetail() {
  const { address } = useParams();
  const navigate = useNavigate();
  const [activeTimeFrame, setActiveTimeFrame] = useState("1m");
  const [activeTradeTab, setActiveTradeTab] = useState("Trades");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);

  const token = mockTokenData;

  const handleCopy = () => {
    navigator.clipboard.writeText(token.fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const mockTrades = [
    { age: "1s", type: "Buy", mc: "$15.7K", amount: "492.2K", profit: "$7,741", color: "green" },
    { age: "6s", type: "Buy", mc: "$15.5K", amount: "1.4M", profit: "$21.62", color: "green" },
    { age: "11s", type: "Sell", mc: "$15.3K", amount: "185.1K", profit: "$2,846", color: "red" },
    { age: "16s", type: "Sell", mc: "$15.4K", amount: "136.1K", profit: "$2,096", color: "red" },
    { age: "21s", type: "Buy", mc: "$15.3K", amount: "1.2M", profit: "$17.82", color: "green" },
    { age: "27s", type: "Sell", mc: "$15.2K", amount: "124.5K", profit: "$1,897", color: "red" },
    { age: "32s", type: "Sell", mc: "$15.2K", amount: "210.2K", profit: "$3,209", color: "red" },
    { age: "37s", type: "Sell", mc: "$15.3K", amount: "153.1K", profit: "$2,343", color: "red" },
  ];

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
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
        {/* Time Frame Selector */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-[#1a1a1a]">
          {timeFrames.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveTimeFrame(tf)}
              className={`px-2.5 py-1 text-xs rounded ${
                activeTimeFrame === tf
                  ? "bg-[#222] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tf}
            </button>
          ))}
          <div className="flex-1" />
          <button className="text-muted-foreground hover:text-foreground">
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Chart Placeholder */}
        <div className="h-40 bg-[#0a0a0a] flex items-center justify-center text-muted-foreground text-sm relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 text-4xl font-bold tracking-widest">
            GMGN.AI
          </div>
          <span>Chart Area</span>
        </div>
      </div>

      {/* Trade Tabs */}
      <div className="border-b border-[#1a1a1a] overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-3 py-2 min-w-max">
          {tradeTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTradeTab(tab)}
              className={`px-2 py-1 text-xs whitespace-nowrap ${
                activeTradeTab === tab
                  ? "text-foreground border-b-2 border-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Trade List Header */}
      <div className="grid grid-cols-5 gap-2 px-3 py-2 text-[10px] text-muted-foreground border-b border-[#1a1a1a]">
        <div className="flex items-center gap-1">
          Age
          <ChevronDown className="w-2.5 h-2.5" />
        </div>
        <div className="flex items-center gap-1">
          Type
          <ChevronDown className="w-2.5 h-2.5" />
        </div>
        <div>MC %</div>
        <div>Amount</div>
        <div className="text-right">Total USD</div>
      </div>

      {/* Trade List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {mockTrades.map((trade, index) => (
          <div key={index} className="grid grid-cols-5 gap-2 px-3 py-2 text-xs border-b border-[#0d0d0d]">
            <div className="text-muted-foreground">{trade.age}</div>
            <div className={trade.type === "Buy" ? "text-gmgn-green" : "text-gmgn-red"}>
              {trade.type}
            </div>
            <div className="text-foreground">{trade.mc}</div>
            <div className="text-foreground">{trade.amount}</div>
            <div className={`text-right ${trade.type === "Buy" ? "text-gmgn-green" : "text-gmgn-red"}`}>
              {trade.profit}
            </div>
          </div>
        ))}
      </div>

      {/* Security Info Bar */}
      <div className="px-3 py-2 border-t border-[#1a1a1a] bg-[#0d0d0d]">
        <div className="flex items-center gap-3 text-[10px] overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Top 10</span>
            <span className="text-gmgn-green">{token.top10}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">DEV</span>
            <span className="text-foreground">{token.dev}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Holders</span>
            <span className="text-foreground">{token.holders}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Snipers</span>
            <span className="text-foreground">{token.snipers}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Insiders</span>
            <span className="text-foreground">{token.insiders}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">🔥</span>
            <span className="text-gmgn-green">{token.burnt}%</span>
          </div>
        </div>
      </div>

      {/* Buy/Sell Panel */}
      <div className="border-t border-[#1a1a1a] bg-[#111] px-3 py-3">
        {/* Buy/Sell Toggle */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setTradeType("buy")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              tradeType === "buy"
                ? "bg-gmgn-green text-black"
                : "bg-[#1a1a1a] text-muted-foreground"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setTradeType("sell")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
              tradeType === "sell"
                ? "bg-gmgn-red text-white"
                : "bg-[#1a1a1a] text-muted-foreground"
            }`}
          >
            Sell
          </button>
          <button className="px-3 py-2 text-xs text-gmgn-green border border-gmgn-green/30 rounded-lg">
            Auto
          </button>
        </div>

        {/* Amount Presets */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-muted-foreground">Bal: 0 SOL</span>
          <div className="flex-1" />
          {["0.01", "0.1", "0.5", "1"].map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className={`px-2 py-1 text-xs rounded ${
                amount === val
                  ? "bg-[#222] text-foreground"
                  : "bg-[#1a1a1a] text-muted-foreground"
              }`}
            >
              {val}
            </button>
          ))}
        </div>

        {/* Trade Button */}
        <button
          className={`w-full py-3 text-sm font-semibold rounded-lg transition-colors ${
            tradeType === "buy"
              ? "bg-gmgn-green text-black hover:opacity-90"
              : "bg-gmgn-red text-white hover:opacity-90"
          }`}
        >
          {tradeType === "buy" ? "Buy" : "Sell"}
        </button>
      </div>
    </div>
  );
}
