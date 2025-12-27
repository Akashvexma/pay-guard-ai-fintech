"use client"

import type { Rule } from "@/lib/types"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Zap, Globe, DollarSign, Mail, CreditCard } from "lucide-react"

interface RulesManagerProps {
  rules: Rule[]
  merchantId: string
}

const ruleTypeIcons = {
  velocity: Zap,
  amount: DollarSign,
  geo: Globe,
  card: CreditCard,
  email: Mail,
  custom: Zap,
}

export function RulesManager({ rules }: RulesManagerProps) {
  const [localRules, setLocalRules] = useState(rules)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newRule, setNewRule] = useState({
    name: "",
    rule_type: "amount" as Rule["rule_type"],
    action: "review" as Rule["action"],
    condition: { threshold: 10000 },
  })
  const { toast } = useToast()

  const toggleRule = (ruleId: string, isActive: boolean) => {
    setLocalRules((prev) => prev.map((r) => (r.id === ruleId ? { ...r, is_active: isActive } : r)))
    toast({ title: isActive ? "Rule enabled" : "Rule disabled" })
  }

  const deleteRule = (ruleId: string) => {
    setLocalRules((prev) => prev.filter((r) => r.id !== ruleId))
    toast({ title: "Rule deleted" })
  }

  const createRule = () => {
    const newRuleData: Rule = {
      id: `rule_${Date.now()}`,
      merchant_id: "demo",
      name: newRule.name,
      rule_type: newRule.rule_type,
      action: newRule.action,
      condition: newRule.condition,
      priority: localRules.length,
      is_active: true,
      created_at: new Date().toISOString(),
    }

    setLocalRules((prev) => [...prev, newRuleData])
    setIsDialogOpen(false)
    setNewRule({ name: "", rule_type: "amount", action: "review", condition: { threshold: 10000 } })
    toast({ title: "Rule created" })
  }

  const getRuleDescription = (rule: Rule) => {
    const condition = rule.condition as Record<string, unknown>
    switch (rule.rule_type) {
      case "amount":
        return `Transactions over $${((condition.threshold as number) / 100).toFixed(2)}`
      case "velocity":
        return `More than ${condition.count} transactions in ${condition.minutes} minutes`
      case "geo":
        return `Transactions from ${condition.countries || "specified countries"}`
      default:
        return JSON.stringify(condition)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0d1221] border-[#1a2744]">
            <DialogHeader>
              <DialogTitle className="text-white">Create Custom Rule</DialogTitle>
              <DialogDescription className="text-[#6b7b9a]">
                Define a new fraud detection rule for your transactions
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ruleName" className="text-[#8b9dc3]">
                  Rule Name
                </Label>
                <Input
                  id="ruleName"
                  placeholder="e.g., High Value Transactions"
                  value={newRule.name}
                  onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                  className="bg-[#0a0e1a] border-[#1a2744] text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[#8b9dc3]">Rule Type</Label>
                <Select
                  value={newRule.rule_type}
                  onValueChange={(v) => setNewRule({ ...newRule, rule_type: v as Rule["rule_type"] })}
                >
                  <SelectTrigger className="bg-[#0a0e1a] border-[#1a2744] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d1221] border-[#1a2744]">
                    <SelectItem value="amount">Amount Threshold</SelectItem>
                    <SelectItem value="velocity">Velocity Limit</SelectItem>
                    <SelectItem value="geo">Geographic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {newRule.rule_type === "amount" && (
                <div className="grid gap-2">
                  <Label className="text-[#8b9dc3]">Amount Threshold (cents)</Label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={(newRule.condition as { threshold: number }).threshold}
                    onChange={(e) =>
                      setNewRule({ ...newRule, condition: { threshold: Number.parseInt(e.target.value) || 0 } })
                    }
                    className="bg-[#0a0e1a] border-[#1a2744] text-white"
                  />
                  <p className="text-xs text-[#6b7b9a]">
                    Triggers when transaction exceeds $
                    {(((newRule.condition as { threshold: number }).threshold || 0) / 100).toFixed(2)}
                  </p>
                </div>
              )}
              <div className="grid gap-2">
                <Label className="text-[#8b9dc3]">Action</Label>
                <Select
                  value={newRule.action}
                  onValueChange={(v) => setNewRule({ ...newRule, action: v as Rule["action"] })}
                >
                  <SelectTrigger className="bg-[#0a0e1a] border-[#1a2744] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d1221] border-[#1a2744]">
                    <SelectItem value="approve">Auto-approve</SelectItem>
                    <SelectItem value="review">Flag for Review</SelectItem>
                    <SelectItem value="decline">Auto-decline</SelectItem>
                    <SelectItem value="add_score">Add to Risk Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="bg-transparent border-[#1a2744] text-[#8b9dc3] hover:bg-[#1a2744]"
              >
                Cancel
              </Button>
              <Button
                onClick={createRule}
                disabled={!newRule.name}
                className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90"
              >
                Create Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {localRules.length === 0 ? (
        <Card className="bg-[#0d1221] border-[#1a2744]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Zap className="h-12 w-12 text-[#6b7b9a] mb-4" />
            <p className="text-lg font-medium text-white">No custom rules yet</p>
            <p className="text-sm text-[#6b7b9a] mb-4">Create rules to customize fraud detection for your business</p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Rule
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {localRules.map((rule) => {
            const Icon = ruleTypeIcons[rule.rule_type] || Zap
            return (
              <Card key={rule.id} className="bg-[#0d1221] border-[#1a2744]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00ffc8]/10">
                        <Icon className="h-5 w-5 text-[#00ffc8]" />
                      </div>
                      <div>
                        <CardTitle className="text-base text-white">{rule.name}</CardTitle>
                        <CardDescription className="text-[#6b7b9a]">{getRuleDescription(rule)}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        className={
                          rule.action === "approve"
                            ? "bg-[#00ffc8]/20 text-[#00ffc8]"
                            : rule.action === "decline"
                              ? "bg-[#ff4757]/20 text-[#ff4757]"
                              : "bg-[#ffc107]/20 text-[#ffc107]"
                        }
                      >
                        {rule.action}
                      </Badge>
                      <Switch checked={rule.is_active} onCheckedChange={(v) => toggleRule(rule.id, v)} />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRule(rule.id)}
                        className="text-[#ff4757] hover:text-[#ff4757] hover:bg-[#ff4757]/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
