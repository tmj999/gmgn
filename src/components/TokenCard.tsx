import { Copy } from "lucide-react";
import { useState } from "react";
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
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const isPositive = token.priceChange >= 0;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(token.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const handleCardClick = () => {
    navigate(`/token/${token.address}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-[#111] border-b border-[#1a1a1a] px-3 py-3 cursor-pointer hover:bg-[#151515] transition-colors"
    >
      {/* Main Row */}
      <div className="flex items-start gap-2.5">
        {/* Token Logo with Progress */}
        <div className="relative flex-shrink-0">
          <img
            src={token.logo}
            alt={token.symbol}
            className="w-9 h-9 rounded-lg object-cover bg-[#1a1a1a]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${token.symbol}&background=1a1a1a&color=22c55e&size=36`;
            }}
          />
          {token.progress !== undefined && (
            <div className="absolute -bottom-0.5 left-0 right-0 h-[3px] bg-[#222] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gmgn-green rounded-full transition-all"
                style={{ width: `${token.progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Token Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground text-[13px]">{token.symbol}</span>
            <span className="text-[11px] text-[#666] truncate max-w-[100px]">{token.name}</span>
          </div>
          
          <div className="flex items-center gap-1.5 mt-0.5">
            <button
              onClick={handleCopy}
              className="flex items-center gap-0.5 text-[10px] text-[#555] hover:text-[#888] transition-colors"
            >
              <span className="font-mono">{formatAddress(token.address)}</span>
              <Copy className="w-2.5 h-2.5" />
            </button>
            <span className="text-[10px] text-[#444]">•</span>
            <span className="text-[10px] text-[#555]">{token.age}</span>
            
            {/* Badges */}
            <div className="flex items-center gap-1">
              {token.hasTwitter && (
                <svg className="w-3 h-3 text-[#1DA1F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              )}
              {token.hasWebsite && (
                <svg className="w-3 h-3 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                </svg>
              )}
              {token.isBurned && (
                <span className="text-[10px]">🔥</span>
              )}
              {token.isRenounced && (
                <span className="text-[10px] text-gmgn-green">✓R</span>
              )}
            </div>
          </div>
        </div>

        {/* Price & Change */}
        <div className="text-right flex-shrink-0">
          <div className="text-[13px] font-medium text-foreground">{token.price}</div>
          <div className={`flex items-center justify-end gap-0.5 text-[11px] ${isPositive ? "text-gmgn-green" : "text-gmgn-red"}`}>
            <span>{isPositive ? "↗" : "↘"}{Math.abs(token.priceChange).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-3 mt-2 text-[10px]">
        <div className="flex items-center gap-0.5">
          <span className="text-[#555]">MC</span>
          <span className="text-foreground">{token.marketCap}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-[#555]">Vol</span>
          <span className="text-foreground">{token.volume}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-[#555]">Holders</span>
          <span className="text-foreground">{token.holders}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-[#555]">TX</span>
          <span className="text-foreground">{token.txCount}</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-3 text-[10px]">
          <div className="flex items-center gap-0.5">
            <span className="text-[#555]">Dev</span>
            <span className={token.devHolding > 5 ? "text-gmgn-red" : "text-foreground"}>{token.devHolding}%</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-[#555]">Top10</span>
            <span className={token.top10Holding > 50 ? "text-gmgn-orange" : "text-foreground"}>{token.top10Holding}%</span>
          </div>
        </div>

        <button
          onClick={() => onBuy?.(token)}
          className="px-4 py-1 rounded bg-gmgn-green text-[#000] text-[11px] font-semibold hover:opacity-90 transition-opacity"
        >
          Buy
        </button>
      </div>
    </div>
  );
}
