"use client"

import { useEffect, useRef, memo } from "react"

interface TradingViewWidgetProps {
  symbol?: string
  theme?: "dark" | "light"
  width?: string | number
  height?: number
  interval?: string
  timezone?: string
  style?: string
  locale?: string
  toolbarBg?: string
  enablePublishing?: boolean
  allowSymbolChange?: boolean
  containerClass?: string
  showBuySellSignals?: boolean
  showVolumeProfile?: boolean
  showOrderBook?: boolean
}

function TradingViewWidgetComponent({
  symbol = "BINANCE:BTCUSDT",
  theme = "dark",
  width = "100%",
  height = 700,
  interval = "D",
  timezone = "Etc/UTC",
  style = "1",
  locale = "en",
  toolbarBg = "#0a1628",
  enablePublishing = false,
  allowSymbolChange = true,
  containerClass = "",
  showBuySellSignals = true,
  showVolumeProfile = true,
  showOrderBook = false,
}: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }

    const widgetContainer = document.createElement("div")
    widgetContainer.className = "tradingview-widget-container__widget"
    widgetContainer.style.height = `${height}px`
    widgetContainer.style.width = typeof width === "number" ? `${width}px` : width

    if (containerRef.current) {
      containerRef.current.appendChild(widgetContainer)
    }

    const studies = [
      "RSI@tv-basicstudies",
      "MASimple@tv-basicstudies",
      "MACD@tv-basicstudies",
      "BB@tv-basicstudies",
      "StochasticRSI@tv-basicstudies",
      "Volume@tv-basicstudies",
    ]

    if (showBuySellSignals) {
      studies.push("PivotPointsHighLow@tv-basicstudies", "ZigZag@tv-basicstudies")
    }

    if (showVolumeProfile) {
      studies.push("VbPFixed@tv-basicstudies")
    }

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: interval,
      timezone: timezone,
      theme: theme,
      style: style,
      locale: locale,
      toolbar_bg: toolbarBg,
      enable_publishing: enablePublishing,
      allow_symbol_change: allowSymbolChange,
      backgroundColor: "rgba(10, 22, 40, 1)",
      gridColor: "rgba(26, 39, 68, 0.5)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: true,
      calendar: false,
      hide_volume: false,
      support_host: "https://www.tradingview.com",
      studies: studies,
      withdateranges: true,
      details: true,
      hotlist: true,
      show_popup_button: true,
      popup_width: "1000",
      popup_height: "650",
    })

    scriptRef.current = script

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
    }
  }, [
    symbol,
    theme,
    width,
    height,
    interval,
    timezone,
    style,
    locale,
    toolbarBg,
    enablePublishing,
    allowSymbolChange,
    showBuySellSignals,
    showVolumeProfile,
    showOrderBook,
  ])

  return (
    <div className={`tradingview-widget-container ${containerClass}`} ref={containerRef}>
      <div
        className="tradingview-widget-container__widget"
        style={{ height: `${height}px`, width: typeof width === "number" ? `${width}px` : width }}
      ></div>
    </div>
  )
}

export const TradingViewWidget = memo(TradingViewWidgetComponent)

interface TechnicalAnalysisProps {
  symbol?: string
  width?: string | number
  height?: number
  colorTheme?: "dark" | "light"
  isTransparent?: boolean
  showIntervalTabs?: boolean
  displayMode?: "single" | "multiple"
}

function TradingViewTechnicalAnalysisComponent({
  symbol = "BINANCE:BTCUSDT",
  width = "100%",
  height = 450,
  colorTheme = "dark",
  isTransparent = true,
  showIntervalTabs = true,
  displayMode = "single",
}: TechnicalAnalysisProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      interval: "1D",
      width: typeof width === "number" ? width : "100%",
      height: height,
      symbol: symbol,
      showIntervalTabs: showIntervalTabs,
      displayMode: displayMode,
      locale: "en",
      colorTheme: colorTheme,
      isTransparent: isTransparent,
    })

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [symbol, width, height, colorTheme, isTransparent, showIntervalTabs, displayMode])

  return <div ref={containerRef} style={{ height: `${height}px` }}></div>
}

export const TradingViewTechnicalAnalysis = memo(TradingViewTechnicalAnalysisComponent)

interface SymbolInfoProps {
  symbol?: string
  width?: string | number
  colorTheme?: "dark" | "light"
  isTransparent?: boolean
}

function TradingViewSymbolInfoComponent({
  symbol = "BINANCE:BTCUSDT",
  width = "100%",
  colorTheme = "dark",
  isTransparent = true,
}: SymbolInfoProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: typeof width === "number" ? width : "100%",
      locale: "en",
      colorTheme: colorTheme,
      isTransparent: isTransparent,
    })

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [symbol, width, colorTheme, isTransparent])

  return <div ref={containerRef}></div>
}

export const TradingViewSymbolInfo = memo(TradingViewSymbolInfoComponent)

interface MiniChartProps {
  symbol?: string
  width?: string | number
  height?: number
  colorTheme?: "dark" | "light"
  isTransparent?: boolean
  autosize?: boolean
  chartType?: "area" | "bars" | "line" | "candles"
}

function TradingViewMiniChartComponent({
  symbol = "BINANCE:BTCUSDT",
  width = "100%",
  height = 220,
  colorTheme = "dark",
  isTransparent = true,
  autosize = true,
  chartType = "area",
}: MiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: typeof width === "number" ? width : "100%",
      height: height,
      locale: "en",
      dateRange: "12M",
      colorTheme: colorTheme,
      isTransparent: isTransparent,
      autosize: autosize,
      chartType: chartType,
      largeChartUrl: "",
    })

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [symbol, width, height, colorTheme, isTransparent, autosize, chartType])

  return <div ref={containerRef} style={{ height: `${height}px` }}></div>
}

export const TradingViewMiniChart = memo(TradingViewMiniChartComponent)

interface TickerTapeProps {
  colorTheme?: "dark" | "light"
  isTransparent?: boolean
  displayMode?: "adaptive" | "regular" | "compact"
}

function TradingViewTickerTapeComponent({
  colorTheme = "dark",
  isTransparent = true,
  displayMode = "adaptive",
}: TickerTapeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
        { proName: "BINANCE:ETHUSDT", title: "Ethereum" },
        { proName: "BINANCE:SOLUSDT", title: "Solana" },
        { proName: "BINANCE:BNBUSDT", title: "BNB" },
        { proName: "BINANCE:XRPUSDT", title: "XRP" },
        { proName: "BINANCE:ADAUSDT", title: "Cardano" },
        { proName: "BINANCE:DOGEUSDT", title: "Dogecoin" },
        { proName: "BINANCE:AVAXUSDT", title: "Avalanche" },
        { proName: "BINANCE:DOTUSDT", title: "Polkadot" },
        { proName: "BINANCE:MATICUSDT", title: "Polygon" },
      ],
      showSymbolLogo: true,
      colorTheme: colorTheme,
      isTransparent: isTransparent,
      displayMode: displayMode,
      locale: "en",
    })

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [colorTheme, isTransparent, displayMode])

  return <div ref={containerRef}></div>
}

export const TradingViewTickerTape = memo(TradingViewTickerTapeComponent)

interface CryptoMarketWidgetProps {
  width?: string | number
  height?: number
  colorTheme?: "dark" | "light"
  isTransparent?: boolean
}

function TradingViewCryptoMarketComponent({
  width = "100%",
  height = 490,
  colorTheme = "dark",
  isTransparent = true,
}: CryptoMarketWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      width: typeof width === "number" ? width : "100%",
      height: height,
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: colorTheme,
      isTransparent: isTransparent,
      locale: "en",
    })

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [width, height, colorTheme, isTransparent])

  return <div ref={containerRef} style={{ height: `${height}px` }}></div>
}

export const TradingViewCryptoMarket = memo(TradingViewCryptoMarketComponent)

interface HeatmapWidgetProps {
  width?: string | number
  height?: number
  colorTheme?: "dark" | "light"
  isTransparent?: boolean
  dataSource?: "Crypto" | "SPX500" | "NASDAQ100"
}

function TradingViewHeatmapComponent({
  width = "100%",
  height = 500,
  colorTheme = "dark",
  isTransparent = true,
  dataSource = "Crypto",
}: HeatmapWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
    }

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      exchanges: [],
      dataSource: dataSource,
      grouping: "sector",
      blockSize: "market_cap_basic",
      blockColor: "change",
      locale: "en",
      symbolUrl: "",
      colorTheme: colorTheme,
      hasTopBar: true,
      isDataSet498: true,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      width: typeof width === "number" ? width : "100%",
      height: height,
      isTransparent: isTransparent,
    })

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [width, height, colorTheme, isTransparent, dataSource])

  return <div ref={containerRef} style={{ height: `${height}px` }}></div>
}

export const TradingViewHeatmap = memo(TradingViewHeatmapComponent)
