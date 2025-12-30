import { useState } from "react";
import { Bell, Plus, Search, Settings } from "lucide-react";

export function TrackView() {
  const [activeTab, setActiveTab] = useState("alerts");

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-[#1a1a1a]">
        <h2 className="text-sm font-semibold text-foreground">Track</h2>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg bg-[#1a1a1a] text-muted-foreground hover:text-foreground">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-lg bg-[#1a1a1a] text-muted-foreground hover:text-foreground">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 px-3 pt-3 border-b border-[#1a1a1a]">
        {["Alerts", "Wallets", "Tokens"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`pb-2 text-xs font-medium transition-colors relative ${
              activeTab === tab.toLowerCase()
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab.toLowerCase() && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <div className="w-14 h-14 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-4">
          <Bell className="w-6 h-6 text-muted-foreground" />
        </div>
        <h3 className="text-sm font-medium text-foreground mb-1">No {activeTab} yet</h3>
        <p className="text-2xs text-muted-foreground text-center mb-4">
          Start tracking wallets and tokens to get alerts
        </p>
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gmgn-green text-black text-xs font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          Add {activeTab === "alerts" ? "Alert" : activeTab === "wallets" ? "Wallet" : "Token"}
        </button>
      </div>
    </div>
  );
}