import { useState } from "react";
import { TabBar } from "./TabBar";
import { TokenList } from "./TokenList";
import { QuickBuyPanel } from "./QuickBuyPanel";

const tabs = [
  { id: "new", label: "New", count: 156 },
  { id: "almost", label: "Almost bo", count: 23 },
  { id: "migrated", label: "Migrated", count: 89 },
];

export function TrenchesView() {
  const [activeTab, setActiveTab] = useState("new");

  return (
    <div className="flex flex-col h-full">
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <TokenList filter={activeTab} />
      </div>
      <QuickBuyPanel />
    </div>
  );
}
