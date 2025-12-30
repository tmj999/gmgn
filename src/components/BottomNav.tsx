interface NavItem {
  id: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

// Custom SVG icons matching GMGN exactly
const TrenchesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4h6v6H4z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 4h6v6h-6z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 14h6v6H4z" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 14v6M14 17h6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrendingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 7l4 4m0 0l-4 4m4-4H7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 17l-4-4m0 0l4-4m-4 4h14" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
  </svg>
);

const CopyTradeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="5" width="14" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 5V3a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2h-2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MonitorIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrackIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 19H5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PortfolioIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 10h18" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 4v6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const navItems: NavItem[] = [
  { id: "trenches", label: "Trenches", icon: () => <TrenchesIcon /> },
  { id: "trending", label: "Trending", icon: () => <TrendingIcon /> },
  { id: "copytrade", label: "CopyTrade", icon: () => <CopyTradeIcon /> },
  { id: "monitor", label: "Monitor", icon: () => <MonitorIcon /> },
  { id: "track", label: "Track", icon: () => <TrackIcon /> },
  { id: "portfolio", label: "Portfolio", icon: () => <PortfolioIcon /> },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-[#1a1a1a] z-50">
      <div className="flex items-center justify-around h-[56px] pb-safe">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-gmgn-green"
                  : "text-[#5c5c5c] hover:text-[#888]"
              }`}
            >
              {item.icon(isActive)}
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
