import { Search, ChevronDown, Bell, Settings } from "lucide-react";
import { useState } from "react";

const chains = [
  { id: "sol", name: "SOL", icon: "🟣" },
  { id: "eth", name: "ETH", icon: "🔷" },
  { id: "bsc", name: "BSC", icon: "🟡" },
  { id: "base", name: "BASE", icon: "🔵" },
];

export function Header() {
  const [selectedChain, setSelectedChain] = useState(chains[0]);
  const [showChainDropdown, setShowChainDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between px-3 h-12">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-gmgn-green text-lg">✦</span>
            <span className="font-bold text-foreground text-base">GMGN</span>
          </div>
        </div>

        {/* Chain Selector */}
        <button
          onClick={() => setShowChainDropdown(!showChainDropdown)}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <span className="text-sm">{selectedChain.icon}</span>
          <span className="text-xs font-medium text-foreground">{selectedChain.name}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-md hover:bg-secondary transition-colors">
            <Search className="w-4 h-4 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-md hover:bg-secondary transition-colors relative">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gmgn-red rounded-full"></span>
          </button>
          <button className="px-3 py-1.5 rounded-md bg-gmgn-green text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity">
            Log In
          </button>
        </div>
      </div>

      {/* Chain Dropdown */}
      {showChainDropdown && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-xl p-2 min-w-[120px] animate-slide-up">
          {chains.map((chain) => (
            <button
              key={chain.id}
              onClick={() => {
                setSelectedChain(chain);
                setShowChainDropdown(false);
              }}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors ${
                selectedChain.id === chain.id
                  ? "bg-secondary text-foreground"
                  : "hover:bg-secondary/50 text-muted-foreground"
              }`}
            >
              <span>{chain.icon}</span>
              <span>{chain.name}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
