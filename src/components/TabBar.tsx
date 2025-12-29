import { SlidersHorizontal, ChevronDown } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex items-center px-3 py-2 overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-gmgn-green text-[#000]"
                  : "text-[#888] hover:text-foreground"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] ${isActive ? "text-[#000]/70" : "text-[#666]"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="flex-1" />
      
      <button className="flex items-center gap-1 px-2 py-1 text-xs text-[#888] hover:text-foreground transition-colors">
        <SlidersHorizontal className="w-3.5 h-3.5" />
        <span>Filter</span>
        <ChevronDown className="w-3 h-3" />
      </button>
    </div>
  );
}
