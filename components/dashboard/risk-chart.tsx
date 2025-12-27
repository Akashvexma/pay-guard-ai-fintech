"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Activity } from "lucide-react"

interface RiskChartProps {
  data: { date: string; approved: number; review: number; declined: number }[]
}

export function RiskChart({ data }: RiskChartProps) {
  return (
    <Card className="bg-[#0d1221] border-[#1a2744]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#00ffc8]" />
          Transaction Decisions
        </CardTitle>
        <CardDescription className="text-[#6b7b9a]">Decision distribution over the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {data.length === 0 ? (
            <div className="flex h-full items-center justify-center text-[#6b7b9a]">No data available yet</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ffc8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ffc8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc107" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffc107" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorDeclined" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4757" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ff4757" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2744" />
                <XAxis dataKey="date" tick={{ fill: "#6b7b9a", fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#6b7b9a", fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0d1221",
                    border: "1px solid #1a2744",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#6b7b9a" }}
                />
                <Area
                  type="monotone"
                  dataKey="approved"
                  stackId="1"
                  stroke="#00ffc8"
                  fill="url(#colorApproved)"
                  name="Approved"
                />
                <Area
                  type="monotone"
                  dataKey="review"
                  stackId="1"
                  stroke="#ffc107"
                  fill="url(#colorReview)"
                  name="Review"
                />
                <Area
                  type="monotone"
                  dataKey="declined"
                  stackId="1"
                  stroke="#ff4757"
                  fill="url(#colorDeclined)"
                  name="Declined"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
