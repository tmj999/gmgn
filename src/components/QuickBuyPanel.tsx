import { useState } from "react";
import { Settings, Zap } from "lucide-react";

const quickAmounts = [
  { label: "0.01 SOL", value: 0.01 },
  { label: "0.1 SOL", value: 0.1 },
  { label: "0.5 SOL", value: 0.5 },
  { label: "1 SOL", value: 1 },
];

export function QuickBuyPanel() {
  const [selectedAmount, setSelectedAmount] = useState(0.1);
  const [isAuto, setIsAuto] = useState(false);

  return (
    <div className="fixed bottom-[52px] left-0 right-0 bg-[#0a0a0a] border-t border-[#1a1a1a] z-40">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-gmgn-yellow" />
          <span className="text-[11px] font-medium text-foreground">Quick Buy</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAuto(!isAuto)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
              isAuto ? "bg-gmgn-green/20 text-gmgn-green" : "text-[#666]"
            }`}
          >
            Auto
          </button>
          <button className="p-1 rounded hover:bg-[#1a1a1a] transition-colors">
            <Settings className="w-3.5 h-3.5 text-[#666]" />
          </button>
        </div>
      </div>

      {/* Amount Buttons */}
      <div className="flex items-center px-2 pb-2 gap-1">
        {quickAmounts.map((amount) => (
          <button
            key={amount.value}
            onClick={() => setSelectedAmount(amount.value)}
            className={`flex-1 py-2 rounded text-[11px] font-medium transition-colors ${
              selectedAmount === amount.value
                ? "bg-gmgn-green text-[#000]"
                : "bg-[#1a1a1a] text-[#888] hover:bg-[#222]"
            }`}
          >
            {amount.label}
          </button>
        ))}
      </div>
    </div>
  );
}
