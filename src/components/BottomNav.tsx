import { TrendingUp, Copy, Eye, Wallet, Flame } from "lucide-react";
import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: "trenches", label: "Trenches", icon: <Flame className="w-5 h-5" /> },
  { id: "trending", label: "Trending", icon: <TrendingUp className="w-5 h-5" /> },
  { id: "copytrade", label: "CopyTrade", icon: <Copy className="w-5 h-5" /> },
  { id: "monitor", label: "Monitor", icon: <Eye className="w-5 h-5" /> },
  { id: "portfolio", label: "Portfolio", icon: <Wallet className="w-5 h-5" /> },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === item.id
                ? "text-gmgn-green"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.icon}
            <span className="text-2xs mt-0.5 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
