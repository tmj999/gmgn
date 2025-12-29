import { useState } from "react";
import { TabBar } from "./TabBar";
import { TrendingUp, Clock, Flame } from "lucide-react";

const tabs = [
  { id: "1m", label: "1m" },
  { id: "5m", label: "5m" },
  { id: "1h", label: "1h" },
  { id: "6h", label: "6h" },
  { id: "24h", label: "24h" },
];

interface TrendingToken {
  rank: number;
  symbol: string;
  name: string;
  logo: string;
  price: string;
  change: number;
  volume: string;
  marketCap: string;
}

const mockTrending: TrendingToken[] = [
  { rank: 1, symbol: "GOAT", name: "Goatseus Maximus", logo: "https://ui-avatars.com/api/?name=GO&background=f97316&color=fff", price: "$0.89", change: 156.2, volume: "$45.2M", marketCap: "$890M" },
  { rank: 2, symbol: "PNUT", name: "Peanut the Squirrel", logo: "https://ui-avatars.com/api/?name=PN&background=a16207&color=fff", price: "$1.23", change: 89.5, volume: "$32.1M", marketCap: "$1.2B" },
  { rank: 3, symbol: "AI16Z", name: "ai16z", logo: "https://ui-avatars.com/api/?name=AI&background=3b82f6&color=fff", price: "$0.45", change: 67.8, volume: "$18.9M", marketCap: "$450M" },
  { rank: 4, symbol: "FARTCOIN", name: "Fartcoin", logo: "https://ui-avatars.com/api/?name=FA&background=22c55e&color=fff", price: "$0.034", change: -12.3, volume: "$8.7M", marketCap: "$34M" },
  { rank: 5, symbol: "POPCAT", name: "Popcat", logo: "https://ui-avatars.com/api/?name=PC&background=ec4899&color=fff", price: "$0.78", change: 45.6, volume: "$25.6M", marketCap: "$780M" },
  { rank: 6, symbol: "MOODENG", name: "Moo Deng", logo: "https://ui-avatars.com/api/?name=MD&background=8b5cf6&color=fff", price: "$0.12", change: 234.5, volume: "$56.7M", marketCap: "$120M" },
];

export function TrendingView() {
  const [activeTab, setActiveTab] = useState("1h");

  return (
    <div className="flex flex-col h-full">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3 pb-20">
        <div className="flex flex-col gap-2">
          {mockTrending.map((token) => (
            <div
              key={token.rank}
              className="token-card-gradient border border-border rounded-lg p-3 animate-slide-up flex items-center gap-3"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-xs font-bold text-muted-foreground">
                {token.rank}
              </div>
              
              <img
                src={token.logo}
                alt={token.symbol}
                className="w-10 h-10 rounded-lg object-cover"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{token.symbol}</span>
                  <span className="text-2xs text-muted-foreground truncate">{token.name}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-2xs">
                  <span className="text-muted-foreground">MC {token.marketCap}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">Vol {token.volume}</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">{token.price}</div>
                <div className={`text-xs ${token.change >= 0 ? "text-gmgn-green" : "text-gmgn-red"}`}>
                  {token.change >= 0 ? "+" : ""}{token.change.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
