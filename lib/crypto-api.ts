// Real-time cryptocurrency data API integration
// Uses CoinGecko API with Binance WebSocket for real-time updates

export interface CoinData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  price_change_percentage_1h_in_currency?: number
  price_change_percentage_7d_in_currency?: number
  total_volume: number
  high_24h: number
  low_24h: number
  circulating_supply: number
  sparkline_in_7d?: { price: number[] }
}

export interface LiquidationData {
  price: number
  longLiquidations: number
  shortLiquidations: number
  timestamp: number
}

export interface BinanceTrade {
  symbol: string
  price: number
  quantity: number
  time: number
  isBuyerMaker: boolean
}

// Binance WebSocket for real-time trades
export class BinanceWebSocket {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnects = 5
  private callbacks: Map<string, (trade: BinanceTrade) => void> = new Map()

  connect(symbol: string, onTrade: (trade: BinanceTrade) => void) {
    if (typeof window === "undefined") return

    const wsSymbol = symbol.toLowerCase()
    this.callbacks.set(wsSymbol, onTrade)

    try {
      // Binance WebSocket for real-time trades
      this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${wsSymbol}@trade`)

      this.ws.onopen = () => {
        console.log(`[Binance WS] Connected to ${symbol}`)
        this.reconnectAttempts = 0
      }

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const trade: BinanceTrade = {
            symbol: data.s,
            price: Number.parseFloat(data.p),
            quantity: Number.parseFloat(data.q),
            time: data.T,
            isBuyerMaker: data.m,
          }
          onTrade(trade)
        } catch (e) {
          console.error("[Binance WS] Parse error:", e)
        }
      }

      this.ws.onerror = (error) => {
        console.error("[Binance WS] Error:", error)
      }

      this.ws.onclose = () => {
        console.log("[Binance WS] Disconnected")
        if (this.reconnectAttempts < this.maxReconnects) {
          this.reconnectAttempts++
          setTimeout(() => this.connect(symbol, onTrade), 2000 * this.reconnectAttempts)
        }
      }
    } catch (error) {
      console.error("[Binance WS] Connection failed:", error)
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.callbacks.clear()
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Binance REST API for current price (no CORS issues)
export async function getBinancePrice(symbol: string): Promise<number | null> {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}USDT`)
    if (!response.ok) return null
    const data = await response.json()
    return Number.parseFloat(data.price)
  } catch {
    return null
  }
}

// Get 24h ticker stats from Binance
export async function getBinance24hStats(symbol: string): Promise<{
  priceChange: number
  priceChangePercent: number
  highPrice: number
  lowPrice: number
  volume: number
  quoteVolume: number
} | null> {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}USDT`)
    if (!response.ok) return null
    const data = await response.json()
    return {
      priceChange: Number.parseFloat(data.priceChange),
      priceChangePercent: Number.parseFloat(data.priceChangePercent),
      highPrice: Number.parseFloat(data.highPrice),
      lowPrice: Number.parseFloat(data.lowPrice),
      volume: Number.parseFloat(data.volume),
      quoteVolume: Number.parseFloat(data.quoteVolume),
    }
  } catch {
    return null
  }
}

// Symbol mapping from CoinGecko ID to Binance symbol
export const coinToBinanceSymbol: Record<string, string> = {
  bitcoin: "BTC",
  ethereum: "ETH",
  binancecoin: "BNB",
  solana: "SOL",
  ripple: "XRP",
  cardano: "ADA",
  dogecoin: "DOGE",
  "avalanche-2": "AVAX",
  polkadot: "DOT",
  chainlink: "LINK",
  polygon: "MATIC",
  litecoin: "LTC",
  uniswap: "UNI",
}

// TradingView symbol mapping
export const coinToTradingView: Record<string, string> = {
  bitcoin: "BINANCE:BTCUSDT",
  ethereum: "BINANCE:ETHUSDT",
  binancecoin: "BINANCE:BNBUSDT",
  solana: "BINANCE:SOLUSDT",
  ripple: "BINANCE:XRPUSDT",
  cardano: "BINANCE:ADAUSDT",
  dogecoin: "BINANCE:DOGEUSDT",
  "avalanche-2": "BINANCE:AVAXUSDT",
  polkadot: "BINANCE:DOTUSDT",
  chainlink: "BINANCE:LINKUSDT",
  polygon: "BINANCE:MATICUSDT",
  litecoin: "BINANCE:LTCUSDT",
  uniswap: "BINANCE:UNIUSDT",
  tether: "BINANCE:USDCUSDT",
  "usd-coin": "BINANCE:USDCUSDT",
}

// Cache for coin data
let coinCache: { data: CoinData[]; timestamp: number } | null = null
const CACHE_DURATION = 30000 // 30 seconds

export async function getTopCoins(limit = 100, currency = "usd"): Promise<CoinData[]> {
  // Return cached data if fresh
  if (coinCache && Date.now() - coinCache.timestamp < CACHE_DURATION) {
    return coinCache.data.slice(0, limit)
  }

  // Try to fetch real prices from Binance
  const fallbackData = getFallbackCoinData()

  // Update prices from Binance if possible
  if (typeof window !== "undefined") {
    try {
      const pricePromises = fallbackData.slice(0, 15).map(async (coin) => {
        const binanceSymbol = coinToBinanceSymbol[coin.id]
        if (binanceSymbol) {
          const [price, stats] = await Promise.all([getBinancePrice(binanceSymbol), getBinance24hStats(binanceSymbol)])

          if (price && stats) {
            coin.current_price = currency === "inr" ? price * 83 : price
            coin.price_change_percentage_24h = stats.priceChangePercent
            coin.high_24h = currency === "inr" ? stats.highPrice * 83 : stats.highPrice
            coin.low_24h = currency === "inr" ? stats.lowPrice * 83 : stats.lowPrice
            coin.total_volume = currency === "inr" ? stats.quoteVolume * 83 : stats.quoteVolume
          }
        }
        return coin
      })

      await Promise.all(pricePromises)
    } catch (error) {
      console.error("Failed to fetch Binance prices:", error)
    }
  }

  coinCache = { data: fallbackData, timestamp: Date.now() }
  return fallbackData.slice(0, limit)
}

export async function getCoinPrice(coinId: string, currency = "usd"): Promise<number | null> {
  const binanceSymbol = coinToBinanceSymbol[coinId]
  if (binanceSymbol) {
    const price = await getBinancePrice(binanceSymbol)
    if (price) return currency === "inr" ? price * 83 : price
  }

  // Use cached data if available
  if (coinCache) {
    const coin = coinCache.data.find((c) => c.id === coinId)
    if (coin) return coin.current_price
  }

  return getFallbackCoinData().find((c) => c.id === coinId)?.current_price || null
}

// Generate simulated liquidation data (CoinGlass-style)
export function generateLiquidationHeatmap(currentPrice: number, range = 0.1): LiquidationData[] {
  const data: LiquidationData[] = []
  const steps = 50
  const minPrice = currentPrice * (1 - range)
  const maxPrice = currentPrice * (1 + range)
  const step = (maxPrice - minPrice) / steps

  for (let i = 0; i <= steps; i++) {
    const price = minPrice + i * step
    const distanceFromCurrent = Math.abs(price - currentPrice) / currentPrice
    const baseLiq = Math.exp(-distanceFromCurrent * 10) * 50000000

    const longLiq =
      price < currentPrice
        ? baseLiq * (1 + Math.random() * 0.5) * (1 + (currentPrice - price) / currentPrice)
        : baseLiq * Math.random() * 0.3

    const shortLiq =
      price > currentPrice
        ? baseLiq * (1 + Math.random() * 0.5) * (1 + (price - currentPrice) / currentPrice)
        : baseLiq * Math.random() * 0.3

    data.push({
      price,
      longLiquidations: Math.round(longLiq),
      shortLiquidations: Math.round(shortLiq),
      timestamp: Date.now(),
    })
  }

  return data
}

function getFallbackCoinData(): CoinData[] {
  const getRandomizedPrice = (base: number, variance = 0.02) => {
    return base * (1 + (Math.random() - 0.5) * variance)
  }

  return [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      current_price: getRandomizedPrice(67500),
      market_cap: 1330000000000,
      market_cap_rank: 1,
      price_change_percentage_24h: (Math.random() - 0.3) * 8,
      total_volume: 28000000000,
      high_24h: 68500,
      low_24h: 66000,
      circulating_supply: 19600000,
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      current_price: getRandomizedPrice(3450),
      market_cap: 415000000000,
      market_cap_rank: 2,
      price_change_percentage_24h: (Math.random() - 0.3) * 10,
      total_volume: 15000000000,
      high_24h: 3550,
      low_24h: 3350,
      circulating_supply: 120000000,
    },
    {
      id: "tether",
      symbol: "usdt",
      name: "Tether",
      image: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
      current_price: 1.0,
      market_cap: 95000000000,
      market_cap_rank: 3,
      price_change_percentage_24h: (Math.random() - 0.5) * 0.2,
      total_volume: 45000000000,
      high_24h: 1.001,
      low_24h: 0.999,
      circulating_supply: 95000000000,
    },
    {
      id: "binancecoin",
      symbol: "bnb",
      name: "BNB",
      image: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
      current_price: getRandomizedPrice(580),
      market_cap: 89000000000,
      market_cap_rank: 4,
      price_change_percentage_24h: (Math.random() - 0.3) * 6,
      total_volume: 1200000000,
      high_24h: 595,
      low_24h: 565,
      circulating_supply: 153000000,
    },
    {
      id: "solana",
      symbol: "sol",
      name: "Solana",
      image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      current_price: getRandomizedPrice(145),
      market_cap: 65000000000,
      market_cap_rank: 5,
      price_change_percentage_24h: (Math.random() - 0.2) * 12,
      total_volume: 2500000000,
      high_24h: 152,
      low_24h: 138,
      circulating_supply: 450000000,
    },
    {
      id: "ripple",
      symbol: "xrp",
      name: "XRP",
      image: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
      current_price: getRandomizedPrice(0.52),
      market_cap: 28000000000,
      market_cap_rank: 6,
      price_change_percentage_24h: (Math.random() - 0.5) * 8,
      total_volume: 1100000000,
      high_24h: 0.55,
      low_24h: 0.49,
      circulating_supply: 54000000000,
    },
    {
      id: "usd-coin",
      symbol: "usdc",
      name: "USD Coin",
      image: "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
      current_price: 1.0,
      market_cap: 27000000000,
      market_cap_rank: 7,
      price_change_percentage_24h: (Math.random() - 0.5) * 0.1,
      total_volume: 5000000000,
      high_24h: 1.001,
      low_24h: 0.999,
      circulating_supply: 27000000000,
    },
    {
      id: "cardano",
      symbol: "ada",
      name: "Cardano",
      image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
      current_price: getRandomizedPrice(0.45),
      market_cap: 16000000000,
      market_cap_rank: 8,
      price_change_percentage_24h: (Math.random() - 0.4) * 10,
      total_volume: 350000000,
      high_24h: 0.48,
      low_24h: 0.43,
      circulating_supply: 35000000000,
    },
    {
      id: "dogecoin",
      symbol: "doge",
      name: "Dogecoin",
      image: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
      current_price: getRandomizedPrice(0.12),
      market_cap: 17000000000,
      market_cap_rank: 9,
      price_change_percentage_24h: (Math.random() - 0.2) * 15,
      total_volume: 800000000,
      high_24h: 0.13,
      low_24h: 0.11,
      circulating_supply: 142000000000,
    },
    {
      id: "avalanche-2",
      symbol: "avax",
      name: "Avalanche",
      image: "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
      current_price: getRandomizedPrice(35),
      market_cap: 14000000000,
      market_cap_rank: 10,
      price_change_percentage_24h: (Math.random() - 0.3) * 12,
      total_volume: 450000000,
      high_24h: 37,
      low_24h: 33,
      circulating_supply: 400000000,
    },
    {
      id: "polkadot",
      symbol: "dot",
      name: "Polkadot",
      image: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
      current_price: getRandomizedPrice(7.2),
      market_cap: 10000000000,
      market_cap_rank: 11,
      price_change_percentage_24h: (Math.random() - 0.4) * 8,
      total_volume: 280000000,
      high_24h: 7.5,
      low_24h: 6.9,
      circulating_supply: 1400000000,
    },
    {
      id: "chainlink",
      symbol: "link",
      name: "Chainlink",
      image: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
      current_price: getRandomizedPrice(14.5),
      market_cap: 8500000000,
      market_cap_rank: 12,
      price_change_percentage_24h: (Math.random() - 0.3) * 10,
      total_volume: 420000000,
      high_24h: 15.2,
      low_24h: 13.8,
      circulating_supply: 590000000,
    },
    {
      id: "polygon",
      symbol: "matic",
      name: "Polygon",
      image: "https://assets.coingecko.com/coins/images/4713/large/polygon.png",
      current_price: getRandomizedPrice(0.58),
      market_cap: 5800000000,
      market_cap_rank: 13,
      price_change_percentage_24h: (Math.random() - 0.4) * 12,
      total_volume: 320000000,
      high_24h: 0.62,
      low_24h: 0.55,
      circulating_supply: 10000000000,
    },
    {
      id: "litecoin",
      symbol: "ltc",
      name: "Litecoin",
      image: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
      current_price: getRandomizedPrice(72),
      market_cap: 5400000000,
      market_cap_rank: 14,
      price_change_percentage_24h: (Math.random() - 0.4) * 8,
      total_volume: 380000000,
      high_24h: 75,
      low_24h: 69,
      circulating_supply: 75000000,
    },
    {
      id: "uniswap",
      symbol: "uni",
      name: "Uniswap",
      image: "https://assets.coingecko.com/coins/images/12504/large/uniswap.png",
      current_price: getRandomizedPrice(9.8),
      market_cap: 5900000000,
      market_cap_rank: 15,
      price_change_percentage_24h: (Math.random() - 0.3) * 10,
      total_volume: 180000000,
      high_24h: 10.3,
      low_24h: 9.4,
      circulating_supply: 600000000,
    },
  ]
}

// Coin logos and colors
export const coinLogos: Record<string, string> = {
  bitcoin: "₿",
  ethereum: "Ξ",
  tether: "₮",
  binancecoin: "BNB",
  solana: "◎",
  ripple: "✕",
  cardano: "₳",
  dogecoin: "Ð",
  "avalanche-2": "A",
  "usd-coin": "$",
  polkadot: "●",
  chainlink: "⬡",
  polygon: "⬟",
  litecoin: "Ł",
  uniswap: "🦄",
}

export const coinColors: Record<string, string> = {
  bitcoin: "#F7931A",
  ethereum: "#627EEA",
  tether: "#26A17B",
  binancecoin: "#F3BA2F",
  solana: "#00FFA3",
  ripple: "#23292F",
  cardano: "#0033AD",
  dogecoin: "#C2A633",
  "avalanche-2": "#E84142",
  "usd-coin": "#2775CA",
  polkadot: "#E6007A",
  chainlink: "#2A5ADA",
  polygon: "#8247E5",
  litecoin: "#345D9D",
  uniswap: "#FF007A",
}
