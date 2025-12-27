"use client"

import { LiveDemo } from "@/components/dashboard/live-demo"
import { TransactionTimeline } from "@/components/dashboard/transaction-timeline"
import { DeviceFingerprint } from "@/components/dashboard/device-fingerprint"
import { SmartCheckout } from "@/components/dashboard/smart-checkout"
import { CustomerRiskProfile } from "@/components/dashboard/customer-risk-profile"
import { getDemoSessionClient } from "@/lib/demo-auth"
import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Zap, Info, Shield, Clock, Target, CreditCard, Fingerprint, User } from "lucide-react"

export default function DemoPage() {
  const [apiKey, setApiKey] = useState("pg_live_demo_xxxxxxxxxxxx")

  useEffect(() => {
    const session = getDemoSessionClient()
    if (session) {
      setApiKey(`pg_live_${session.id.substring(0, 16)}`)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Badge className="bg-[#00ffc8]/10 text-[#00ffc8] border-[#00ffc8]/30">
            <Zap className="h-3 w-3 mr-1" />
            Interactive Demo
          </Badge>
          <Badge className="bg-[#a855f7]/10 text-[#a855f7] border-[#a855f7]/30">NEW</Badge>
        </div>
        <h1 className="text-2xl font-bold text-white">Live Fraud Detection Demo</h1>
        <p className="text-[#6b7b9a] mt-1">
          Experience real-time fraud scoring with our AI engine. Test different scenarios and see instant results.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#0d1221] border-[#1a2744]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#00ffc8]/10 border border-[#00ffc8]/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-[#00ffc8]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">42ms</p>
              <p className="text-xs text-[#6b7b9a]">Avg Response</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1221] border-[#1a2744]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#a855f7]/10 border border-[#a855f7]/30 flex items-center justify-center">
              <Target className="h-5 w-5 text-[#a855f7]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">99.7%</p>
              <p className="text-xs text-[#6b7b9a]">Accuracy</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1221] border-[#1a2744]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#00a8ff]/10 border border-[#00a8ff]/30 flex items-center justify-center">
              <Shield className="h-5 w-5 text-[#00a8ff]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">200+</p>
              <p className="text-xs text-[#6b7b9a]">Risk Signals</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0d1221] border-[#1a2744]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#ffc107]/10 border border-[#ffc107]/30 flex items-center justify-center">
              <Info className="h-5 w-5 text-[#ffc107]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-[#6b7b9a]">Explainable</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Tabs */}
      <Tabs defaultValue="api" className="space-y-6">
        <TabsList className="bg-[#0d1221] border border-[#1a2744] p-1">
          <TabsTrigger
            value="api"
            className="data-[state=active]:bg-[#00ffc8] data-[state=active]:text-[#0a0e1a] text-[#6b7b9a]"
          >
            <Zap className="h-4 w-4 mr-2" />
            API Testing
          </TabsTrigger>
          <TabsTrigger
            value="checkout"
            className="data-[state=active]:bg-[#00ffc8] data-[state=active]:text-[#0a0e1a] text-[#6b7b9a]"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Checkout Flow
          </TabsTrigger>
          <TabsTrigger
            value="fingerprint"
            className="data-[state=active]:bg-[#00ffc8] data-[state=active]:text-[#0a0e1a] text-[#6b7b9a]"
          >
            <Fingerprint className="h-4 w-4 mr-2" />
            Device Analysis
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-[#00ffc8] data-[state=active]:text-[#0a0e1a] text-[#6b7b9a]"
          >
            <User className="h-4 w-4 mr-2" />
            Customer Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api" className="space-y-6">
          {/* How It Works */}
          <Card className="bg-[#0d1221] border-[#1a2744]">
            <CardHeader className="border-b border-[#1a2744] py-4">
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <Info className="h-4 w-4 text-[#00a8ff]" />
                How the Demo Works
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-4 gap-4 text-center">
                <div className="p-3">
                  <div className="h-8 w-8 rounded-full bg-[#00ffc8]/10 border border-[#00ffc8]/30 flex items-center justify-center mx-auto mb-2 text-[#00ffc8] text-sm font-bold">
                    1
                  </div>
                  <p className="text-xs text-white font-medium">Select Scenario</p>
                  <p className="text-xs text-[#6b7b9a] mt-1">Choose from preset fraud patterns</p>
                </div>
                <div className="p-3">
                  <div className="h-8 w-8 rounded-full bg-[#00ffc8]/10 border border-[#00ffc8]/30 flex items-center justify-center mx-auto mb-2 text-[#00ffc8] text-sm font-bold">
                    2
                  </div>
                  <p className="text-xs text-white font-medium">Run Analysis</p>
                  <p className="text-xs text-[#6b7b9a] mt-1">Our AI scores the transaction</p>
                </div>
                <div className="p-3">
                  <div className="h-8 w-8 rounded-full bg-[#00ffc8]/10 border border-[#00ffc8]/30 flex items-center justify-center mx-auto mb-2 text-[#00ffc8] text-sm font-bold">
                    3
                  </div>
                  <p className="text-xs text-white font-medium">View Results</p>
                  <p className="text-xs text-[#6b7b9a] mt-1">See risk score and factors</p>
                </div>
                <div className="p-3">
                  <div className="h-8 w-8 rounded-full bg-[#00ffc8]/10 border border-[#00ffc8]/30 flex items-center justify-center mx-auto mb-2 text-[#00ffc8] text-sm font-bold">
                    4
                  </div>
                  <p className="text-xs text-white font-medium">Get Decision</p>
                  <p className="text-xs text-[#6b7b9a] mt-1">Approve, Review, or Decline</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Demo Component */}
          <LiveDemo apiKey={apiKey} riskTolerance={50} />

          {/* Transaction Timeline */}
          <TransactionTimeline />
        </TabsContent>

        <TabsContent value="checkout" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <SmartCheckout />
            <Card className="border-[#1a2744] bg-[#0d1221]">
              <CardHeader className="border-b border-[#1a2744]">
                <CardTitle className="text-white">How Smart Checkout Works</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  {[
                    { step: "1", title: "Card Validation", desc: "Verify card details and BIN lookup" },
                    { step: "2", title: "Device Fingerprinting", desc: "Collect 50+ device signals" },
                    { step: "3", title: "Behavioral Analysis", desc: "Analyze typing patterns and mouse movement" },
                    { step: "4", title: "ML Risk Scoring", desc: "Run neural network models" },
                    { step: "5", title: "Decision Engine", desc: "Apply custom rules and thresholds" },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="flex items-start gap-3 p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744]"
                    >
                      <div className="h-6 w-6 rounded-full bg-[#00ffc8]/10 border border-[#00ffc8]/30 flex items-center justify-center text-[#00ffc8] text-xs font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{item.title}</p>
                        <p className="text-xs text-[#6b7b9a]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fingerprint">
          <DeviceFingerprint />
        </TabsContent>

        <TabsContent value="profile">
          <div className="grid lg:grid-cols-2 gap-6">
            <CustomerRiskProfile />
            <Card className="border-[#1a2744] bg-[#0d1221]">
              <CardHeader className="border-b border-[#1a2744]">
                <CardTitle className="text-white">Customer Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <p className="text-[#6b7b9a] text-sm">
                  PayGuard AI builds comprehensive risk profiles for each customer, tracking their behavior over time to
                  distinguish between legitimate users and potential fraudsters.
                </p>
                <div className="space-y-3">
                  {[
                    { title: "Historical Analysis", desc: "Track patterns across all transactions" },
                    { title: "Device Linking", desc: "Associate devices with customer accounts" },
                    { title: "Velocity Tracking", desc: "Monitor transaction frequency and amounts" },
                    { title: "Geographic Profiling", desc: "Build location history and detect anomalies" },
                    { title: "Trust Scoring", desc: "Dynamic trust levels based on behavior" },
                  ].map((item) => (
                    <div key={item.title} className="p-3 rounded-lg bg-[#0a0e1a] border border-[#1a2744]">
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-[#6b7b9a]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
