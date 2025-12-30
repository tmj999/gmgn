import { useState } from "react";
import { TokenList } from "./TokenList";
import {
  ChevronDown,
  Filter,
  Search,
  HardHat,
  CircleDot,
  Play,
  ListChecks,
  BookmarkX,
} from "lucide-react";

function SolanaMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <defs>
        <linearGradient id="sol-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
      </defs>
      <path
        d="M6.8 6.3a.9.9 0 0 1 .65-.27H20a.45.45 0 0 1 .32.77l-2.08 2.1a.9.9 0 0 1-.65.27H5.98a.45.45 0 0 1-.32-.77l1.14-1.16Z"
        fill="url(#sol-a)"
      />
      <path
        d="M6.8 10.95a.9.9 0 0 1 .65-.27H20a.45.45 0 0 1 .32.77l-2.08 2.1a.9.9 0 0 1-.65.27H5.98a.45.45 0 0 1-.32-.77l1.14-1.16Z"
        fill="url(#sol-a)"
        opacity="0.85"
      />
      <path
        d="M6.8 15.6a.9.9 0 0 1 .65-.27H20a.45.45 0 0 1 .32.77l-2.08 2.1a.9.9 0 0 1-.65.27H5.98a.45.45 0 0 1-.32-.77l1.14-1.16Z"
        fill="url(#sol-a)"
        opacity="0.7"
      />
    </svg>
  );
}

const tabs = [
  { id: "new", label: "New" },
  { id: "almost", label: "Almost bonded" },
  { id: "migrated", label: "Migrated" },
];

export function TrenchesView() {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="flex flex-col h-full">
      {/* Trenches top row */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <HardHat className="w-4 h-4 text-muted-foreground" />

          <button className="flex items-center gap-1 text-[15px] font-semibold text-foreground">
            Trenches
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          <div className="flex items-center gap-2 ml-1">
            <button className="w-6 h-6 rounded-full bg-secondary/60 flex items-center justify-center" aria-label="Solana">
              <SolanaMark />
            </button>
            <button className="w-6 h-6 rounded-full bg-secondary/40 flex items-center justify-center text-muted-foreground" aria-label="Dot">
              <CircleDot className="w-4 h-4" />
            </button>
            <button className="w-6 h-6 rounded-full bg-secondary/40 flex items-center justify-center text-muted-foreground" aria-label="Dot 2">
              <CircleDot className="w-4 h-4 opacity-70" />
            </button>
            <button className="w-6 h-6 rounded-full bg-secondary/40 flex items-center justify-center text-muted-foreground" aria-label="Play">
              <Play className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <button className="p-2 rounded-md hover:bg-secondary/40 transition-colors" aria-label="List">
            <ListChecks className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-md hover:bg-secondary/40 transition-colors" aria-label="Bookmark">
            <BookmarkX className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs row */}
      <div className="flex items-center gap-3 px-3 pb-6 text-[13px]">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`font-medium transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* List area */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden scrollbar-hide px-3 pb-16">
        <div className="rounded-xl border border-border/60 bg-[#111] overflow-hidden">
          {/* Search / filters row (sticky, inside container) */}
          <div className="sticky top-0 z-10 border-b border-border/60 bg-[#111]">
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="text-base font-semibold text-foreground">New</span>

              <div className="flex-1" />

              <div className="flex items-center gap-2 w-[230px] max-w-[55%] rounded-full bg-secondary/70 px-3 py-1.5">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
                  placeholder="Keyword1, K..."
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-full bg-secondary/70 p-0.5 text-[12px]">
                  <button className="px-2 py-1 rounded-full bg-secondary text-gmgn-green font-semibold">P1</button>
                  <button className="px-2 py-1 rounded-full text-muted-foreground">P2</button>
                  <button className="px-2 py-1 rounded-full text-muted-foreground">P3</button>
                </div>
                <button className="p-2 rounded-full bg-secondary/70 text-muted-foreground hover:text-foreground transition-colors" aria-label="Filter">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <TokenList filter={activeTab} />
        </div>
      </div>
    </div>
  );
}
