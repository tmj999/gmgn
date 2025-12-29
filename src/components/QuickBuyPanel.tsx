import { useState } from "react";
import { Settings, Zap } from "lucide-react";

const quickAmounts = [
  { label: "0.01", value: 0.01 },
  { label: "0.1", value: 0.1 },
  { label: "0.5", value: 0.5 },
  { label: "1", value: 1 },
];

export function QuickBuyPanel() {
  const [selectedAmount, setSelectedAmount] = useState(0.1);
  const [isAuto, setIsAuto] = useState(false);

  return (
    <div className="bg-card border-t border-border px-3 py-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-gmgn-yellow" />
          <span className="text-xs font-medium text-foreground">Quick Buy</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAuto(!isAuto)}
            className={`px-2 py-1 rounded text-2xs font-medium transition-colors ${
              isAuto ? "bg-gmgn-green/20 text-gmgn-green" : "bg-secondary text-muted-foreground"
            }`}
          >
            Auto
          </button>
          <button className="p-1 rounded hover:bg-secondary transition-colors">
            <Settings className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {quickAmounts.map((amount) => (
          <button
            key={amount.value}
            onClick={() => setSelectedAmount(amount.value)}
            className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${
              selectedAmount === amount.value
                ? "bg-gmgn-green text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {amount.label} SOL
          </button>
        ))}
      </div>
    </div>
  );
}
