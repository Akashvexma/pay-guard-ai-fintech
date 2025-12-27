"use client"

import { useCurrency } from "@/lib/currency-context"
import { Button } from "@/components/ui/button"
import { IndianRupee, DollarSign } from "lucide-react"

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency()

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency("USD")}
        className={`h-8 px-3 rounded-md transition-all ${
          currency === "USD"
            ? "bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] text-[#0a0e1a] font-semibold shadow-[0_0_10px_rgba(0,255,200,0.3)]"
            : "text-[#6b7b9a] hover:text-white hover:bg-[#1a2744]"
        }`}
      >
        <DollarSign className="h-4 w-4 mr-1" />
        USD
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency("INR")}
        className={`h-8 px-3 rounded-md transition-all ${
          currency === "INR"
            ? "bg-gradient-to-r from-[#00ffc8] to-[#00a8ff] text-[#0a0e1a] font-semibold shadow-[0_0_10px_rgba(0,255,200,0.3)]"
            : "text-[#6b7b9a] hover:text-white hover:bg-[#1a2744]"
        }`}
      >
        <IndianRupee className="h-4 w-4 mr-1" />
        INR
      </Button>
    </div>
  )
}
