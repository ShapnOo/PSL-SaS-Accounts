"use client"

import { useMemo, useState } from "react"
import { Menu, Printer, Search, Sheet } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Line = { label: string; depth?: number; amounts: Record<string, number> }
type SectionKind = "section" | "total" | "highlight" | "line"
type Structured =
  | ({ kind: "section" | "total" | "highlight"; label: string } & { amounts?: Record<string, number> })
  | ({ kind: "line"; label: string; depth?: number; amounts: Record<string, number> })

const costCenters = ["Cricton ERP", "Cricton Web & Apps", "Cricton Pro VAT", "Common Services"] as const

const operatingIncome: Line[] = [
  { label: "Software Support Service Sales", depth: 1, amounts: { "Cricton ERP": 12407129, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Software Sales", depth: 1, amounts: { "Cricton ERP": 2486000, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
]

const directExpenses: Line[] = [
  { label: "VAT Adjusted by Customer", depth: 1, amounts: { "Cricton ERP": 67500, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Book Forms Expenses", depth: 1, amounts: { "Cricton ERP": 617500, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Stationery Expenses", depth: 1, amounts: { "Cricton ERP": 112850, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "VAT AIT Expenses", depth: 1, amounts: { "Cricton ERP": 0, "Cricton Web & Apps": 0, "Cricton Pro VAT": 270000, "Common Services": 0 } },
  { label: "Freights, Storage & Courier", depth: 1, amounts: { "Cricton ERP": 0, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 45000 } },
  { label: "Clearing Expenses", depth: 1, amounts: { "Cricton ERP": 0, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 25000 } },
  { label: "Packaging & Supplies", depth: 1, amounts: { "Cricton ERP": 35000, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
]

const indirectExpenses: Line[] = [
  { label: "Conference & Collateral – Office", depth: 1, amounts: { "Cricton ERP": 15000, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 25000 } },
  { label: "Office Salary & Allowance", depth: 1, amounts: { "Cricton ERP": 13294391, "Cricton Web & Apps": 15799568, "Cricton Pro VAT": 3423280, "Common Services": 0 } },
  { label: "Trade Show/Visible Expenses", depth: 1, amounts: { "Cricton ERP": 250000, "Cricton Web & Apps": 945668, "Cricton Pro VAT": 0, "Common Services": 300000 } },
  { label: "Business Promotion", depth: 1, amounts: { "Cricton ERP": 200000, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 300000 } },
  { label: "Inventory Loss", depth: 1, amounts: { "Cricton ERP": 291919, "Cricton Web & Apps": 181274, "Cricton Pro VAT": 0, "Common Services": 200000 } },
  { label: "B & D other – Admin", depth: 1, amounts: { "Cricton ERP": 0, "Cricton Web & Apps": 120000, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "VAT Modification Expenses – Office", depth: 1, amounts: { "Cricton ERP": 6537, "Cricton Web & Apps": 2462, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Office Staff Cost", depth: 1, amounts: { "Cricton ERP": 0, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 1215000 } },
  { label: "Service Charge Office", depth: 1, amounts: { "Cricton ERP": 727481, "Cricton Web & Apps": 125250, "Cricton Pro VAT": 0, "Common Services": 430358 } },
  { label: "Electricity & Water Rent Expenses", depth: 1, amounts: { "Cricton ERP": 0, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 689900 } },
  { label: "Balance Bonus Office", depth: 1, amounts: { "Cricton ERP": 106000, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Office Fuel (Petrol)", depth: 1, amounts: { "Cricton ERP": 0, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 1090000 } },
  { label: "Visa and Taxes", depth: 1, amounts: { "Cricton ERP": 181600, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Leave Salary Allowances – Office", depth: 1, amounts: { "Cricton ERP": 7271182, "Cricton Web & Apps": 1413418, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Attendance Bonus", depth: 1, amounts: { "Cricton ERP": 52500, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 61200 } },
  { label: "Insurance Renewal Expenses", depth: 1, amounts: { "Cricton ERP": 218400, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Office Rent Advance", depth: 1, amounts: { "Cricton ERP": 11464800, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Office Board", depth: 1, amounts: { "Cricton ERP": 48073, "Cricton Web & Apps": 5071, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Office Cleaning Expenses", depth: 1, amounts: { "Cricton ERP": 634780, "Cricton Web & Apps": 215150, "Cricton Pro VAT": 0, "Common Services": 66460 } },
  { label: "Electricity Expenses – Office", depth: 1, amounts: { "Cricton ERP": 5564020, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Marketing Launch Branding Expenses", depth: 1, amounts: { "Cricton ERP": 15714240, "Cricton Web & Apps": 3891031, "Cricton Pro VAT": 0, "Common Services": 13717200 } },
  { label: "IT & Computer Accessories", depth: 1, amounts: { "Cricton ERP": 20749, "Cricton Web & Apps": 13046, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Miscellaneous Expenses – Office", depth: 1, amounts: { "Cricton ERP": 302, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Toll and Parking for Office Transport", depth: 1, amounts: { "Cricton ERP": 1705602, "Cricton Web & Apps": 21526, "Cricton Pro VAT": 0, "Common Services": 257770 } },
  { label: "Office Courier Expenses", depth: 1, amounts: { "Cricton ERP": 0, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Office Staff Visibility Allowances", depth: 1, amounts: { "Cricton ERP": 1206667, "Cricton Web & Apps": 699832, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Printing Stationary Expenses – Office", depth: 1, amounts: { "Cricton ERP": 24689, "Cricton Web & Apps": 41434, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Covid Aid Expenses", depth: 1, amounts: { "Cricton ERP": 0, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 290000 } },
  { label: "Reimbursement Expenses on Office Assets", depth: 1, amounts: { "Cricton ERP": 3671483, "Cricton Web & Apps": 1130483, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Tax & Settlement Expenses – Office", depth: 1, amounts: { "Cricton ERP": 736084, "Cricton Web & Apps": 147274, "Cricton Pro VAT": 0, "Common Services": 85486 } },
  { label: "Internet Bill Expenses", depth: 1, amounts: { "Cricton ERP": 0, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Financial Audit Fees", depth: 1, amounts: { "Cricton ERP": 25595, "Cricton Web & Apps": 113744, "Cricton Pro VAT": 0, "Common Services": 80000 } },
  { label: "Register Book Charges", depth: 1, amounts: { "Cricton ERP": 21549, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Tax Overheads by Customer", depth: 1, amounts: { "Cricton ERP": 0, "Cricton Web & Apps": 0, "Cricton Pro VAT": 1000, "Common Services": 0 } },
  { label: "IT & Office Transport", depth: 1, amounts: { "Cricton ERP": 1000, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 350000 } },
]

const nonOperatingIncome: Line[] = [
  { label: "Other Income", depth: 1, amounts: { "Cricton ERP": 752500, "Cricton Web & Apps": 142200, "Cricton Pro VAT": 50000, "Common Services": 500000 } },
]

const nonOperatingExpenses: Line[] = [
  { label: "Cyber Soul Expenses", depth: 1, amounts: { "Cricton ERP": 75000, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "Social Welfare Expenses", depth: 1, amounts: { "Cricton ERP": 300000, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
  { label: "COVID Awareness Expenses", depth: 1, amounts: { "Cricton ERP": 180000, "Cricton Web & Apps": 0, "Cricton Pro VAT": 0, "Common Services": 0 } },
]

const financialYears = ["2024-2025", "2025-2026", "2026-2027"]
const statuses = ["Approved", "Draft", "All"]
const reportTypes = ["Single Period", "Comparative", "YTD"]

export default function CostCenterIncomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [filters, setFilters] = useState({
    reportType: "Single Period",
    financialYear: "2024-2025",
    status: "Approved",
    from: "2025-07-01",
    to: "2026-06-30",
  })
  const [showResults, setShowResults] = useState(false)

  const sumLines = (lines: Line[]) => {
    const result: Record<string, number> = {}
    costCenters.forEach((cc) => (result[cc] = lines.reduce((sum, l) => sum + (l.amounts[cc] || 0), 0)))
    return result
  }

  const totals = useMemo(() => {
    const totalOperatingIncome = sumLines(operatingIncome)
    const totalDirect = sumLines(directExpenses)
    const grossProfit: Record<string, number> = {}
    costCenters.forEach((cc) => (grossProfit[cc] = (totalOperatingIncome[cc] || 0) - (totalDirect[cc] || 0)))

    const totalIndirect = sumLines(indirectExpenses)
    const operatingAfterIndirect: Record<string, number> = {}
    costCenters.forEach((cc) => (operatingAfterIndirect[cc] = (grossProfit[cc] || 0) - (totalIndirect[cc] || 0)))

    const totalNonOpIncome = sumLines(nonOperatingIncome)
    const totalNonOpExpense = sumLines(nonOperatingExpenses)
    const netBeforeTax: Record<string, number> = {}
    const tax: Record<string, number> = {}
    const netAfterTax: Record<string, number> = {}

    costCenters.forEach((cc) => {
      netBeforeTax[cc] = (operatingAfterIndirect[cc] || 0) + (totalNonOpIncome[cc] || 0) - (totalNonOpExpense[cc] || 0)
      tax[cc] = Math.max(0, netBeforeTax[cc] * 0.02)
      netAfterTax[cc] = netBeforeTax[cc] - tax[cc]
    })

    return {
      totalOperatingIncome,
      totalDirect,
      grossProfit,
      totalIndirect,
      operatingAfterIndirect,
      totalNonOpIncome,
      totalNonOpExpense,
      netBeforeTax,
      tax,
      netAfterTax,
    }
  }, [])

  const structuredLines: Structured[] = useMemo(() => {
    const addTotal = (label: string, amounts: Record<string, number>): Structured => ({ kind: "total", label, amounts })
    const addHighlight = (label: string, amounts: Record<string, number>): Structured => ({ kind: "highlight", label, amounts })
    const addSection = (label: string): Structured => ({ kind: "section", label })
    return [
      addSection("Operating Income"),
      ...operatingIncome.map((l) => ({ kind: "line", ...l } as const)),
      addTotal("Total Operating Income", totals.totalOperatingIncome),

      addSection("Direct Expenses"),
      ...directExpenses.map((l) => ({ kind: "line", ...l } as const)),
      addTotal("Total Direct Expenses", totals.totalDirect),
      addHighlight("Gross Profit/(Loss) (a-b)", totals.grossProfit),

      addSection("Indirect Expenses"),
      ...indirectExpenses.map((l) => ({ kind: "line", ...l } as const)),
      addTotal("Total Indirect Expenses", totals.totalIndirect),
      addHighlight("Total Operating Income (c-d)", totals.operatingAfterIndirect),

      addSection("Non-Operating Income"),
      ...nonOperatingIncome.map((l) => ({ kind: "line", ...l } as const)),
      addTotal("Total Non-Operating Income", totals.totalNonOpIncome),

      addSection("Non-Operating Expenses"),
      ...nonOperatingExpenses.map((l) => ({ kind: "line", ...l } as const)),
      addTotal("Total Non-Operating Expenses", totals.totalNonOpExpense),

      addHighlight("Net Profit/(Loss) Before Tax(f-g)", totals.netBeforeTax),
      { kind: "line", label: "Income Tax (2%)", depth: 1, amounts: totals.tax },
      addHighlight("Net Profit/(Loss) After Tax", totals.netAfterTax),
    ]
  }, [totals])

  const formatAmt = (value: number) => value.toLocaleString()
  const rowTotal = (amounts: Record<string, number> | undefined) =>
    amounts ? costCenters.reduce((sum, cc) => sum + (amounts[cc] || 0), 0) : 0

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
              <h1 className="text-sm font-semibold text-foreground">Cost Center wise Income Statement</h1>
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
                  <Label className="text-xs text-slate-600">Report Type</Label>
                  <Select value={filters.reportType} onValueChange={(v) => setFilters((p) => ({ ...p, reportType: v }))}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Financial Year</Label>
                  <Select value={filters.financialYear} onValueChange={(v) => setFilters((p) => ({ ...p, financialYear: v }))}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {financialYears.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
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
              <p className="text-xs text-slate-600 font-semibold">Statement of Comprehensive Income</p>
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
                      <Input className="h-8 w-56 pl-8 text-xs" placeholder="Search accounts..." />
                    </div>
                  </div>
                  <table className="min-w-full text-xs">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-3 py-2 text-left">Accounts Head</th>
                        {costCenters.map((cc) => (
                          <th key={cc} className="px-3 py-2 text-right">{cc}</th>
                        ))}
                        <th className="px-3 py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {structuredLines.map((item, idx) => {
                        if (item.kind === "section") {
                          return (
                            <tr key={item.label + idx} className="bg-slate-100 text-slate-800 font-semibold">
                              <td className="px-3 py-2">{item.label}</td>
                              {costCenters.map((cc) => (
                                <td key={cc} className="px-3 py-2 text-right" />
                              ))}
                              <td className="px-3 py-2 text-right" />
                            </tr>
                          )
                        }
                        if (item.kind === "total" || item.kind === "highlight") {
                          const total = rowTotal(item.amounts)
                          return (
                            <tr
                              key={item.label + idx}
                              className={
                                item.kind === "highlight"
                                  ? "border-t bg-emerald-50 font-semibold text-emerald-900"
                                  : "border-t bg-slate-50 font-semibold text-slate-900"
                              }
                            >
                              <td className="px-3 py-2">{item.label}</td>
                              {costCenters.map((cc) => (
                                <td key={cc} className="px-3 py-2 text-right">
                                  {formatAmt(item.amounts?.[cc] ?? 0)}
                                </td>
                              ))}
                              <td className="px-3 py-2 text-right">{formatAmt(total)}</td>
                            </tr>
                          )
                        }
                        const rowTot = rowTotal(item.amounts)
                        return (
                          <tr key={item.label + idx} className="border-t">
                            <td className="px-3 py-2 text-slate-700" style={{ paddingLeft: `${(item.depth ?? 0) * 16}px` }}>
                              {item.label}
                            </td>
                            {costCenters.map((cc) => (
                              <td key={cc} className="px-3 py-2 text-right text-slate-900">
                                {formatAmt(item.amounts[cc] ?? 0)}
                              </td>
                            ))}
                            <td className="px-3 py-2 text-right text-slate-900">{formatAmt(rowTot)}</td>
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
