import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { TrenchesView } from "@/components/TrenchesView";
import { TrendingView } from "@/components/TrendingView";
import { CopyTradeView } from "@/components/CopyTradeView";
import { MonitorView } from "@/components/MonitorView";
import { TrackView } from "@/components/TrackView";
import { PortfolioView } from "@/components/PortfolioView";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const activeTab = useMemo(() => {
    const path = location.pathname.replace(/\/$/, "");
    switch (path) {
      case "/trenches":
        return "trenches";
      case "/trending":
        return "trending";
      case "/copytrade":
        return "copytrade";
      case "/monitor":
        return "monitor";
      case "/track":
        return "track";
      case "/portfolio":
        return "portfolio";
      default:
        return "trenches";
    }
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case "trenches":
        navigate("/trenches");
        break;
      case "trending":
        navigate("/trending");
        break;
      case "copytrade":
        navigate("/copytrade");
        break;
      case "monitor":
        navigate("/monitor");
        break;
      case "track":
        navigate("/track");
        break;
      case "portfolio":
        navigate("/portfolio");
        break;
      default:
        navigate("/trenches");
        break;
    }
  };

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
      <main className="mx-auto w-full max-w-[768px] flex-1 flex flex-col overflow-hidden">
        {renderView()}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Index;
