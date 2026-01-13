"use client"

import { useMemo, useState } from "react"
import { Menu, Printer, Search, Sheet } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Line = { label: string; closing: number; opening: number }
type Structured =
  | { kind: "section"; label: string }
  | { kind: "total" | "highlight"; label: string; closing: number; opening: number }
  | { kind: "line"; label: string; closing: number; opening: number }

const yearOptions = ["2025-2026", "2024-2025", "2026-2027"]
const statuses = ["Approved", "Draft", "All"]

const operatingLines: Line[] = [
  { label: "Net Income", closing: 0, opening: 0 },
  { label: "Depreciation/Amortization Expenses", closing: 0, opening: 0 },
  { label: "Gain/Loss on sales of Fixed assets", closing: 0, opening: 0 },
]

const currentAssetLines: Line[] = [
  { label: "Advance & Pre-Payments", closing: 2689725, opening: 2741485 },
  { label: "Inventory", closing: 3151806, opening: 2937525 },
  { label: "Other Receivables", closing: 2229985, opening: 1767000 },
  { label: "Inter Company Current Account", closing: -15477846, opening: -13484845 },
  { label: "Cash & Cash Equivalent", closing: -8660, opening: 403411 },
]

const currentLiabilityLines: Line[] = [
  { label: "Accounts Payable – Expenses", closing: 5059039, opening: 6977235 },
  { label: "Accounts Payable – Capital Expenditure", closing: 50000, opening: 50000 },
  { label: "Payable for Statutory", closing: 77040, opening: 35646 },
  { label: "Un-earned Revenue", closing: 19166, opening: 0 },
]

const investingLines: Line[] = [
  { label: "Properties, Plant & Equipment", closing: 15198000, opening: 12277200 },
  { label: "Furniture, Fixtures & Fittings", closing: 8195143, opening: 8195143 },
]

const financingLines: Line[] = [
  { label: "Increase/ Decrease of Non Current Liability", closing: 0, opening: 0 },
]

export default function CashFlowPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [filters, setFilters] = useState({
    year: "2025-2026",
    status: "Approved",
    from: "2025-07-01",
    to: "2026-06-30",
  })
  const [showResults, setShowResults] = useState(false)

  const structured: Structured[] = useMemo(() => {
    const sumLine = (lines: Line[]) =>
      lines.reduce(
        (acc, l) => {
          acc.closing += l.closing
          acc.opening += l.opening
          return acc
        },
        { closing: 0, opening: 0 },
      )

    const totalCurrentAssets = sumLine(currentAssetLines)
    const totalCurrentLiabilities = sumLine(currentLiabilityLines)
    const netOperating = totalCurrentAssets.closing + totalCurrentLiabilities.closing
    const netOperatingOpening = totalCurrentAssets.opening + totalCurrentLiabilities.opening

    const totalInvesting = sumLine(investingLines)
    const totalFinancing = sumLine(financingLines)

    const netCash =
      netOperating +
      totalInvesting.closing +
      totalFinancing.closing

    const netCashOpening =
      netOperatingOpening +
      totalInvesting.opening +
      totalFinancing.opening

    const beginningBalance = 1183503.7
    const endingBalance = beginningBalance + netCash

    return [
      { kind: "section", label: "Cash flow from operating activities" },
      ...operatingLines.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "section", label: "Increase/ Decrease of Current Assets" },
      ...currentAssetLines.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "section", label: "Increase/ Decrease of Current Liability" },
      ...currentLiabilityLines.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "total", label: "(a) Net cash Provided/used in Operating activities", closing: netOperating, opening: netOperatingOpening },

      { kind: "section", label: "Cash flow from investing activities" },
      { kind: "section", label: "Increase/ Decrease of Fixed Assets" },
      ...investingLines.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "total", label: "(b) Net cash Provided/used in Investing activities", closing: totalInvesting.closing, opening: totalInvesting.opening },

      { kind: "section", label: "Cash flow from financing activities" },
      ...financingLines.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "total", label: "(c) Net cash inflow/outflow from financing activities", closing: totalFinancing.closing, opening: totalFinancing.opening },

      { kind: "highlight", label: "Net cash surplus/(deficit) during the year (a+b+c)", closing: netCash, opening: netCashOpening },
      { kind: "line", label: "Cash balance at the beginning of the period", closing: beginningBalance, opening: beginningBalance },
      { kind: "highlight", label: "Cash Balance at the end of period", closing: endingBalance, opening: endingBalance },
    ]
  }, [])

  const formatAmt = (n: number) => n.toLocaleString()

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />
      <main className={`flex-1 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-[18rem]"}`}>
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border/40 bg-card/95 backdrop-blur-sm px-4 lg:px-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Reports</p>
              <h1 className="text-sm font-semibold text-foreground">Cash Flow Statement</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <Card className="border border-border/70 bg-white">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Year</Label>
                  <Select value={filters.year} onValueChange={(v) => setFilters((p) => ({ ...p, year: v }))}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Status</Label>
                  <Select value={filters.status} onValueChange={(v) => setFilters((p) => ({ ...p, status: v }))}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">From Date</Label>
                  <Input
                    type="date"
                    value={filters.from}
                    onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">To Date</Label>
                  <Input
                    type="date"
                    value={filters.to}
                    onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button size="sm" className="h-9 px-4 text-sm" onClick={() => setShowResults(true)}>
                    Search
                  </Button>
                  <Button variant="outline" size="sm" className="h-9 px-4 text-sm">
                    Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-white">
            <CardHeader className="pb-2 text-center space-y-1">
              <CardTitle className="text-sm">Pakiza Software Limited</CardTitle>
              <p className="text-xs text-slate-600 font-semibold">Cash Flow Statement</p>
              <p className="text-xs text-slate-500">For the period from {filters.from} to {filters.to}</p>
            </CardHeader>
            <CardContent className="p-0">
              {!showResults ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">Click search to load report</div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100 bg-slate-50">
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
                      <Sheet className="h-3.5 w-3.5" /> Excel
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={() => window.print()}>
                      <Printer className="h-3.5 w-3.5" /> Print
                    </Button>
                    <div className="ml-auto relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input className="h-8 w-56 pl-8 text-xs" placeholder="Search particulars..." />
                    </div>
                  </div>
                  <table className="min-w-full text-xs">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-3 py-2 text-left">Particulars</th>
                        <th className="px-3 py-2 text-right">Closing Amount<br />30/06/2026</th>
                        <th className="px-3 py-2 text-right">Opening Amount<br />01/07/2025</th>
                        <th className="px-3 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {structured.map((item, idx) => {
                        if (item.kind === "section") {
                          return (
                            <tr key={item.label + idx} className="bg-slate-100 text-slate-800 font-semibold">
                              <td className="px-3 py-2">{item.label}</td>
                              <td className="px-3 py-2 text-right" />
                              <td className="px-3 py-2 text-right" />
                              <td className="px-3 py-2 text-right" />
                            </tr>
                          )
                        }
                        const amountDiff = item.closing - item.opening
                        if (item.kind === "total" || item.kind === "highlight") {
                          const rowClass =
                            item.kind === "highlight"
                              ? "border-t bg-emerald-50 font-semibold text-emerald-900"
                              : "border-t bg-slate-50 font-semibold text-slate-900"
                          return (
                            <tr key={item.label + idx} className={rowClass}>
                              <td className="px-3 py-2">{item.label}</td>
                              <td className="px-3 py-2 text-right">{formatAmt(item.closing)}</td>
                              <td className="px-3 py-2 text-right">{formatAmt(item.opening)}</td>
                              <td className="px-3 py-2 text-right">{formatAmt(amountDiff)}</td>
                            </tr>
                          )
                        }
                        return (
                          <tr key={item.label + idx} className="border-t">
                            <td className="px-3 py-2 text-slate-700">{item.label}</td>
                            <td className="px-3 py-2 text-right text-slate-900">{formatAmt(item.closing)}</td>
                            <td className="px-3 py-2 text-right text-slate-900">{formatAmt(item.opening)}</td>
                            <td className="px-3 py-2 text-right text-slate-900">{formatAmt(amountDiff)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
