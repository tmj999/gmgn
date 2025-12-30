import { ChevronDown, LogOut, Search, Settings, Trophy, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function SolanaMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <defs>
        <linearGradient id="sol-nav" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
      </defs>
      <path
        d="M6.8 6.3a.9.9 0 0 1 .65-.27H20a.45.45 0 0 1 .32.77l-2.08 2.1a.9.9 0 0 1-.65.27H5.98a.45.45 0 0 1-.32-.77l1.14-1.16Z"
        fill="url(#sol-nav)"
      />
      <path
        d="M6.8 10.95a.9.9 0 0 1 .65-.27H20a.45.45 0 0 1 .32.77l-2.08 2.1a.9.9 0 0 1-.65.27H5.98a.45.45 0 0 1-.32-.77l1.14-1.16Z"
        fill="url(#sol-nav)"
        opacity="0.85"
      />
      <path
        d="M6.8 15.6a.9.9 0 0 1 .65-.27H20a.45.45 0 0 1 .32.77l-2.08 2.1a.9.9 0 0 1-.65.27H5.98a.45.45 0 0 1-.32-.77l1.14-1.16Z"
        fill="url(#sol-nav)"
        opacity="0.7"
      />
    </svg>
  );
}

const chains = [
  { id: "sol", name: "SOL", color: "#9945FF" },
  { id: "eth", name: "ETH", color: "#627EEA" },
  { id: "bsc", name: "BSC", color: "#F0B90B" },
  { id: "base", name: "BASE", color: "#0052FF" },
];

export function Header() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [selectedChain, setSelectedChain] = useState(chains[0]);
  const [showChainDropdown, setShowChainDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border/50">
      <div className="mx-auto w-full max-w-[768px] flex items-center justify-between px-3 h-12">
        {/* Left cluster */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-secondary/70 flex items-center justify-center">
            <span className="text-gmgn-green text-sm font-bold">✦</span>
          </div>
        </div>

        {/* Middle badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/40 border border-border/50">
          
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          <button
            onClick={() => setShowChainDropdown(!showChainDropdown)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-secondary/40 transition-colors"
          >
            <SolanaMark />
            <span className="text-[14px]  text-foreground">{selectedChain.name}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          <button className="p-2 rounded-md hover:bg-secondary/40 transition-colors" aria-label="Search">
            <Search className="w-5 h-5 text-muted-foreground" />
          </button>
          <button className="p-2 rounded-md hover:bg-secondary/40 transition-colors" aria-label="Settings">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
          <Trophy className="w-4 h-4 text-gmgn-yellow" />
          <span className="text-[14px] text-gmgn-yellow">2025</span>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-8 h-8 rounded-full bg-gmgn-green flex items-center justify-center"
                aria-label="User menu"
              >
                <User className="w-4 h-4 text-background" />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-10 bg-card border border-border rounded-lg shadow-xl p-1.5 min-w-[160px] z-50 animate-slide-up">
                    <div className="px-2.5 py-1.5 border-b border-border mb-1">
                      <p className="text-2xs text-muted-foreground truncate max-w-[140px]">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded text-xs text-gmgn-red hover:bg-secondary/50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>退出登录</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth?mode=signup")}
                className="h-9 px-4 rounded-lg bg-secondary/60 text-foreground text-[12px] font-semibold hover:bg-secondary/80 transition-colors"
              >
                Sign Up
              </button>
              <button
                onClick={() => navigate("/auth?mode=login")}
                className="h-9 px-4 rounded-lg bg-foreground text-background text-[12px] font-semibold hover:opacity-90 transition-opacity"
              >
                Log In
              </button>
            </>
          )}
        </div>
      </div>

      {/* Chain Dropdown */}
      {showChainDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowChainDropdown(false)}
          />
          <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-xl p-1.5 min-w-[120px] z-50 animate-slide-up">
            {chains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => {
                  setSelectedChain(chain);
                  setShowChainDropdown(false);
                }}
                className={`flex items-center gap-2 w-full px-2.5 py-1.5 rounded text-xs transition-colors ${
                  selectedChain.id === chain.id
                    ? "bg-secondary text-foreground"
                    : "hover:bg-secondary/50 text-muted-foreground"
                }`}
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chain.color }} />
                <span>{chain.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </header>
  );
}
