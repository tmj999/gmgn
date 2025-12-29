import { ExternalLink, Twitter, Globe, Copy, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

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
  const [copied, setCopied] = useState(false);
  const isPositive = token.priceChange >= 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="token-card-gradient border border-border rounded-lg p-3 animate-slide-up">
      {/* Header Row */}
      <div className="flex items-start gap-2.5">
        {/* Token Logo */}
        <div className="relative flex-shrink-0">
          <img
            src={token.logo}
            alt={token.symbol}
            className="w-10 h-10 rounded-lg object-cover bg-secondary"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${token.symbol}&background=1a1a1a&color=22c55e&size=40`;
            }}
          />
          {token.progress !== undefined && (
            <div className="absolute -bottom-1 left-0 right-0 h-1 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gmgn-green transition-all"
                style={{ width: `${token.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Token Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground text-sm truncate">{token.symbol}</span>
            {token.isVerified && (
              <span className="text-gmgn-blue text-xs">✓</span>
            )}
            <span className="text-2xs text-muted-foreground truncate">{token.name}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-0.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-2xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="font-mono">{formatAddress(token.address)}</span>
              <Copy className="w-2.5 h-2.5" />
            </button>
            <span className="text-2xs text-muted-foreground">•</span>
            <span className="text-2xs text-muted-foreground">{token.age}</span>
            
            {/* Badges */}
            <div className="flex items-center gap-1">
              {token.hasTwitter && (
                <Twitter className="w-3 h-3 text-gmgn-blue" />
              )}
              {token.hasWebsite && (
                <Globe className="w-3 h-3 text-muted-foreground" />
              )}
              {token.isBurned && (
                <span className="text-2xs px-1 py-0.5 rounded bg-gmgn-orange/20 text-gmgn-orange">🔥</span>
              )}
              {token.isRenounced && (
                <span className="text-2xs px-1 py-0.5 rounded bg-gmgn-green/20 text-gmgn-green">✓R</span>
              )}
            </div>
          </div>
        </div>

        {/* Price & Change */}
        <div className="text-right flex-shrink-0">
          <div className="text-sm font-semibold text-foreground">{token.price}</div>
          <div className={`flex items-center justify-end gap-0.5 text-xs ${isPositive ? "text-gmgn-green" : "text-gmgn-red"}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{Math.abs(token.priceChange).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 mt-2.5 text-2xs">
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">MC</span>
          <span className="text-foreground font-medium">{token.marketCap}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Vol</span>
          <span className="text-foreground font-medium">{token.volume}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Holders</span>
          <span className="text-foreground font-medium">{token.holders}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">TX</span>
          <span className="text-foreground font-medium">{token.txCount}</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-border/50">
        <div className="flex items-center gap-3 text-2xs">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Dev</span>
            <span className={token.devHolding > 5 ? "text-gmgn-red" : "text-foreground"}>{token.devHolding}%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Top10</span>
            <span className={token.top10Holding > 50 ? "text-gmgn-orange" : "text-foreground"}>{token.top10Holding}%</span>
          </div>
        </div>

        <button
          onClick={() => onBuy?.(token)}
          className="px-4 py-1.5 rounded-md bg-gmgn-green text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
        >
          Buy
        </button>
      </div>
    </div>
  );
}
