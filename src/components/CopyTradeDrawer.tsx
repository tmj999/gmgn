import { useState } from "react";
import { X, Wallet, HelpCircle, ChevronDown, Pencil, Zap, RotateCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";

interface CopyTradeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  traderAddress: string;
  pnl7d: string;
  winRate: string;
  lastTime: string;
}

const buyModes = ["Max Buy Amount", "Fixed Buy", "Fixed Ratio"];
const amountPresets = [10, 25, 50, 100];
const sellMethods = ["Copy Sell", "Not Sell", "TP & SL", "Adv Strategy"];

export function CopyTradeDrawer({
  open,
  onOpenChange,
  traderAddress,
  pnl7d,
  winRate,
  lastTime,
}: CopyTradeDrawerProps) {
  const [activeBuyMode, setActiveBuyMode] = useState("Max Buy Amount");
  const [amount, setAmount] = useState("");
  const [activeSellMethod, setActiveSellMethod] = useState("Copy Sell");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const handleConfirm = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-[420px] p-0 border-l border-border bg-background [&>button]:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="text-base font-semibold text-foreground">CopyTrade</span>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Wallet className="w-3.5 h-3.5" />
                <span>W1</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="text-foreground">≡</span>
                <span>0</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              <div className="w-6 h-6 rounded-full bg-gmgn-green/20 flex items-center justify-center">
                <Zap className="w-3 h-3 text-gmgn-green" />
              </div>
              <button className="p-1 text-muted-foreground hover:text-foreground">
                <HelpCircle className="w-4 h-4" />
              </button>
              <button className="p-1 text-muted-foreground hover:text-foreground">
                <Wallet className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onOpenChange(false)}
                className="p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* Copy From */}
            <div className="bg-[#111] border border-border rounded-lg p-3">
              <div className="text-xs text-muted-foreground mb-2">Copy From</div>
              <div className="bg-[#1a1a1a] rounded px-3 py-2">
                <span className="text-sm font-mono text-foreground truncate block">
                  {traderAddress}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 text-xs">
                <div>
                  <span className="text-gmgn-green font-medium">{pnl7d}</span>
                  <div className="text-muted-foreground mt-0.5">7D PnL</div>
                </div>
                <div className="text-center">
                  <span className="text-foreground font-medium">{winRate}</span>
                  <div className="text-muted-foreground mt-0.5">7D WinRate</div>
                </div>
                <div className="text-right">
                  <span className="text-foreground font-medium">{lastTime}</span>
                  <div className="text-muted-foreground mt-0.5">Last Time</div>
                </div>
              </div>
            </div>

            {/* Buy Mode Tabs */}
            <div className="flex items-center bg-[#111] rounded-lg p-1 mt-4">
              {buyModes.map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveBuyMode(mode)}
                  className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
                    activeBuyMode === mode
                      ? "bg-[#1a1a1a] text-gmgn-green"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Amount Input */}
            <div className="mt-4">
              <div className="flex items-center justify-between bg-[#111] border border-border rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1"
                />
                <span className="text-xs text-muted-foreground">SOL</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                {amountPresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className="flex-1 py-2.5 text-xs font-medium bg-[#111] border border-border rounded-md text-foreground hover:bg-[#1a1a1a] transition-colors"
                  >
                    {preset}
                  </button>
                ))}
                <button className="w-12 py-2.5 flex items-center justify-center bg-[#111] border border-border rounded-md text-muted-foreground hover:bg-[#1a1a1a] transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center justify-between mt-2 text-xs">
                <span className="text-muted-foreground">≈$0</span>
                <span className="text-muted-foreground">Bal ≡ 0</span>
              </div>
            </div>

            {/* Sell Method */}
            <div className="mt-5">
              <div className="flex items-center gap-1 text-sm text-foreground mb-2">
                <span>Sell Method</span>
                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-2">
                {sellMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => setActiveSellMethod(method)}
                    className={`flex-1 py-2 text-xs font-medium rounded-md border transition-colors ${
                      activeSellMethod === method
                        ? "bg-[#1a1a1a] border-border text-foreground"
                        : "bg-transparent border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="mt-5">
              <button
                onClick={() => setAdvancedOpen(!advancedOpen)}
                className="flex items-center justify-between w-full py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">Advanced Settings</span>
                  <span className="w-5 h-5 flex items-center justify-center text-[10px] font-medium bg-gmgn-green/20 text-gmgn-green rounded">
                    1
                  </span>
                  <div className="flex items-center gap-1 text-muted-foreground ml-2">
                    <RotateCcw className="w-3 h-3" />
                    <span className="text-xs">Clear</span>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                    advancedOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {advancedOpen && (
                <div className="mt-2 p-3 bg-[#111] rounded-lg">
                  <div className="text-xs text-muted-foreground">
                    Advanced trading settings will appear here
                  </div>
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="mt-4 py-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Presets</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>Auto</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>⊞</span>
                    <span>0.0004</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>☰</span>
                    <span>0.001</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>◇</span>
                    <span>Red.</span>
                  </div>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="px-4 py-4 border-t border-border">
            <button
              onClick={handleConfirm}
              className="w-full py-3.5 bg-[#2a3a2a] text-gmgn-green font-semibold rounded-lg hover:bg-[#3a4a3a] transition-colors"
            >
              Confirm
            </button>
            <p className="text-[10px] text-muted-foreground text-center mt-3">
              Note: Ensure your account has enough balance for auto trading to run smoothly.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
