import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Generate mock K-line data
function generateMockKlineData(tokenAddress: string, interval: string = '1h', limit: number = 100) {
  const now = Date.now()
  const intervalMs = {
    '1m': 60 * 1000,
    '5m': 5 * 60 * 1000,
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '4h': 4 * 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
  }[interval] || 60 * 60 * 1000

  const data = []
  let basePrice = 0.00093 + Math.random() * 0.0001
  
  for (let i = limit - 1; i >= 0; i--) {
    const timestamp = now - i * intervalMs
    const volatility = 0.05 + Math.random() * 0.1
    
    const open = basePrice
    const change = (Math.random() - 0.48) * volatility * basePrice
    const close = Math.max(0.000001, open + change)
    const high = Math.max(open, close) * (1 + Math.random() * 0.03)
    const low = Math.min(open, close) * (1 - Math.random() * 0.03)
    const volume = Math.floor(1000 + Math.random() * 50000)
    
    data.push({
      timestamp,
      time: new Date(timestamp).toISOString(),
      open: Number(open.toFixed(8)),
      high: Number(high.toFixed(8)),
      low: Number(low.toFixed(8)),
      close: Number(close.toFixed(8)),
      volume,
    })
    
    basePrice = close
  }
  
  return data
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const tokenAddress = url.searchParams.get('address') || 'unknown'
    const interval = url.searchParams.get('interval') || '1h'
    const limit = parseInt(url.searchParams.get('limit') || '100')

    const klineData = generateMockKlineData(tokenAddress, interval, Math.min(limit, 500))

    return new Response(
      JSON.stringify({
        success: true,
        data: klineData,
        tokenAddress,
        interval,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
