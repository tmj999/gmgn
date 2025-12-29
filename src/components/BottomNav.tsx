import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

// Custom SVG icons matching GMGN exactly
const TrenchesIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendingIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="22,7 13.5,15.5 8.5,10.5 2,17" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16,7 22,7 22,13" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CopyTradeIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MonitorIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="21.17" y1="8" x2="12" y2="8" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="3.95" y1="6.06" x2="8.54" y2="14" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="10.88" y1="21.94" x2="15.46" y2="14" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PortfolioIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 12V7H5a2 2 0 010-4h14v4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 5v14a2 2 0 002 2h16v-5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 12a2 2 0 100 4h4v-4h-4z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const navItems: NavItem[] = [
  { id: "trenches", label: "Trenches", icon: (active) => <TrenchesIcon active={active} /> },
  { id: "trending", label: "Trending", icon: (active) => <TrendingIcon active={active} /> },
  { id: "copytrade", label: "CopyTrade", icon: (active) => <CopyTradeIcon active={active} /> },
  { id: "monitor", label: "Monitor", icon: (active) => <MonitorIcon active={active} /> },
  { id: "portfolio", label: "Portfolio", icon: (active) => <PortfolioIcon active={active} /> },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/50 z-50">
      <div className="flex items-center justify-around h-[52px] pb-safe">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-gmgn-green"
                  : "text-[#666] hover:text-[#888]"
              }`}
            >
              {item.icon(isActive)}
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
