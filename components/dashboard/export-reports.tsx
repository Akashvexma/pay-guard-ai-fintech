"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, FileSpreadsheet, FileText, Loader2, CheckCircle } from "lucide-react"

const reportTypes = [
  { value: "transactions", label: "Transactions Report", icon: FileSpreadsheet },
  { value: "fraud_summary", label: "Fraud Summary", icon: FileText },
  { value: "risk_analysis", label: "Risk Analysis", icon: FileText },
  { value: "compliance", label: "Compliance Report", icon: FileText },
]

const dateRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "ytd", label: "Year to date" },
  { value: "custom", label: "Custom range" },
]

const exportFormats = [
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "Excel (.xlsx)" },
  { value: "pdf", label: "PDF Report" },
  { value: "json", label: "JSON" },
]

export function ExportReports() {
  const [reportType, setReportType] = useState("transactions")
  const [dateRange, setDateRange] = useState("30d")
  const [format, setFormat] = useState("csv")
  const [includeCharts, setIncludeCharts] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)

  const handleExport = async () => {
    setIsExporting(true)
    setExportComplete(false)

    // Simulate export
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsExporting(false)
    setExportComplete(true)

    // Reset after showing success
    setTimeout(() => setExportComplete(false), 3000)
  }

  return (
    <Card className="border-[#1a2744] bg-[#0d1221]">
      <CardHeader className="border-b border-[#1a2744]">
        <CardTitle className="text-white flex items-center gap-2">
          <Download className="h-5 w-5 text-[#00a8ff]" />
          Export Reports
        </CardTitle>
        <CardDescription className="text-[#6b7b9a]">Download transaction data and analytics reports</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Report Type Selection */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-white">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="bg-[#0a0e1a] border-[#1a2744] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1221] border-[#1a2744]">
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-white hover:bg-[#1a2744]">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="bg-[#0a0e1a] border-[#1a2744] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1221] border-[#1a2744]">
                {dateRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value} className="text-white hover:bg-[#1a2744]">
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <Label className="text-white">Export Format</Label>
          <div className="grid grid-cols-4 gap-2">
            {exportFormats.map((fmt) => (
              <Button
                key={fmt.value}
                variant="outline"
                className={`h-12 ${
                  format === fmt.value
                    ? "border-[#00ffc8] bg-[#00ffc8]/10 text-[#00ffc8]"
                    : "border-[#1a2744] bg-[#0a0e1a] text-[#6b7b9a] hover:border-[#00ffc8]/50 hover:text-white"
                }`}
                onClick={() => setFormat(fmt.value)}
              >
                {fmt.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Options */}
        {format === "pdf" && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-charts"
              checked={includeCharts}
              onCheckedChange={(checked) => setIncludeCharts(checked as boolean)}
              className="border-[#1a2744] data-[state=checked]:bg-[#00ffc8] data-[state=checked]:border-[#00ffc8]"
            />
            <Label htmlFor="include-charts" className="text-sm text-[#8b9dc3] cursor-pointer">
              Include charts and visualizations
            </Label>
          </div>
        )}

        {/* Export Summary */}
        <div className="p-4 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
          <h4 className="text-sm font-medium text-white mb-3">Export Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-[#6b7b9a]">Report</p>
              <p className="text-white">{reportTypes.find((t) => t.value === reportType)?.label}</p>
            </div>
            <div>
              <p className="text-[#6b7b9a]">Period</p>
              <p className="text-white">{dateRanges.find((r) => r.value === dateRange)?.label}</p>
            </div>
            <div>
              <p className="text-[#6b7b9a]">Format</p>
              <p className="text-white">{exportFormats.find((f) => f.value === format)?.label}</p>
            </div>
            <div>
              <p className="text-[#6b7b9a]">Est. Records</p>
              <p className="text-white">~2,847</p>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={isExporting}
          className={`w-full h-12 ${
            exportComplete ? "bg-[#00ffc8] hover:bg-[#00ffc8]/80" : "bg-[#00a8ff] hover:bg-[#00a8ff]/80"
          } text-[#0a0e1a] font-semibold`}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Report...
            </>
          ) : exportComplete ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Download Ready!
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
