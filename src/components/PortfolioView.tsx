import { useState } from "react";
import { TabBar } from "./TabBar";
import { Wallet, TrendingUp, TrendingDown, RefreshCw, ExternalLink } from "lucide-react";

const tabs = [
  { id: "holdings", label: "Holdings" },
  { id: "history", label: "History" },
  { id: "pnl", label: "PnL" },
];

interface Holding {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  balance: string;
  value: string;
  price: string;
  change: number;
  avgBuy: string;
  pnl: string;
  pnlPercent: number;
}

const mockHoldings: Holding[] = [
  {
    id: "1",
    symbol: "SOL",
    name: "Solana",
    logo: "https://ui-avatars.com/api/?name=SO&background=9333ea&color=fff",
    balance: "125.67",
    value: "$23,456.78",
    price: "$186.67",
    change: 5.2,
    avgBuy: "$145.00",
    pnl: "+$5,234.56",
    pnlPercent: 28.7,
  },
  {
    id: "2",
    symbol: "GOAT",
    name: "Goatseus Maximus",
    logo: "https://ui-avatars.com/api/?name=GO&background=f97316&color=fff",
    balance: "45,678",
    value: "$4,567.89",
    price: "$0.10",
    change: -2.3,
    avgBuy: "$0.05",
    pnl: "+$2,283.95",
    pnlPercent: 100.0,
  },
  {
    id: "3",
    symbol: "AI16Z",
    name: "ai16z",
    logo: "https://ui-avatars.com/api/?name=AI&background=3b82f6&color=fff",
    balance: "12,345",
    value: "$1,234.50",
    price: "$0.10",
    change: 12.5,
    avgBuy: "$0.15",
    pnl: "-$617.25",
    pnlPercent: -33.3,
  },
];

export function PortfolioView() {
  const [activeTab, setActiveTab] = useState("holdings");
  const [isConnected, setIsConnected] = useState(false);

  if (!isConnected) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 pb-20">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Wallet className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Connect Wallet</h2>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Connect your wallet to view your portfolio and track your holdings
        </p>
        <button
          onClick={() => setIsConnected(true)}
          className="px-6 py-3 rounded-lg bg-gmgn-green text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Portfolio Summary */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">Total Value</span>
          <button className="p-1 rounded hover:bg-secondary transition-colors">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="text-2xl font-bold text-foreground">$29,259.17</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gmgn-green">+$6,901.26</span>
          <span className="text-sm text-gmgn-green">(+30.88%)</span>
          <TrendingUp className="w-4 h-4 text-gmgn-green" />
        </div>
      </div>
      
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3 pb-20">
        <div className="flex flex-col gap-2">
          {mockHoldings.map((holding) => (
            <div
              key={holding.id}
              className="token-card-gradient border border-border rounded-lg p-3 animate-slide-up"
            >
              <div className="flex items-start gap-3">
                <img
                  src={holding.logo}
                  alt={holding.symbol}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{holding.symbol}</span>
                    <span className="text-2xs text-muted-foreground truncate">{holding.name}</span>
                  </div>
                  <div className="text-2xs text-muted-foreground mt-0.5">
                    {holding.balance} tokens
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-semibold text-foreground">{holding.value}</div>
                  <div className={`text-2xs ${holding.change >= 0 ? "text-gmgn-green" : "text-gmgn-red"}`}>
                    {holding.change >= 0 ? "+" : ""}{holding.change.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-2xs">
                <div>
                  <span className="text-muted-foreground">Avg Buy </span>
                  <span className="text-foreground font-medium">{holding.avgBuy}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">PnL </span>
                  <span className={`font-semibold ${holding.pnlPercent >= 0 ? "text-gmgn-green" : "text-gmgn-red"}`}>
                    {holding.pnl} ({holding.pnlPercent >= 0 ? "+" : ""}{holding.pnlPercent.toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
