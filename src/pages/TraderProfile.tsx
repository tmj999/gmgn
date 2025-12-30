import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Star, Copy, ExternalLink, Bell, Users, TrendingUp, Wallet, ChevronDown } from "lucide-react";
import { toast } from "sonner";

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

const profileTabs = ["Wallet", "Track", "Monitor", "Renames"];

const mockHoldings = [
  { symbol: "SOL", name: "Solana", amount: "2,345.67", value: "$523,456", change: "+5.2%", positive: true },
  { symbol: "BONK", name: "Bonk", amount: "12.5M", value: "$45,678", change: "-2.1%", positive: false },
  { symbol: "WIF", name: "dogwifhat", amount: "45,678", value: "$34,567", change: "+12.3%", positive: true },
  { symbol: "JUP", name: "Jupiter", amount: "23,456", value: "$23,456", change: "+8.7%", positive: true },
  { symbol: "PYTH", name: "Pyth Network", amount: "78,901", value: "$12,345", change: "-0.5%", positive: false },
];

const mockTrades = [
  { age: "2m", token: "LIT", type: "Buy", amount: "$2,345", pnl: "+$456", positive: true },
  { age: "15m", token: "FART", type: "Sell", amount: "$5,678", pnl: "+$1,234", positive: true },
  { age: "1h", token: "AI16Z", type: "Buy", amount: "$12,345", pnl: "-$234", positive: false },
  { age: "3h", token: "GOAT", type: "Sell", amount: "$8,901", pnl: "+$2,567", positive: true },
  { age: "6h", token: "PUMP", type: "Buy", amount: "$3,456", pnl: "+$789", positive: true },
];

export default function TraderProfile() {
  const { address } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Wallet");
  const [copied, setCopied] = useState(false);

  const trader = mockTraderData;

  const handleCopy = () => {
    navigator.clipboard.writeText(trader.fullAddress);
    setCopied(true);
    toast.success("Address copied!");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopyTrade = () => {
    toast.success("Copy trade enabled for this trader!");
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
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
          className="w-full mt-4 py-3 bg-gmgn-green text-black font-semibold rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Users className="w-4 h-4" />
          Copy Trade
        </button>
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
            {mockHoldings.map((holding, index) => (
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
            ))}
          </>
        )}

        {activeTab === "Track" && (
          <>
            <div className="px-3 py-2 text-xs text-muted-foreground border-b border-[#1a1a1a] flex items-center justify-between">
              <span>Recent Trades</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            {mockTrades.map((trade, index) => (
              <div 
                key={index} 
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
            ))}
          </>
        )}

        {(activeTab === "Monitor" || activeTab === "Renames") && (
          <div className="flex items-center justify-center h-48 text-sm text-muted-foreground">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}
