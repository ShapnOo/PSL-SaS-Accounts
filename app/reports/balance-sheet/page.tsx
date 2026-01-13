"use client"

import { useMemo, useState } from "react"
import { Menu, Printer, Search, Sheet } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Line = { label: string; amount: number; depth?: number }
type Structured =
  | { kind: "section"; label: string }
  | { kind: "total" | "highlight"; label: string; amount: number }
  | { kind: "line"; label: string; amount: number; depth?: number }

const statusOptions = ["Approved", "Draft", "All"]

const nonCurrentAssets: Line[] = [
  { label: "Properties, Plant & Equipment", amount: 13129800, depth: 1 },
  { label: "Furniture, Fixtures & Fittings", amount: 8159143, depth: 1 },
  { label: "Accumulated Depreciations & Amortizations", amount: -10483139, depth: 1 },
]

const currentAssets: Line[] = [
  { label: "Advance & Pre-Payments", amount: 3115464, depth: 1 },
  { label: "Other Receivables", amount: 2228960, depth: 1 },
  { label: "Cash & Cash Equivalent", amount: -2749, depth: 1 },
  { label: "Inter Company Current Account", amount: 2000, depth: 1 },
]

const shareholderEquity: Line[] = [
  { label: "Share Capital", amount: 10000000, depth: 1 },
  { label: "Reserves & Surplus", amount: 417, depth: 1 },
]

const accumulatedPnL: Line[] = [
  { label: "Opening Balance", amount: -115408192, depth: 1 },
  { label: "Profit and Loss during the Period", amount: -6247341, depth: 1 },
]

const currentLiabilities: Line[] = [
  { label: "Accounts Payable – Expenses", amount: 5859208, depth: 1 },
  { label: "Accounts Payable – Capital Expenditure", amount: 50000, depth: 1 },
  { label: "Payable for Statutory", amount: 77040, depth: 1 },
  { label: "Unearned Revenue", amount: 33164, depth: 1 },
  { label: "Inter Company Current Account", amount: 15351448, depth: 1 },
]

export default function BalanceSheetPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [filters, setFilters] = useState({
    status: "Approved",
    asOnDate: "2026-11-13",
  })
  const [showResults, setShowResults] = useState(false)

  const structured: Structured[] = useMemo(() => {
    const totalNonCurrent = nonCurrentAssets.reduce((sum, l) => sum + l.amount, 0)
    const totalCurrentAssets = currentAssets.reduce((sum, l) => sum + l.amount, 0)
    const totalAssets = totalNonCurrent + totalCurrentAssets

    const totalShareholderEquity = shareholderEquity.reduce((sum, l) => sum + l.amount, 0)
    const totalAccumulated = accumulatedPnL.reduce((sum, l) => sum + l.amount, 0)
    const totalEquity = totalShareholderEquity + totalAccumulated

    const totalCurrentLiabilities = currentLiabilities.reduce((sum, l) => sum + l.amount, 0)
    const totalLiabilities = totalCurrentLiabilities // no non-current in demo
    const totalEquityLiabilities = totalEquity + totalLiabilities

    return [
      { kind: "section", label: "Assets" },
      { kind: "section", label: "Non Current assets" },
      ...nonCurrentAssets.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "total", label: "(A) Total Non Current Assets", amount: totalNonCurrent },
      { kind: "section", label: "Current assets" },
      ...currentAssets.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "total", label: "(B) Total Current assets", amount: totalCurrentAssets },
      { kind: "highlight", label: "Total Assets (A+B)", amount: totalAssets },

      { kind: "section", label: "Equity & Liabilities" },
      { kind: "section", label: "Shareholder Equity" },
      ...shareholderEquity.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "section", label: "Accumulated Profit and Loss" },
      ...accumulatedPnL.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "total", label: "(C) Total Shareholder Equity", amount: totalEquity },

      { kind: "section", label: "Current Liabilities" },
      ...currentLiabilities.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "total", label: "(D) Total Current Liabilities", amount: totalCurrentLiabilities },

      { kind: "highlight", label: "Total Equity & Liabilities (C+D)", amount: totalEquityLiabilities },
    ]
  }, [])

  const formatAmt = (num: number) => num.toLocaleString()

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
              <h1 className="text-sm font-semibold text-foreground">Balance Sheet</h1>
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Status</Label>
                  <Select value={filters.status} onValueChange={(v) => setFilters((p) => ({ ...p, status: v }))}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">As on Date</Label>
                  <Input
                    type="date"
                    value={filters.asOnDate}
                    onChange={(e) => setFilters((p) => ({ ...p, asOnDate: e.target.value }))}
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
              <p className="text-xs text-slate-600 font-semibold">Statement of Financial Position</p>
              <p className="text-xs text-slate-500">As on {filters.asOnDate}</p>
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
                      <Input className="h-8 w-48 pl-8 text-xs" placeholder="Search accounts..." />
                    </div>
                  </div>
                    <table className="min-w-full text-xs">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 text-left">Accounts Head</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                          <th className="px-3 py-2 text-right">Amount</th>
                          <th className="px-3 py-2 text-right">Total Amount</th>
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
                                <td className="px-3 py-2 text-right">{formatAmt(0)}</td>
                              </tr>
                            )
                          }
                          if (item.kind === "total" || item.kind === "highlight") {
                            const className =
                              item.kind === "highlight"
                                ? "border-t bg-emerald-50 font-semibold text-emerald-900"
                                : "border-t bg-slate-50 font-semibold text-slate-900"
                            return (
                              <tr key={item.label + idx} className={className}>
                                <td className="px-3 py-2">{item.label}</td>
                                <td className="px-3 py-2 text-right" />
                                <td className="px-3 py-2 text-right" />
                                <td className="px-3 py-2 text-right">{formatAmt(item.amount)}</td>
                              </tr>
                            )
                          }
                          return (
                            <tr key={item.label + idx} className="border-t">
                              <td className="px-3 py-2 text-blue-700 font-semibold underline underline-offset-2" style={{ paddingLeft: `${(item.depth ?? 0) * 16}px` }}>
                                {item.label}
                              </td>
                              <td className="px-3 py-2 text-right text-slate-900">{formatAmt(item.amount)}</td>
                              <td className="px-3 py-2 text-right text-slate-900" />
                              <td className="px-3 py-2 text-right text-slate-900" />
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
