import {
  Camera,
  CheckCircle2,
  Crown,
  Eye,
  FileText,
  Globe,
  Layers,
  Pencil,
  Search,
  Sprout,
  Trophy,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface TokenData {
  id: string;
  symbol: string;
  name: string;
  logo: string;
  address: string;
  age: string;
  price: string;
  priceChange: number;
  marketCap: string;
  volume: string;
  holders: number;
  txCount: number;
  devHolding: number;
  top10Holding: number;
  isVerified?: boolean;
  hasTwitter?: boolean;
  hasWebsite?: boolean;
  isBurned?: boolean;
  isRenounced?: boolean;
  progress?: number;
}

interface TokenCardProps {
  token: TokenData;
  onBuy?: (token: TokenData) => void;
}

export function TokenCard({ token, onBuy }: TokenCardProps) {
  const navigate = useNavigate();
  const isPositive = token.priceChange >= 0;

  const twitterHandle = `@${token.symbol.toLowerCase().replace(/\s+/g, "").slice(0, 12)}`;
  const avatarBorderColor = token.isVerified ? "border-[hsl(var(--gmgn-orange))]" : "border-border/60";
  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  const handleCardClick = () => {
    navigate(`/token/${token.address}`);
  };

  const showStatusCheck = Boolean(token.isVerified || token.hasWebsite);

  return (
    <div
      onClick={handleCardClick}
      className="bg-[#111] px-3 py-3 cursor-pointer hover:bg-[#151515] transition-colors overflow-hidden"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex flex-col items-start gap-1 flex-shrink-0">
          <div className="relative">
            <div
              className={`rounded-xl border-2 ${avatarBorderColor} p-[2px] bg-gradient-to-b from-[#2a2a2a] to-[#151515]`}
            >
              <img
                src={token.logo}
                alt={token.symbol}
                className="w-[56px] h-[56px] rounded-[10px] object-cover bg-[#1a1a1a]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${token.symbol}&background=1a1a1a&color=22c55e&size=56`;
                }}
              />
            </div>

            {/* Top badge */}
            <div className="absolute -top-2 left-2 rounded-full border border-border/60 bg-background/80 px-1.5 py-0.5 text-[11px] leading-none text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                {Math.min(99, token.txCount)}
                <Camera className="w-3 h-3" />
              </span>
            </div>

            {/* Status */}
            {showStatusCheck && (
              <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-[2px]">
                <CheckCircle2 className="w-5 h-5 text-gmgn-green" />
              </div>
            )}

            {token.progress !== undefined && (
              <div className="absolute bottom-1 left-1 right-1 h-[3px] bg-[#1f1f1f] rounded-full overflow-hidden">
                <div className="h-full bg-gmgn-green" style={{ width: `${token.progress}%` }} />
              </div>
            )}
          </div>

          {/* Address under avatar */}
          <div className="text-[12px] text-muted-foreground font-mono leading-none pl-1">
            {formatAddress(token.address)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Row 1 */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[14px] leading-5 font-semibold text-foreground truncate">{token.symbol}</span>
                <span className="text-[12px] leading-5 text-muted-foreground truncate">{token.name}</span>
                <Pencil className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
            </div>

            <div className="flex items-baseline gap-3 text-[13px] flex-shrink-0">
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">V</span>
                <span className="text-gmgn-green font-semibold">{token.volume}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted-foreground">MC</span>
                <span className="text-gmgn-yellow font-semibold">{token.marketCap}</span>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex items-center justify-between gap-2 mt-0.5 text-[13px]">
            <div className="flex items-center gap-3 min-w-0 overflow-hidden">
              <div className="flex flex-col leading-none flex-shrink-0">
                <span className="text-gmgn-green text-[12px] font-semibold leading-none">{token.age}</span>
              </div>

              <div className="flex items-center gap-2 min-w-0 overflow-hidden whitespace-nowrap text-[12px] text-muted-foreground">
                <Sprout className="w-4 h-4 text-gmgn-green flex-shrink-0" />
                <FileText className="w-4 h-4 flex-shrink-0" />
                <Search className="w-4 h-4 flex-shrink-0" />
                {token.hasWebsite && <Globe className="w-4 h-4 flex-shrink-0" />}
                <Trophy className="w-4 h-4 flex-shrink-0" />
                <span className="text-foreground font-semibold flex-shrink-0">0</span>
                <Crown className="w-4 h-4 text-gmgn-yellow flex-shrink-0" />
                <span className="text-foreground font-semibold flex-shrink-0">
                  {token.id === "1" ? "842/869" : `${token.holders}/${token.holders + 27}`}
                </span>
                <Users className="w-4 h-4 flex-shrink-0" />
                <span className="text-foreground font-semibold flex-shrink-0">{token.holders}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-foreground font-semibold">{token.price}</span>
                <span className={`text-[13px] font-semibold ${isPositive ? "text-gmgn-green" : "text-gmgn-red"}`}>
                  {isPositive ? "+" : "-"}
                  {Math.abs(token.priceChange).toFixed(1)}%
                </span>
              </div>

              <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                <span>
                  TX <span className="text-foreground font-semibold">{token.txCount}</span>
                </span>
                <div className="w-10 h-[3px] rounded-full bg-secondary/70 overflow-hidden">
                  <div
                    className={isPositive ? "h-full bg-gmgn-green" : "h-full bg-gmgn-red"}
                    style={{ width: `${Math.max(12, Math.min(100, token.progress ?? 35))}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Twitter handle (own line, smaller) */}
          <div className="mt-0.5 text-[12px] leading-none text-gmgn-blue font-medium truncate">
            {twitterHandle}
          </div>

          {/* Chips */}
          <div className="flex items-center gap-2 mt-2 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border/60 bg-[#101010] text-[12px] text-gmgn-green font-semibold flex-shrink-0">
              <UserPlus className="w-4 h-4" />
              <span>{Math.max(0, Math.round(token.priceChange))}%</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border/60 bg-[#101010] text-[12px] text-gmgn-blue font-semibold flex-shrink-0">
              <FileText className="w-4 h-4" />
              <span>DS {Math.max(1, token.holders)}d</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border/60 bg-[#101010] text-[12px] text-gmgn-green font-semibold flex-shrink-0">
              <Sprout className="w-4 h-4" />
              <span>{token.devHolding}%</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border/60 bg-[#101010] text-[12px] text-gmgn-green font-semibold flex-shrink-0">
              <Layers className="w-4 h-4" />
              <span>{token.top10Holding}%</span>
            </div>

            {/* extra 0% chips to match screenshot density */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border/60 bg-[#101010] text-[12px] text-gmgn-green font-semibold flex-shrink-0">
              <Layers className="w-4 h-4" />
              <span>0%</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border/60 bg-[#101010] text-[12px] text-gmgn-green font-semibold flex-shrink-0">
              <Users className="w-4 h-4" />
              <span>0%</span>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border/60 bg-[#101010] text-[12px] text-gmgn-green font-semibold flex-shrink-0">
              <Sprout className="w-4 h-4" />
              <span>0%</span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border/60 bg-[#101010] text-[12px] text-gmgn-red font-semibold flex-shrink-0">
              <Eye className="w-4 h-4" />
              <span>{Math.min(99, token.txCount)}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onBuy?.(token);
              }}
              className="w-9 h-9 rounded-lg border border-border/60 bg-[#101010] text-gmgn-green font-bold flex-shrink-0 ml-auto"
              aria-label="Quick action"
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
