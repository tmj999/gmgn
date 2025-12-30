import { useEffect, useState } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";

interface KlineData {
  timestamp: number;
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface KlineChartProps {
  tokenAddress: string;
}

const intervals = ["1m", "5m", "15m", "1h", "4h", "1d"];

export function KlineChart({ tokenAddress }: KlineChartProps) {
  const [data, setData] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState("1h");

  useEffect(() => {
    fetchKlineData();
  }, [tokenAddress, interval]);

  const fetchKlineData = async () => {
    setLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke("kline-data", {
        body: null,
        headers: {},
      });

      // Use query params approach
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/kline-data?address=${tokenAddress}&interval=${interval}&limit=50`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch kline data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Transform data for candlestick visualization
  const chartData = data.map((item, index) => {
    const isGreen = item.close >= item.open;
    return {
      ...item,
      index,
      displayTime: new Date(item.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      // For bar chart representation of candlestick
      bodyBottom: Math.min(item.open, item.close),
      bodyHeight: Math.abs(item.close - item.open),
      wickLow: item.low,
      wickHigh: item.high,
      isGreen,
    };
  });

  const minPrice = Math.min(...data.map((d) => d.low)) * 0.995;
  const maxPrice = Math.max(...data.map((d) => d.high)) * 1.005;

  const CustomCandlestick = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;

    const { open, close, high, low, isGreen } = payload;
    const color = isGreen ? "#22c55e" : "#ef4444";
    
    const priceRange = maxPrice - minPrice;
    const chartHeight = 200;
    
    const bodyTop = chartHeight - ((Math.max(open, close) - minPrice) / priceRange) * chartHeight;
    const bodyBottom = chartHeight - ((Math.min(open, close) - minPrice) / priceRange) * chartHeight;
    const wickTop = chartHeight - ((high - minPrice) / priceRange) * chartHeight;
    const wickBottom = chartHeight - ((low - minPrice) / priceRange) * chartHeight;
    
    const candleWidth = Math.max(width * 0.8, 2);
    const candleX = x + (width - candleWidth) / 2;

    return (
      <g>
        {/* Wick */}
        <line
          x1={x + width / 2}
          y1={wickTop}
          x2={x + width / 2}
          y2={wickBottom}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body */}
        <rect
          x={candleX}
          y={bodyTop}
          width={candleWidth}
          height={Math.max(bodyBottom - bodyTop, 1)}
          fill={color}
          stroke={color}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-2 text-xs">
          <div className="text-muted-foreground">{data.displayTime}</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
            <span className="text-muted-foreground">O:</span>
            <span className="text-foreground">${data.open.toFixed(8)}</span>
            <span className="text-muted-foreground">H:</span>
            <span className="text-foreground">${data.high.toFixed(8)}</span>
            <span className="text-muted-foreground">L:</span>
            <span className="text-foreground">${data.low.toFixed(8)}</span>
            <span className="text-muted-foreground">C:</span>
            <span className={data.isGreen ? "text-green-500" : "text-red-500"}>
              ${data.close.toFixed(8)}
            </span>
            <span className="text-muted-foreground">Vol:</span>
            <span className="text-foreground">{data.volume.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-lg">
      {/* Interval selector */}
      <div className="flex gap-1 p-2 border-b border-border overflow-x-auto">
        {intervals.map((int) => (
          <button
            key={int}
            onClick={() => setInterval(int)}
            className={`px-3 py-1 text-xs rounded ${
              interval === int
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {int}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[200px] p-2">
        {loading ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <XAxis
                dataKey="displayTime"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[minPrice, maxPrice]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#666", fontSize: 10 }}
                tickFormatter={(value) => `$${value.toFixed(6)}`}
                orientation="right"
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="bodyHeight"
                shape={<CustomCandlestick />}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Volume chart */}
      <div className="h-[60px] px-2 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
            <XAxis dataKey="displayTime" hide />
            <YAxis hide />
            <Bar dataKey="volume" isAnimationActive={false}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.isGreen ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)"}
                />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
