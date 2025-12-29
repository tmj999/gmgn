import { Filter, ChevronDown } from "lucide-react";

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
    <div className="flex items-center gap-1 px-3 py-2 border-b border-border overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
            activeTab === tab.id
              ? "bg-gmgn-green/20 text-gmgn-green"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span className={`text-2xs ${activeTab === tab.id ? "text-gmgn-green/70" : "text-muted-foreground"}`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
      
      <div className="flex-1" />
      
      <button className="flex items-center gap-1 px-2 py-1.5 rounded-md bg-secondary text-xs text-muted-foreground hover:text-foreground transition-colors">
        <Filter className="w-3 h-3" />
        <span>Filter</span>
        <ChevronDown className="w-3 h-3" />
      </button>
    </div>
  );
}
