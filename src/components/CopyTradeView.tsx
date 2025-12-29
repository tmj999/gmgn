import { useState } from "react";
import { TabBar } from "./TabBar";
import { Copy, TrendingUp, Users, Star, MoreVertical } from "lucide-react";

const tabs = [
  { id: "smart", label: "Smart Money" },
  { id: "kol", label: "KOL" },
  { id: "fresh", label: "Fresh Wallet" },
  { id: "sniper", label: "Sniper" },
];

interface Trader {
  id: string;
  name: string;
  avatar: string;
  address: string;
  pnl: string;
  pnlPercent: number;
  winRate: number;
  trades: number;
  followers: number;
  isFollowing: boolean;
  tags: string[];
}

const mockTraders: Trader[] = [
  {
    id: "1",
    name: "Whale_Hunter",
    avatar: "https://ui-avatars.com/api/?name=WH&background=22c55e&color=fff",
    address: "7xKX...3m2P",
    pnl: "+$245.6K",
    pnlPercent: 1256.8,
    winRate: 78.5,
    trades: 342,
    followers: 12450,
    isFollowing: false,
    tags: ["Smart Money", "High Win"],
  },
  {
    id: "2",
    name: "CryptoKing",
    avatar: "https://ui-avatars.com/api/?name=CK&background=f97316&color=fff",
    address: "9pQR...8n4K",
    pnl: "+$189.2K",
    pnlPercent: 892.3,
    winRate: 72.1,
    trades: 567,
    followers: 8920,
    isFollowing: true,
    tags: ["KOL", "Verified"],
  },
  {
    id: "3",
    name: "SniperBot",
    avatar: "https://ui-avatars.com/api/?name=SB&background=8b5cf6&color=fff",
    address: "3mNP...5k7J",
    pnl: "+$156.8K",
    pnlPercent: 567.4,
    winRate: 85.2,
    trades: 1234,
    followers: 6780,
    isFollowing: false,
    tags: ["Sniper", "Bot"],
  },
  {
    id: "4",
    name: "DeFi_Master",
    avatar: "https://ui-avatars.com/api/?name=DM&background=3b82f6&color=fff",
    address: "5kLM...2p9X",
    pnl: "+$98.5K",
    pnlPercent: 345.6,
    winRate: 68.9,
    trades: 890,
    followers: 4560,
    isFollowing: false,
    tags: ["DeFi", "LP"],
  },
];

export function CopyTradeView() {
  const [activeTab, setActiveTab] = useState("smart");

  return (
    <div className="flex flex-col h-full">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3 pb-20">
        <div className="flex flex-col gap-2">
          {mockTraders.map((trader) => (
            <div
              key={trader.id}
              className="token-card-gradient border border-border rounded-lg p-3 animate-slide-up"
            >
              <div className="flex items-start gap-3">
                <img
                  src={trader.avatar}
                  alt={trader.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{trader.name}</span>
                    <span className="text-2xs text-muted-foreground font-mono">{trader.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {trader.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-2xs px-1.5 py-0.5 rounded bg-secondary text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="p-1 rounded hover:bg-secondary transition-colors">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              
              <div className="flex items-center gap-4 mt-3 text-2xs">
                <div>
                  <span className="text-muted-foreground">PnL </span>
                  <span className="text-gmgn-green font-semibold">{trader.pnl}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Win </span>
                  <span className="text-foreground font-medium">{trader.winRate}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Trades </span>
                  <span className="text-foreground font-medium">{trader.trades}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <Users className="w-3 h-3 text-muted-foreground" />
                  <span className="text-foreground font-medium">{(trader.followers / 1000).toFixed(1)}K</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                <button
                  className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${
                    trader.isFollowing
                      ? "bg-secondary text-muted-foreground"
                      : "bg-gmgn-green text-primary-foreground"
                  }`}
                >
                  {trader.isFollowing ? "Following" : "Copy Trade"}
                </button>
                <button className="p-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
                  <Star className={`w-4 h-4 ${trader.isFollowing ? "text-gmgn-yellow fill-gmgn-yellow" : "text-muted-foreground"}`} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
