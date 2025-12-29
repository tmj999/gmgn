import { TokenCard, TokenData } from "./TokenCard";

const mockTokens: TokenData[] = [
  {
    id: "1",
    symbol: "WHALESPERM",
    name: "The Sperm Whale",
    logo: "https://ui-avatars.com/api/?name=WS&background=1a5f2a&color=fff&size=80",
    address: "CwZ4...pump",
    age: "5s",
    price: "$0.00031",
    priceChange: 0.2,
    marketCap: "$3.5K",
    volume: "$7.6",
    holders: 12,
    txCount: 2,
    devHolding: 0,
    top10Holding: 34,
    hasTwitter: false,
    hasWebsite: false,
    isBurned: true,
    progress: 2,
  },
  {
    id: "2",
    symbol: "OPENAI",
    name: "Open AI Agent",
    logo: "https://ui-avatars.com/api/?name=OA&background=10a37f&color=fff&size=80",
    address: "5K5S...1K9Z",
    age: "6m",
    price: "$0.000437",
    priceChange: 75.0,
    marketCap: "$44.9K",
    volume: "$11.2K",
    holders: 259,
    txCount: 7,
    devHolding: 0,
    top10Holding: 28,
    isVerified: true,
    hasTwitter: true,
    hasWebsite: true,
    isRenounced: true,
    progress: 12,
  },
  {
    id: "3",
    symbol: "10CentWhale",
    name: "10 Cent Whale",
    logo: "https://ui-avatars.com/api/?name=10&background=2563eb&color=fff&size=80",
    address: "Ckv2...eF4M",
    age: "6s",
    price: "$0.000017",
    priceChange: 15.0,
    marketCap: "$637.8K",
    volume: "$17.4K",
    holders: 171,
    txCount: 5,
    devHolding: 0,
    top10Holding: 45,
    hasTwitter: true,
    isBurned: true,
    progress: 8,
  },
  {
    id: "4",
    symbol: "DIWHALE",
    name: "THE DIAMOND WHALE",
    logo: "https://ui-avatars.com/api/?name=DW&background=8b5cf6&color=fff&size=80",
    address: "yuEm...pump",
    age: "9s",
    price: "$0.00093",
    priceChange: 2.0,
    marketCap: "$42.7K",
    volume: "$47.4K",
    holders: 960,
    txCount: 31,
    devHolding: 1,
    top10Holding: 28,
    hasTwitter: true,
    hasWebsite: true,
    progress: 15,
  },
  {
    id: "5",
    symbol: "GW1905",
    name: "Miller Darwin",
    logo: "https://ui-avatars.com/api/?name=GW&background=f59e0b&color=fff&size=80",
    address: "DoWo...7899",
    age: "12s",
    price: "$0.00065",
    priceChange: -5.0,
    marketCap: "$39.1K",
    volume: "$64.9K",
    holders: 732,
    txCount: 1,
    devHolding: 13,
    top10Holding: 52,
    hasTwitter: true,
    progress: 6,
  },
  {
    id: "6",
    symbol: "PEPE WH",
    name: "Pepe Whale",
    logo: "https://ui-avatars.com/api/?name=PW&background=22c55e&color=fff&size=80",
    address: "F7hw...7898",
    age: "17s",
    price: "$0.000032",
    priceChange: -0.4,
    marketCap: "$38.4K",
    volume: "$10.5K",
    holders: 89,
    txCount: 2,
    devHolding: 0.4,
    top10Holding: 69,
    isBurned: true,
    progress: 3,
  },
];

interface TokenListProps {
  filter?: string;
}

export function TokenList({ filter }: TokenListProps) {
  const handleBuy = (token: TokenData) => {
    console.log("Buy token:", token.symbol);
  };

  return (
    <div className="flex flex-col pb-16">
      {mockTokens.map((token) => (
        <TokenCard key={token.id} token={token} onBuy={handleBuy} />
      ))}
    </div>
  );
}
