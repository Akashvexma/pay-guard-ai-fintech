"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Currency = "USD" | "INR"

interface CurrencyContextType {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatAmount: (amountCents: number) => string
  formatAmountShort: (amountCents: number) => string
  symbol: string
  exchangeRate: number
}

const EXCHANGE_RATE = 83.5 // 1 USD = 83.5 INR

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD")

  useEffect(() => {
    const saved = localStorage.getItem("payguard_currency") as Currency
    if (saved === "USD" || saved === "INR") {
      setCurrency(saved)
    }
  }, [])

  const handleSetCurrency = (newCurrency: Currency) => {
    setCurrency(newCurrency)
    localStorage.setItem("payguard_currency", newCurrency)
  }

  const formatAmount = (amountCents: number) => {
    const amountUSD = amountCents / 100
    if (currency === "INR") {
      const amountINR = amountUSD * EXCHANGE_RATE
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(amountINR)
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amountUSD)
  }

  const formatAmountShort = (amountCents: number) => {
    const amountUSD = amountCents / 100
    const amount = currency === "INR" ? amountUSD * EXCHANGE_RATE : amountUSD
    const symbol = currency === "INR" ? "₹" : "$"

    if (amount >= 10000000) {
      return `${symbol}${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `${symbol}${(amount / 100000).toFixed(1)}L`
    } else if (amount >= 1000) {
      return `${symbol}${(amount / 1000).toFixed(1)}K`
    }
    return `${symbol}${amount.toFixed(0)}`
  }

  const symbol = currency === "INR" ? "₹" : "$"

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency: handleSetCurrency,
        formatAmount,
        formatAmountShort,
        symbol,
        exchangeRate: EXCHANGE_RATE,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider")
  }
  return context
}
