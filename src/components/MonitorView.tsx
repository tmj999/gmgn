import { useState } from "react";
import { TabBar } from "./TabBar";
import { Plus, Bell, BellOff, Trash2, Settings } from "lucide-react";

const tabs = [
  { id: "wallets", label: "Wallets", count: 12 },
  { id: "tokens", label: "Tokens", count: 8 },
  { id: "alerts", label: "Alerts", count: 5 },
];

interface WatchedWallet {
  id: string;
  label: string;
  address: string;
  balance: string;
  lastActive: string;
  isAlertOn: boolean;
  holdings: number;
}

const mockWallets: WatchedWallet[] = [
  { id: "1", label: "Whale 1", address: "7xKX...3m2P", balance: "2,456.8 SOL", lastActive: "2m ago", isAlertOn: true, holdings: 15 },
  { id: "2", label: "Smart Trader", address: "9pQR...8n4K", balance: "892.3 SOL", lastActive: "15m ago", isAlertOn: true, holdings: 8 },
  { id: "3", label: "Insider Dev", address: "3mNP...5k7J", balance: "156.8 SOL", lastActive: "1h ago", isAlertOn: false, holdings: 23 },
  { id: "4", label: "KOL Wallet", address: "5kLM...2p9X", balance: "45.6 SOL", lastActive: "3h ago", isAlertOn: true, holdings: 5 },
];

export function MonitorView() {
  const [activeTab, setActiveTab] = useState("wallets");

  return (
    <div className="flex flex-col h-full">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Add Button */}
      <div className="px-3 py-2">
        <button className="w-full py-2.5 rounded-lg border border-dashed border-border text-muted-foreground text-sm flex items-center justify-center gap-2 hover:border-gmgn-green hover:text-gmgn-green transition-colors">
          <Plus className="w-4 h-4" />
          Add {activeTab === "wallets" ? "Wallet" : activeTab === "tokens" ? "Token" : "Alert"}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-20">
        <div className="flex flex-col gap-2">
          {mockWallets.map((wallet) => (
            <div
              key={wallet.id}
              className="token-card-gradient border border-border rounded-lg p-3 animate-slide-up"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground text-sm">{wallet.label}</span>
                    <span className="text-2xs text-muted-foreground font-mono">{wallet.address}</span>
                  </div>
                  <div className="text-2xs text-muted-foreground mt-1">
                    Last active: {wallet.lastActive}
                  </div>
                </div>
                
                <div className="flex items-center gap-1">
                  <button className="p-1.5 rounded hover:bg-secondary transition-colors">
                    {wallet.isAlertOn ? (
                      <Bell className="w-4 h-4 text-gmgn-green" />
                    ) : (
                      <BellOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                  <button className="p-1.5 rounded hover:bg-secondary transition-colors">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-secondary transition-colors">
                    <Trash2 className="w-4 h-4 text-muted-foreground hover:text-gmgn-red" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-2xs">
                <div>
                  <span className="text-muted-foreground">Balance </span>
                  <span className="text-foreground font-semibold">{wallet.balance}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Holdings </span>
                  <span className="text-foreground font-medium">{wallet.holdings} tokens</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
