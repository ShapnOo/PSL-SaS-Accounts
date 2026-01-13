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

const operatingIncome: Line[] = [
  { label: "Software Support Service Sales", amount: 1684719, depth: 1 },
  { label: "Software Sales", amount: 2486000, depth: 1 },
]

const directExpenses: Line[] = [
  { label: "VAT Adjusted by Customer", amount: 31225, depth: 1 },
  { label: "Book Forms Expenses", amount: 84250, depth: 1 },
  { label: "Stationery Expenses", amount: 22429, depth: 1 },
  { label: "VAT AIT Expenses", amount: 52400, depth: 1 },
  { label: "Freights, Storage & Courier", amount: 39120, depth: 1 },
]

const indirectExpenses: Line[] = [
  { label: "Conference & Collateral – Office", amount: 25000, depth: 1 },
  { label: "Office Salary & Allowance", amount: 3051500, depth: 1 },
  { label: "Trade Show/Visible Expenses", amount: 741000, depth: 1 },
  { label: "Business Promotion", amount: 260000, depth: 1 },
  { label: "Inventory Loss", amount: 480000, depth: 1 },
  { label: "B & D other – Admin", amount: 75000, depth: 1 },
  { label: "VAT Modification Expenses – Office", amount: 75000, depth: 1 },
  { label: "Office Staff Cost", amount: 1215000, depth: 1 },
  { label: "Service Charge Office", amount: 157800, depth: 1 },
  { label: "Electricity & Water Rent Expenses", amount: 128100, depth: 1 },
  { label: "Balance Bonus Office", amount: 106000, depth: 1 },
  { label: "Office Fuel (Petrol)", amount: 597400, depth: 1 },
  { label: "Visa and Taxes", amount: 181600, depth: 1 },
  { label: "Leave Salary Allowances – Office", amount: 1414163, depth: 1 },
  { label: "Attendance Bonus", amount: 52500, depth: 1 },
  { label: "Insurance Renewal Expenses", amount: 218400, depth: 1 },
  { label: "Office Rent Advance", amount: 11464800, depth: 1 },
  { label: "Office Internet Expenses", amount: 93792, depth: 1 },
  { label: "Office Board", amount: 3157400, depth: 1 },
  { label: "Office Cleaning Expenses", amount: 616800, depth: 1 },
  { label: "Electricity Expenses – Office", amount: 777820, depth: 1 },
  { label: "Marketing Launch Branding Expenses", amount: 3179120, depth: 1 },
  { label: "It & Computer Accessories", amount: 1321600, depth: 1 },
  { label: "Miscellaneous Expenses – Office", amount: 376420, depth: 1 },
  { label: "Toll and Parking for Office Transport", amount: 279600, depth: 1 },
  { label: "Office Courier Expenses", amount: 1470910, depth: 1 },
  { label: "Office Staff Visibility Allowances", amount: 185470, depth: 1 },
  { label: "Recruitment Expenses – Office", amount: 42600, depth: 1 },
  { label: "Covid Aid Expenses", amount: 750100, depth: 1 },
  { label: "Reimbursement Expenses on Office Asset", amount: 4131540, depth: 1 },
  { label: "Tax & Settlement Expenses – Office", amount: 84680, depth: 1 },
  { label: "Internet Bill Expenses", amount: 240600, depth: 1 },
  { label: "Financial Audit Fees", amount: 615000, depth: 1 },
  { label: "Register Book Charges", amount: 30200, depth: 1 },
  { label: "Tax Overheads by Customer", amount: 100000, depth: 1 },
  { label: "IT & Office Transport", amount: 120000, depth: 1 },
  { label: "Guest/Heavy Transport – Office", amount: 422580, depth: 1 },
]

const nonOperatingIncome: Line[] = [
  { label: "Other Income", amount: 500000, depth: 1 },
  { label: "Reversal of Accruals", amount: 200000, depth: 1 },
]

const nonOperatingExpenses: Line[] = [
  { label: "Cyber Soul Expenses", amount: 154000, depth: 1 },
  { label: "Social Welfare Expenses", amount: 300000, depth: 1 },
  { label: "COVID Awareness Expenses", amount: 180000, depth: 1 },
]

const financialYears = ["2024-2025", "2025-2026", "2026-2027"]
const statuses = ["Approved", "Draft", "All"]
const reportTypes = ["Single Period", "Comparative", "YTD"]

export default function IncomeStatementPage() {
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

  const totals = useMemo(() => {
    const totalOperatingIncome = operatingIncome.reduce((sum, l) => sum + l.amount, 0)
    const totalDirect = directExpenses.reduce((sum, l) => sum + l.amount, 0)
    const grossProfit = totalOperatingIncome - totalDirect
    const totalIndirect = indirectExpenses.reduce((sum, l) => sum + l.amount, 0)
    const operatingIncomeAfterIndirect = grossProfit - totalIndirect
    const totalNonOperatingIncome = nonOperatingIncome.reduce((sum, l) => sum + l.amount, 0)
    const totalNonOperatingExpenses = nonOperatingExpenses.reduce((sum, l) => sum + l.amount, 0)
    const netBeforeTax = operatingIncomeAfterIndirect + totalNonOperatingIncome - totalNonOperatingExpenses
    const tax = Math.max(0, netBeforeTax * 0.02)
    const netAfterTax = netBeforeTax - tax

    return {
      totalOperatingIncome,
      totalDirect,
      grossProfit,
      totalIndirect,
      operatingIncomeAfterIndirect,
      totalNonOperatingIncome,
      totalNonOperatingExpenses,
      netBeforeTax,
      tax,
      netAfterTax,
    }
  }, [])

  const formatAmt = (num: number) => num.toLocaleString()

  const structuredLines = useMemo(() => {
    return [
      { kind: "section", label: "Operating Income" } as const,
      ...operatingIncome.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "total", label: "Total Operating Income", amount: totals.totalOperatingIncome } as const,

      { kind: "section", label: "Direct Expenses" } as const,
      ...directExpenses.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "total", label: "Total Direct Expenses", amount: totals.totalDirect } as const,
      { kind: "highlight", label: "Gross Profit / (Loss) (a-b)", amount: totals.grossProfit } as const,

      { kind: "section", label: "Indirect Expenses" } as const,
      ...indirectExpenses.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "total", label: "Total Indirect Expenses", amount: totals.totalIndirect } as const,
      { kind: "highlight", label: "Operating Income After Indirect", amount: totals.operatingIncomeAfterIndirect } as const,

      { kind: "section", label: "Non-Operating Income" } as const,
      ...nonOperatingIncome.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "total", label: "Total Non-Operating Income", amount: totals.totalNonOperatingIncome } as const,

      { kind: "section", label: "Non-Operating Expenses" } as const,
      ...nonOperatingExpenses.map((l) => ({ kind: "line", ...l } as const)),
      { kind: "total", label: "Total Non-Operating Expenses", amount: totals.totalNonOperatingExpenses } as const,

      { kind: "highlight", label: "Net Profit / (Loss) Before Tax", amount: totals.netBeforeTax } as const,
      { kind: "line", label: "Income Tax (2%)", amount: totals.tax, depth: 1 } as const,
      { kind: "highlight", label: "Net Profit / (Loss) After Tax", amount: totals.netAfterTax } as const,
    ]
  }, [totals])

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
              <h1 className="text-sm font-semibold text-foreground">Income Statement</h1>
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
                      <Input className="h-8 w-48 pl-8 text-xs" placeholder="Search accounts..." />
                    </div>
                  </div>
                  <table className="min-w-full text-xs">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-3 py-2 text-left">Accounts Head</th>
                        <th className="px-3 py-2 text-right">Amount</th>
                        <th className="px-3 py-2 text-right">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {structuredLines.map((item, idx) => {
                        if (item.kind === "section") {
                          return (
                            <tr key={item.label + idx} className="bg-slate-100 text-slate-800 font-semibold">
                              <td className="px-3 py-2">{item.label}</td>
                              <td className="px-3 py-2 text-right"> </td>
                              <td className="px-3 py-2 text-right"> </td>
                            </tr>
                          )
                        }
                        if (item.kind === "total") {
                          return (
                            <tr key={item.label + idx} className="border-t bg-slate-50 font-semibold text-slate-900">
                              <td className="px-3 py-2">{item.label}</td>
                              <td className="px-3 py-2 text-right">{formatAmt(item.amount)}</td>
                              <td className="px-3 py-2 text-right">{formatAmt(item.amount)}</td>
                            </tr>
                          )
                        }
                        if (item.kind === "highlight") {
                          return (
                            <tr key={item.label + idx} className="border-t bg-emerald-50 font-semibold text-emerald-900">
                              <td className="px-3 py-2">{item.label}</td>
                              <td className="px-3 py-2 text-right">{formatAmt(item.amount)}</td>
                              <td className="px-3 py-2 text-right">{formatAmt(item.amount)}</td>
                            </tr>
                          )
                        }
                        return (
                          <tr key={item.label + idx} className="border-t">
                            <td className="px-3 py-2 text-slate-700" style={{ paddingLeft: `${(item.depth ?? 0) * 16}px` }}>
                              {item.label}
                            </td>
                            <td className="px-3 py-2 text-right text-slate-900">{formatAmt(item.amount)}</td>
                            <td className="px-3 py-2 text-right text-slate-900">{formatAmt(item.amount)}</td>
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

function Section({ title }: { title: string }) {
  return (
    <tr className="bg-slate-100 text-slate-800 font-semibold">
      <td className="px-3 py-2">{title}</td>
      <td className="px-3 py-2 text-right"> </td>
    </tr>
  )
}

function Row({ label, amount }: { label: string; amount: number }) {
  return (
    <tr className="border-t">
      <td className="px-3 py-2 text-slate-700">{label}</td>
      <td className="px-3 py-2 text-right text-slate-900">{amount.toLocaleString()}</td>
    </tr>
  )
}

function TotalRow({ label, amount }: { label: string; amount: number }) {
  return (
    <tr className="border-t bg-slate-50 font-semibold text-slate-900">
      <td className="px-3 py-2">{label}</td>
      <td className="px-3 py-2 text-right">{amount.toLocaleString()}</td>
    </tr>
  )
}

function HighlightRow({ label, amount }: { label: string; amount: number }) {
  return (
    <tr className="border-t bg-emerald-50 font-semibold text-emerald-900">
      <td className="px-3 py-2">{label}</td>
      <td className="px-3 py-2 text-right">{amount.toLocaleString()}</td>
    </tr>
  )
}
