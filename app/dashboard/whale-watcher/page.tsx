"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { useCurrency } from "@/lib/currency-context"
import {
  TradingViewWidget,
  TradingViewTickerTape,
  TradingViewTechnicalAnalysis,
  TradingViewHeatmap,
} from "@/components/dashboard/tradingview-widget"
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Waves,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Zap,
  RefreshCw,
  BarChart3,
  LineChart,
  Settings,
  Target,
} from "lucide-react"

interface Trade {
  id: string
  coin: string
  symbol: string
  price: number
  quantity: number
  value: number
  side: "buy" | "sell"
  timestamp: Date
  isWhale: boolean
  exchange: string
  isReal: boolean
}

interface BinanceTradeMessage {
  e: string
  E: number
  s: string
  t: number
  p: string
  q: string
  b: number
  a: number
  T: number
  m: boolean
  M: boolean
}

// Coin configurations
const COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", binanceSymbol: "btcusdt" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", binanceSymbol: "ethusdt" },
  { id: "binancecoin", symbol: "BNB", name: "BNB", binanceSymbol: "bnbusdt" },
  { id: "solana", symbol: "SOL", name: "Solana", binanceSymbol: "solusdt" },
  { id: "ripple", symbol: "XRP", name: "XRP", binanceSymbol: "xrpusdt" },
  { id: "cardano", symbol: "ADA", name: "Cardano", binanceSymbol: "adausdt" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", binanceSymbol: "dogeusdt" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot", binanceSymbol: "dotusdt" },
  { id: "litecoin", symbol: "LTC", name: "Litecoin", binanceSymbol: "ltcusdt" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink", binanceSymbol: "linkusdt" },
]

const coinToTradingView: Record<string, string> = {
  bitcoin: "BINANCE:BTCUSDT",
  ethereum: "BINANCE:ETHUSDT",
  binancecoin: "BINANCE:BNBUSDT",
  solana: "BINANCE:SOLUSDT",
  ripple: "BINANCE:XRPUSDT",
  cardano: "BINANCE:ADAUSDT",
  dogecoin: "BINANCE:DOGEUSDT",
  polkadot: "BINANCE:DOTUSDT",
  litecoin: "BINANCE:LTCUSDT",
  chainlink: "BINANCE:LINKUSDT",
}

export default function WhaleWatcherPage() {
  const { formatAmount, currency } = useCurrency()
  const [isConnected, setIsConnected] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedCoin, setSelectedCoin] = useState("bitcoin")
  const [trades, setTrades] = useState<Trade[]>([])
  const [whaleTrades, setWhaleTrades] = useState<Trade[]>([])
  const [whaleThreshold, setWhaleThreshold] = useState(100000)
  const [showSettings, setShowSettings] = useState(false)
  const [currentPrice, setCurrentPrice] = useState(0)
  const [priceChange24h, setPriceChange24h] = useState(0)
  const [volume24h, setVolume24h] = useState(0)
  const [realTradeCount, setRealTradeCount] = useState(0)
  const [wsStatus, setWsStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected")

  const wsRef = useRef<WebSocket | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const selectedCoinData = COINS.find((c) => c.id === selectedCoin)
  const tradingViewSymbol = coinToTradingView[selectedCoin] || "BINANCE:BTCUSDT"

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close()
    }

    const binanceSymbol = selectedCoinData?.binanceSymbol || "btcusdt"
    const wsUrl = `wss://stream.binance.com:9443/ws/${binanceSymbol}@trade`

    setWsStatus("connecting")
    const ws = new WebSocket(wsUrl)

    ws.onopen = () => {
      console.log("[v0] Binance WebSocket connected")
      setWsStatus("connected")
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      try {
        const data: BinanceTradeMessage = JSON.parse(event.data)

        const price = Number.parseFloat(data.p)
        const quantity = Number.parseFloat(data.q)
        const value = price * quantity

        // Update current price
        setCurrentPrice(price)
        setRealTradeCount((prev) => prev + 1)

        const trade: Trade = {
          id: `${data.t}-${Date.now()}`,
          coin: selectedCoin,
          symbol: selectedCoinData?.symbol || "BTC",
          price,
          quantity,
          value,
          side: data.m ? "sell" : "buy", // m = true means buyer is maker (sell)
          timestamp: new Date(data.T),
          isWhale: value >= whaleThreshold,
          exchange: "Binance",
          isReal: true,
        }

        setTrades((prev) => [trade, ...prev].slice(0, 200))

        if (trade.isWhale) {
          setWhaleTrades((prev) => [trade, ...prev].slice(0, 50))

          // Play sound for whale alert
          if (soundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(() => {})
          }
        }
      } catch (err) {
        console.error("[v0] WebSocket message error:", err)
      }
    }

    ws.onerror = (error) => {
      console.error("[v0] WebSocket error:", error)
      setWsStatus("disconnected")
    }

    ws.onclose = () => {
      console.log("[v0] WebSocket closed")
      setWsStatus("disconnected")
      setIsConnected(false)
    }

    wsRef.current = ws
  }, [selectedCoin, selectedCoinData, whaleThreshold, soundEnabled])

  const disconnectWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsConnected(false)
    setWsStatus("disconnected")
  }, [])

  // Toggle connection
  const toggleConnection = () => {
    if (isConnected) {
      disconnectWebSocket()
    } else {
      connectWebSocket()
    }
  }

  // Reconnect when coin changes
  useEffect(() => {
    if (isConnected) {
      disconnectWebSocket()
      setTimeout(connectWebSocket, 500)
    }
  }, [selectedCoin])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectWebSocket()
    }
  }, [disconnectWebSocket])

  // Fetch 24h stats from Binance REST API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const binanceSymbol = selectedCoinData?.binanceSymbol?.toUpperCase() || "BTCUSDT"
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${binanceSymbol}`)
        if (response.ok) {
          const data = await response.json()
          setCurrentPrice(Number.parseFloat(data.lastPrice))
          setPriceChange24h(Number.parseFloat(data.priceChangePercent))
          setVolume24h(Number.parseFloat(data.quoteVolume))
        }
      } catch (err) {
        console.error("[v0] Failed to fetch stats:", err)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [selectedCoinData])

  const formatCoinPrice = (price: number) => {
    if (price >= 1000) return price.toLocaleString(undefined, { maximumFractionDigits: 2 })
    if (price >= 1) return price.toLocaleString(undefined, { maximumFractionDigits: 4 })
    return price.toLocaleString(undefined, { maximumFractionDigits: 8 })
  }

  const formatVolume = (vol: number) => {
    if (vol >= 1e9) return `$${(vol / 1e9).toFixed(2)}B`
    if (vol >= 1e6) return `$${(vol / 1e6).toFixed(2)}M`
    if (vol >= 1e3) return `$${(vol / 1e3).toFixed(2)}K`
    return `$${vol.toFixed(2)}`
  }

  return (
    <div className="space-y-4">
      {/* Audio element for whale alerts */}
      <audio
        ref={audioRef}
        src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1bW2BjZWtxd3h5eHh3dHJwb21rampqamlqa2xucHN2eXt9fn9/fn18enl4d3Z2dnZ2dnZ3d3h5ent8fn+AgYGBgYCAfn18e3p5eHd3d3d3d3h4eXp7fH1+f4CAgICAgH9+fXx7enl5eHh4eHl5enp7fH1+f3+AgICAgIB/fn59fHt7enp6enp6e3t8fH1+fn9/gICAgICAf39+fn19fHx8fHx8fHx9fX5+fn9/f39/f39/f39/fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn9/f39/f39/f39/f39/f39/f39/f39/f35+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+fn5+"
        preload="auto"
      />

      {/* Ticker Tape */}
      <div className="rounded-lg overflow-hidden border border-[#1a2744]">
        <TradingViewTickerTape colorTheme="dark" isTransparent={true} displayMode="adaptive" />
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/20 to-yellow-500/20 border border-orange-500/30">
            <Waves className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Whale Watcher</h1>
            <p className="text-sm text-[#6b7b9a]">
              Track 1: Real-Time Binance Trade Detection
              {wsStatus === "connected" && (
                <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 text-xs">LIVE</Badge>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Select value={selectedCoin} onValueChange={setSelectedCoin}>
            <SelectTrigger className="w-44 bg-[#0a1628] border-[#1a2744] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#0a1628] border-[#1a2744]">
              {COINS.map((coin) => (
                <SelectItem key={coin.id} value={coin.id} className="text-white hover:bg-[#1a2744]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{coin.symbol}</span>
                    <span className="text-[#6b7b9a]">{coin.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="text-[#6b7b9a] hover:text-white"
          >
            <Settings className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-[#6b7b9a] hover:text-white"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>

          <Button
            onClick={toggleConnection}
            className={
              isConnected
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                : "bg-[#00ffc8]/20 text-[#00ffc8] border border-[#00ffc8]/30 hover:bg-[#00ffc8]/30"
            }
          >
            {wsStatus === "connecting" ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : isConnected ? (
              <>
                <WifiOff className="h-4 w-4 mr-2" />
                Disconnect
              </>
            ) : (
              <>
                <Wifi className="h-4 w-4 mr-2" />
                Connect Live
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="text-sm text-[#6b7b9a] mb-2 block">Whale Threshold (USD)</label>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[whaleThreshold]}
                    onValueChange={(v) => setWhaleThreshold(v[0])}
                    min={10000}
                    max={1000000}
                    step={10000}
                    className="flex-1"
                  />
                  <span className="text-white font-mono w-32 text-right">${whaleThreshold.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-[#0a1628]/80 border-[#1a2744] md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold bg-gradient-to-br from-orange-500/20 to-yellow-500/20 text-orange-400">
                {selectedCoinData?.symbol}
              </div>
              <div>
                <p className="text-sm text-[#6b7b9a]">{selectedCoinData?.name}</p>
                <p className="text-3xl font-bold text-white font-mono">${formatCoinPrice(currentPrice)}</p>
                <div className={`flex items-center gap-1 ${priceChange24h >= 0 ? "text-[#00ffc8]" : "text-red-400"}`}>
                  {priceChange24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="text-sm font-medium">
                    {priceChange24h >= 0 ? "+" : ""}
                    {priceChange24h.toFixed(2)}%
                  </span>
                  <span className="text-xs text-[#6b7b9a]">24h</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-6">
            <p className="text-sm text-[#6b7b9a]">24h Volume</p>
            <p className="text-xl font-bold text-white font-mono">{formatVolume(volume24h)}</p>
            <p className="text-xs text-[#6b7b9a] mt-1">Binance</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-6">
            <p className="text-sm text-[#6b7b9a]">Whale Alerts</p>
            <p className="text-xl font-bold text-orange-400 font-mono">{whaleTrades.length}</p>
            <p className="text-xs text-[#6b7b9a] mt-1">≥ ${whaleThreshold.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-6">
            <p className="text-sm text-[#6b7b9a]">Live Trades</p>
            <p className="text-xl font-bold text-[#00ffc8] font-mono">{realTradeCount}</p>
            <p className="text-xs text-[#6b7b9a] mt-1">{isConnected ? "Streaming" : "Disconnected"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chart" className="space-y-4">
        <TabsList className="bg-[#0a1628] border border-[#1a2744] flex-wrap h-auto p-1">
          <TabsTrigger value="chart" className="data-[state=active]:bg-[#1a2744] data-[state=active]:text-[#00ffc8]">
            <LineChart className="h-4 w-4 mr-2" />
            Chart
          </TabsTrigger>
          <TabsTrigger value="signals" className="data-[state=active]:bg-[#1a2744] data-[state=active]:text-[#00ffc8]">
            <Target className="h-4 w-4 mr-2" />
            Signals
          </TabsTrigger>
          <TabsTrigger value="trades" className="data-[state=active]:bg-[#1a2744] data-[state=active]:text-[#00ffc8]">
            <Zap className="h-4 w-4 mr-2" />
            Live Trades
          </TabsTrigger>
          <TabsTrigger value="whales" className="data-[state=active]:bg-[#1a2744] data-[state=active]:text-[#00ffc8]">
            <Waves className="h-4 w-4 mr-2" />
            Whale Alerts
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="data-[state=active]:bg-[#1a2744] data-[state=active]:text-[#00ffc8]">
            <BarChart3 className="h-4 w-4 mr-2" />
            Market
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <LineChart className="h-5 w-5 text-[#00a8ff]" />
                {selectedCoinData?.name} Advanced Chart
                <Badge className="ml-2 bg-[#00a8ff]/20 text-[#00a8ff] border-[#00a8ff]/30">TradingView</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-b-lg overflow-hidden" style={{ height: "600px" }}>
                <TradingViewWidget
                  symbol={tradingViewSymbol}
                  theme="dark"
                  height={600}
                  interval="15"
                  allowSymbolChange={true}
                  showBuySellSignals={true}
                  showVolumeProfile={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-[#0a1628]/80 border-[#1a2744]">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-[#00ffc8]" />
                  Technical Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div style={{ height: "400px" }}>
                  <TradingViewTechnicalAnalysis symbol={tradingViewSymbol} colorTheme="dark" height={400} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0a1628]/80 border-[#1a2744]">
              <CardHeader>
                <CardTitle className="text-white">Signal Guide</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-2 text-green-400 font-medium mb-2">
                    <TrendingUp className="h-4 w-4" />
                    Buy Signal Indicators
                  </div>
                  <ul className="text-sm text-[#8b9dc3] space-y-1">
                    <li>• RSI below 30 (oversold)</li>
                    <li>• MACD line crosses above signal</li>
                    <li>• Price touches lower Bollinger Band</li>
                    <li>• Strong buy from oscillators + moving averages</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                  <div className="flex items-center gap-2 text-red-400 font-medium mb-2">
                    <TrendingDown className="h-4 w-4" />
                    Sell Signal Indicators
                  </div>
                  <ul className="text-sm text-[#8b9dc3] space-y-1">
                    <li>• RSI above 70 (overbought)</li>
                    <li>• MACD line crosses below signal</li>
                    <li>• Price touches upper Bollinger Band</li>
                    <li>• Strong sell from oscillators + moving averages</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trades">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-[#00ffc8]" />
                Live Trade Stream
                {isConnected && (
                  <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">LIVE</Badge>
                )}
              </CardTitle>
              <CardDescription className="text-[#6b7b9a]">
                Real-time trades from Binance WebSocket - {realTradeCount.toLocaleString()} trades received
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isConnected ? (
                <div className="text-center py-12">
                  <Wifi className="h-12 w-12 text-[#6b7b9a] mx-auto mb-4" />
                  <p className="text-[#6b7b9a] mb-4">Connect to see live trades from Binance</p>
                  <Button onClick={connectWebSocket} className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90">
                    Connect Live
                  </Button>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {trades.length === 0 ? (
                    <div className="text-center py-8 text-[#6b7b9a]">
                      <Activity className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                      Waiting for trades...
                    </div>
                  ) : (
                    trades.slice(0, 100).map((trade) => (
                      <div
                        key={trade.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          trade.isWhale
                            ? "bg-orange-500/10 border-orange-500/30"
                            : trade.side === "buy"
                              ? "bg-[#00ffc8]/5 border-[#00ffc8]/20"
                              : "bg-red-500/5 border-red-500/20"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            className={
                              trade.side === "buy" ? "bg-[#00ffc8]/20 text-[#00ffc8]" : "bg-red-500/20 text-red-400"
                            }
                          >
                            {trade.side.toUpperCase()}
                          </Badge>
                          <div>
                            <p className="text-white font-mono text-sm">
                              {trade.quantity.toFixed(6)} {trade.symbol}
                            </p>
                            <p className="text-xs text-[#6b7b9a]">@ ${formatCoinPrice(trade.price)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-mono font-medium ${trade.isWhale ? "text-orange-400" : "text-white"}`}>
                            ${trade.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-[#6b7b9a]">
                            {trade.timestamp.toLocaleTimeString()}
                            {trade.isWhale && <span className="ml-2 text-orange-400">🐋</span>}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whales">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Waves className="h-5 w-5 text-orange-400" />
                Whale Alerts
                <Badge className="ml-2 bg-orange-500/20 text-orange-400 border-orange-500/30">
                  {whaleTrades.length} alerts
                </Badge>
              </CardTitle>
              <CardDescription className="text-[#6b7b9a]">
                Large trades ≥ ${whaleThreshold.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {whaleTrades.length === 0 ? (
                <div className="text-center py-12">
                  <Waves className="h-12 w-12 text-[#6b7b9a] mx-auto mb-4" />
                  <p className="text-[#6b7b9a]">
                    {isConnected ? "Waiting for whale trades..." : "Connect to detect whale trades"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {whaleTrades.map((trade) => (
                    <div
                      key={trade.id}
                      className="p-4 rounded-lg bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/30"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🐋</span>
                          <Badge
                            className={
                              trade.side === "buy" ? "bg-[#00ffc8]/20 text-[#00ffc8]" : "bg-red-500/20 text-red-400"
                            }
                          >
                            {trade.side.toUpperCase()}
                          </Badge>
                          <span className="text-white font-medium">{trade.symbol}</span>
                        </div>
                        <span className="text-xl font-bold text-orange-400">
                          ${trade.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-[#6b7b9a]">
                        <span>
                          {trade.quantity.toFixed(6)} @ ${formatCoinPrice(trade.price)}
                        </span>
                        <span>{trade.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-[#00a8ff]" />
                Crypto Market Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="rounded-b-lg overflow-hidden" style={{ height: "500px" }}>
                <TradingViewHeatmap colorTheme="dark" height={500} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
