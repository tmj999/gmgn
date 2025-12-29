import { Search, Bell, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

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
      <div className="flex items-center justify-between px-3 h-11">
        {/* Logo */}
        <div className="flex items-center gap-1.5">
          <span className="text-gmgn-green text-base font-bold">✦</span>
          <span className="font-bold text-foreground text-[15px] tracking-tight">GMGN</span>
        </div>

        {/* Chain Selector - Center */}
        <button
          onClick={() => setShowChainDropdown(!showChainDropdown)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/80 hover:bg-secondary transition-colors"
        >
          <div 
            className="w-3.5 h-3.5 rounded-full"
            style={{ backgroundColor: selectedChain.color }}
          />
          <span className="text-xs font-medium text-foreground">{selectedChain.name}</span>
          <svg 
            className="w-3 h-3 text-muted-foreground" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-1">
          <button className="p-2 rounded-md hover:bg-secondary/50 transition-colors">
            <Search className="w-[18px] h-[18px] text-muted-foreground" />
          </button>
          <button className="p-2 rounded-md hover:bg-secondary/50 transition-colors relative">
            <Bell className="w-[18px] h-[18px] text-muted-foreground" />
          </button>
          
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="ml-1 w-7 h-7 rounded-full bg-gmgn-green flex items-center justify-center"
              >
                <User className="w-4 h-4 text-background" />
              </button>
              
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div className="absolute right-0 top-9 bg-card border border-border rounded-lg shadow-xl p-1.5 min-w-[140px] z-50 animate-slide-up">
                    <div className="px-2.5 py-1.5 border-b border-border mb-1">
                      <p className="text-2xs text-muted-foreground truncate max-w-[120px]">
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
            <button 
              onClick={() => navigate("/auth")}
              className="ml-1 px-3 py-1.5 rounded bg-gmgn-green text-[#000] text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Log In
            </button>
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
          <div className="absolute top-11 left-1/2 -translate-x-1/2 bg-card border border-border rounded-lg shadow-xl p-1.5 min-w-[100px] z-50 animate-slide-up">
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
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: chain.color }}
                />
                <span>{chain.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </header>
  );
}
