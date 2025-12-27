"use client"

import type { ListEntry } from "@/lib/types"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Plus, Trash2, Shield, ShieldOff } from "lucide-react"

interface ListsManagerProps {
  lists: ListEntry[]
  merchantId: string
}

export function ListsManager({ lists }: ListsManagerProps) {
  const [localLists, setLocalLists] = useState(lists)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newEntry, setNewEntry] = useState({
    list_type: "whitelist" as ListEntry["list_type"],
    entry_type: "email" as ListEntry["entry_type"],
    value: "",
    reason: "",
  })
  const { toast } = useToast()

  const whitelist = localLists.filter((l) => l.list_type === "whitelist")
  const blacklist = localLists.filter((l) => l.list_type === "blacklist")

  const addEntry = () => {
    const newEntryData: ListEntry = {
      id: `list_${Date.now()}`,
      merchant_id: "demo",
      list_type: newEntry.list_type,
      entry_type: newEntry.entry_type,
      value: newEntry.value,
      reason: newEntry.reason || null,
      created_at: new Date().toISOString(),
    }

    setLocalLists((prev) => [newEntryData, ...prev])
    setIsDialogOpen(false)
    setNewEntry({ list_type: "whitelist", entry_type: "email", value: "", reason: "" })
    toast({ title: `Added to ${newEntry.list_type}` })
  }

  const removeEntry = (entryId: string) => {
    setLocalLists((prev) => prev.filter((l) => l.id !== entryId))
    toast({ title: "Entry removed" })
  }

  const ListTable = ({ entries, type }: { entries: ListEntry[]; type: "whitelist" | "blacklist" }) => (
    <Card className="bg-[#0d1221] border-[#1a2744]">
      <CardHeader>
        <div className="flex items-center gap-2">
          {type === "whitelist" ? (
            <Shield className="h-5 w-5 text-[#00ffc8]" />
          ) : (
            <ShieldOff className="h-5 w-5 text-[#ff4757]" />
          )}
          <div>
            <CardTitle className="text-base text-white">
              {type === "whitelist" ? "Trusted Entities" : "Blocked Entities"}
            </CardTitle>
            <CardDescription className="text-[#6b7b9a]">
              {type === "whitelist"
                ? "Auto-approve transactions from these entities"
                : "Auto-decline transactions from these entities"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-center text-sm text-[#6b7b9a] py-8">No entries in {type}</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-[#1a2744]">
                <TableHead className="text-[#6b7b9a]">Type</TableHead>
                <TableHead className="text-[#6b7b9a]">Value</TableHead>
                <TableHead className="hidden sm:table-cell text-[#6b7b9a]">Reason</TableHead>
                <TableHead className="hidden md:table-cell text-[#6b7b9a]">Added</TableHead>
                <TableHead className="text-right text-[#6b7b9a]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id} className="border-[#1a2744]">
                  <TableCell>
                    <Badge variant="outline" className="border-[#1a2744] text-[#8b9dc3]">
                      {entry.entry_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm text-white">{entry.value}</TableCell>
                  <TableCell className="hidden sm:table-cell text-[#6b7b9a]">{entry.reason || "-"}</TableCell>
                  <TableCell className="hidden md:table-cell text-[#6b7b9a]">
                    {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEntry(entry.id)}
                      className="text-[#ff4757] hover:text-[#ff4757] hover:bg-[#ff4757]/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0d1221] border-[#1a2744]">
            <DialogHeader>
              <DialogTitle className="text-white">Add List Entry</DialogTitle>
              <DialogDescription className="text-[#6b7b9a]">
                Add an email, IP, or other entity to your whitelist or blacklist
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label className="text-[#8b9dc3]">List Type</Label>
                <Select
                  value={newEntry.list_type}
                  onValueChange={(v) => setNewEntry({ ...newEntry, list_type: v as ListEntry["list_type"] })}
                >
                  <SelectTrigger className="bg-[#0a0e1a] border-[#1a2744] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d1221] border-[#1a2744]">
                    <SelectItem value="whitelist">Whitelist (Trusted)</SelectItem>
                    <SelectItem value="blacklist">Blacklist (Blocked)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-[#8b9dc3]">Entry Type</Label>
                <Select
                  value={newEntry.entry_type}
                  onValueChange={(v) => setNewEntry({ ...newEntry, entry_type: v as ListEntry["entry_type"] })}
                >
                  <SelectTrigger className="bg-[#0a0e1a] border-[#1a2744] text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d1221] border-[#1a2744]">
                    <SelectItem value="email">Email Address</SelectItem>
                    <SelectItem value="ip">IP Address</SelectItem>
                    <SelectItem value="card_bin">Card BIN</SelectItem>
                    <SelectItem value="country">Country Code</SelectItem>
                    <SelectItem value="device">Device Fingerprint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-[#8b9dc3]">Value</Label>
                <Input
                  placeholder={
                    newEntry.entry_type === "email"
                      ? "customer@example.com"
                      : newEntry.entry_type === "ip"
                        ? "192.168.1.1"
                        : newEntry.entry_type === "country"
                          ? "US"
                          : "Enter value..."
                  }
                  value={newEntry.value}
                  onChange={(e) => setNewEntry({ ...newEntry, value: e.target.value })}
                  className="bg-[#0a0e1a] border-[#1a2744] text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[#8b9dc3]">Reason (optional)</Label>
                <Input
                  placeholder="Why are you adding this entry?"
                  value={newEntry.reason}
                  onChange={(e) => setNewEntry({ ...newEntry, reason: e.target.value })}
                  className="bg-[#0a0e1a] border-[#1a2744] text-white"
                />
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
                onClick={addEntry}
                disabled={!newEntry.value}
                className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90"
              >
                Add Entry
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="whitelist">
        <TabsList className="bg-[#0d1221] border border-[#1a2744]">
          <TabsTrigger
            value="whitelist"
            className="data-[state=active]:bg-[#00ffc8]/10 data-[state=active]:text-[#00ffc8]"
          >
            Whitelist ({whitelist.length})
          </TabsTrigger>
          <TabsTrigger
            value="blacklist"
            className="data-[state=active]:bg-[#ff4757]/10 data-[state=active]:text-[#ff4757]"
          >
            Blacklist ({blacklist.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="whitelist" className="mt-4">
          <ListTable entries={whitelist} type="whitelist" />
        </TabsContent>
        <TabsContent value="blacklist" className="mt-4">
          <ListTable entries={blacklist} type="blacklist" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
