import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { apiRequest } from "@/lib/apiClient";

export type TradeSide = "buy" | "sell";

type TradeDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: TradeSide;
  tokenAddress: string;
  tokenSymbol: string;
  authToken: string | null;
  solBalance: number;
  onTraded?: () => void;
};

type PositionResponse = {
  ok: true;
  tokenAddress: string;
  solBalance: number;
  positionBalance: number;
  rate: number;
};

type TradeResponse = {
  ok: true;
  tokenAddress: string;
  solBalance: number;
  positionBalance: number;
  filled: {
    side: TradeSide;
    solAmount: number;
    tokenAmount: number;
    rate: number;
  };
};

const buyPresets = [0.01, 0.1, 0.5, 1];
const sellPresets = [0.25, 0.5, 0.75, 1];

function formatNumber(n: number, maxFrac = 8) {
  if (!Number.isFinite(n)) return "0";
  return n.toLocaleString(undefined, { maximumFractionDigits: maxFrac });
}

export function TradeDrawer({
  open,
  onOpenChange,
  side,
  tokenAddress,
  tokenSymbol,
  authToken,
  solBalance,
  onTraded,
}: TradeDrawerProps) {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [positionBalance, setPositionBalance] = useState(0);
  const [rate, setRate] = useState<number | null>(null);

  const title = side === "buy" ? `Buy ${tokenSymbol}` : `Sell ${tokenSymbol}`;

  const unitLabel = side === "buy" ? "SOL" : tokenSymbol;

  const numericAmount = useMemo(() => {
    const n = Number(amount);
    return Number.isFinite(n) ? n : NaN;
  }, [amount]);

  useEffect(() => {
    if (!open) {
      setError(null);
      setLoading(false);
      setAmount("");
      return;
    }

    if (!authToken) {
      setError(null);
      setPositionBalance(0);
      setRate(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    apiRequest<PositionResponse>(
      `/api/trade/position?tokenAddress=${encodeURIComponent(tokenAddress)}`,
      { method: "GET", token: authToken }
    )
      .then((data) => {
        if (cancelled) return;
        setPositionBalance(typeof data.positionBalance === "number" ? data.positionBalance : 0);
        setRate(typeof data.rate === "number" ? data.rate : null);
      })
      .catch((e: any) => {
        if (cancelled) return;
        setError(String(e?.message || "REQUEST_FAILED"));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, authToken, tokenAddress]);

  const canSubmit = useMemo(() => {
    if (!authToken) return false;
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) return false;
    if (side === "buy") return numericAmount <= solBalance;
    return numericAmount <= positionBalance;
  }, [authToken, numericAmount, side, solBalance, positionBalance]);

  const submit = async () => {
    if (!authToken) return;
    setLoading(true);
    setError(null);

    try {
      const payload =
        side === "buy"
          ? { tokenAddress, solAmount: numericAmount }
          : { tokenAddress, tokenAmount: numericAmount };

      const data = await apiRequest<TradeResponse>(`/api/trade/${side}`, {
        method: "POST",
        token: authToken,
        json: payload,
      });

      setPositionBalance(typeof data.positionBalance === "number" ? data.positionBalance : 0);
      onTraded?.();
      onOpenChange(false);
    } catch (e: any) {
      setError(String(e?.message || "REQUEST_FAILED"));
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (value: number) => {
    if (!Number.isFinite(value)) return;
    setAmount(String(value));
  };

  const setSellPercent = (pct: number) => {
    const v = positionBalance * pct;
    setAmount(String(Number.isFinite(v) ? Math.floor(v * 1e8) / 1e8 : 0));
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="inset-x-0 bottom-0 rounded-t-2xl border border-border bg-background max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <div className="text-xs text-muted-foreground mt-1">
            Bal: {formatNumber(solBalance, 4)} SOL · Position: {formatNumber(positionBalance, 4)} {tokenSymbol}
            {rate ? ` · Rate: 1 SOL ≈ ${formatNumber(rate, 0)} ${tokenSymbol}` : ""}
          </div>
        </DrawerHeader>

        <div className="px-4 pb-4">
          {!authToken ? (
            <div className="mt-2">
              <div className="text-sm text-muted-foreground">Please log in to trade.</div>
              <button
                onClick={() => {
                  onOpenChange(false);
                  navigate("/auth");
                }}
                className="mt-3 w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
              >
                Log in
              </button>
            </div>
          ) : (
            <>
              <div className="mt-2 bg-[#111] border border-border rounded-lg px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <input
                    inputMode="decimal"
                    placeholder={`Amount (${unitLabel})`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-transparent text-base text-foreground placeholder:text-muted-foreground outline-none flex-1"
                  />
                  <span className="text-xs text-muted-foreground shrink-0">{unitLabel}</span>
                </div>
              </div>

              {side === "buy" ? (
                <div className="flex items-center gap-2 mt-3">
                  {buyPresets.map((v) => (
                    <button
                      key={v}
                      onClick={() => setPreset(v)}
                      className="flex-1 py-2.5 text-xs font-medium bg-[#111] border border-border rounded-md text-foreground hover:bg-[#1a1a1a] transition-colors"
                    >
                      {v} SOL
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-3">
                  {sellPresets.map((pct) => (
                    <button
                      key={pct}
                      onClick={() => setSellPercent(pct)}
                      className="flex-1 py-2.5 text-xs font-medium bg-[#111] border border-border rounded-md text-foreground hover:bg-[#1a1a1a] transition-colors"
                      disabled={!positionBalance}
                    >
                      {Math.round(pct * 100)}%
                    </button>
                  ))}
                </div>
              )}

              {error && <div className="mt-3 text-xs text-gmgn-red">{error}</div>}

              <button
                onClick={submit}
                disabled={!canSubmit || loading}
                className="mt-4 w-full py-3 rounded-lg bg-[#2a3a2a] text-gmgn-green font-semibold disabled:opacity-50"
              >
                {loading ? "Processing..." : side === "buy" ? "Confirm Buy" : "Confirm Sell"}
              </button>

              <div className="mt-3 text-[10px] text-muted-foreground">
                Token: <span className="font-mono">{tokenAddress}</span>
              </div>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
