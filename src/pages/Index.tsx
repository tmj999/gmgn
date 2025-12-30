import { useState } from "react";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { TrenchesView } from "@/components/TrenchesView";
import { TrendingView } from "@/components/TrendingView";
import { CopyTradeView } from "@/components/CopyTradeView";
import { MonitorView } from "@/components/MonitorView";
import { TrackView } from "@/components/TrackView";
import { PortfolioView } from "@/components/PortfolioView";

const Index = () => {
  const [activeTab, setActiveTab] = useState("trenches");

  const renderView = () => {
    switch (activeTab) {
      case "trenches":
        return <TrenchesView />;
      case "trending":
        return <TrendingView />;
      case "copytrade":
        return <CopyTradeView />;
      case "monitor":
        return <MonitorView />;
      case "track":
        return <TrackView />;
      case "portfolio":
        return <PortfolioView />;
      default:
        return <TrenchesView />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderView()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
