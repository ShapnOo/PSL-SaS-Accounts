"use client"

import { useState } from "react"
import { Menu, Printer, Search, Sheet } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Entry = { label: string; amount: number }

const receiptEntries: Entry[] = [
  { label: "Cash in Hand C/D", amount: 6163.03 },
  { label: "Cash in Hand BD C/D", amount: 0 },
  { label: "Pakiza Knit Composite Ltd-PKCL", amount: 2138748.99 },
  { label: "Advance Adjustment – Expenses", amount: 825675 },
  { label: "AR Cricton ERP", amount: 38463.04 },
  { label: "AR Cricton Web & Apps", amount: 35000 },
  { label: "Inter Company Current Account", amount: 52367.4 },
  { label: "Employee Lunch Subsidy Expenses", amount: 2500 },
  { label: "Office Rent", amount: 113700 },
  { label: "Pakiza Technovation Ltd-PTVL", amount: 21190 },
  { label: "Procurement", amount: 51490 },
  { label: "Salary Advance (Advance Against Salary)", amount: 5000 },
]

const paymentEntries: Entry[] = [
  { label: "Rent Expenses", amount: 106450.86 },
  { label: "Employee Lunch Allowances – Office", amount: 12045.83 },
  { label: "Advance Against Expenses (IOU)", amount: 9065.22 },
  { label: "Advance Against Vehicle Fuel", amount: 18720 },
  { label: "Advance to Suppliers", amount: 17100 },
  { label: "Stationary Bills Payable", amount: 3150 },
  { label: "AR Cricton ERP", amount: 1113680 },
  { label: "Electricity Bills Payable/Wasa Bill Payable", amount: 1465.34 },
  { label: "Employee Funeral Expenses", amount: 10000 },
  { label: "Employee Lunch Subsidy Expenses", amount: 9415.26 },
  { label: "Employee Lunch Subsidy Expenses Office Conveyance Expenses", amount: 21247.44 },
  { label: "Employee Lunch Subsidy Expenses Toll and Parking fee Office Transport Office Conveyance Expenses", amount: 8434.02 },
  { label: "PV-Set Configuration Expenses & Renewal Charge", amount: 13707.09 },
  { label: "Electricity Expenses – Office", amount: 330000 },
  { label: "WPP Renewal Expenses", amount: 12 },
  { label: "Office Conference Room", amount: 50 },
  { label: "Office Conference Room Office Rental Expenses", amount: 10000 },
  { label: "Office Conference Room Office Rental Expenses employee lunch subsidy expenses", amount: 74274.82 },
  { label: "Office Conference Room Office Rental Expenses Other Expenses", amount: 20417.78 },
  { label: "Office Conference Room Office Rental Expenses", amount: 10000 },
  { label: "Pakiza Knit Composite Ltd-PKCL", amount: 1579059.1 },
  { label: "Pakiza Knit Apparel Limited-PAL", amount: 3250000 },
  { label: "Pakiza Technovation Ltd-PTVL", amount: 2050000 },
  { label: "Pakiza Apparels Ltd-PAL", amount: 1500000 },
  { label: "Shiney Apparels Ltd-PAL", amount: 2000000 },
  { label: "Salary Advance (Advance Against Salary)", amount: 20000 },
  { label: "Salary Advance and Allowances Payable", amount: 4000 },
  { label: "Security Deposit Office setup", amount: 3000 },
  { label: "Employee Luncheon Wage and Allowance Payable", amount: 1407472 },
  { label: "Office Rent Office Expense", amount: 50000 },
  { label: "Registration Expenses Office Expenses", amount: 31450 },
  { label: "Tax & Reimbursement Expenses Office", amount: 76676.74 },
  { label: "Tax & Reimbursement Expenses Office Pakiza Knit Composite Ltd- PKCL", amount: 0 },
  { label: "Tax & Reimbursement Expenses Office Toll and Parking fee Office Transport Office Expenses", amount: 0 },
  { label: "Tax & Reimbursement Expenses Office Employee Lunch Subsidy Expenses Pakiza Knit", amount: 0 },
  { label: "Pakiza Knit Composite Ltd-PKCL", amount: 1260 },
  { label: "Pakiza Knit Apparels Limited-PAL", amount: 0 },
  { label: "Pakiza Technovation Ltd-PTVL", amount: 0 },
]

const years = ["2025-2026", "2024-2025", "2026-2027"]
const statuses = ["Approved", "Draft", "All"]

export default function ReceiptPaymentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [filters, setFilters] = useState({
    year: "2025-2026",
    status: "Approved",
    from: "2025-07-01",
    to: "2026-06-30",
  })
  const [showResults, setShowResults] = useState(false)

  const receiptTotal = receiptEntries.reduce((sum, r) => sum + r.amount, 0)
  const paymentTotal = paymentEntries.reduce((sum, r) => sum + r.amount, 0)

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
              <h1 className="text-sm font-semibold text-foreground">Receipt & Payment Statement</h1>
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
                      {years.map((y) => (
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
              <p className="text-xs text-slate-600 font-semibold">Receipt & Payment Statement</p>
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
                      <Input className="h-8 w-56 pl-8 text-xs" placeholder="Search receipt/payment..." />
                    </div>
                  </div>
                  <table className="min-w-full text-xs">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-3 py-2 text-left">Receipt</th>
                        <th className="px-3 py-2 text-right">Amount</th>
                        <th className="px-3 py-2 text-left">Payment</th>
                        <th className="px-3 py-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: Math.max(receiptEntries.length, paymentEntries.length) }).map((_, idx) => {
                        const receipt = receiptEntries[idx]
                        const payment = paymentEntries[idx]
                        return (
                          <tr key={idx} className="border-t">
                            <td className="px-3 py-2 text-blue-700 font-semibold underline underline-offset-2">{receipt?.label ?? ""}</td>
                            <td className="px-3 py-2 text-right text-slate-900">{receipt ? receipt.amount.toLocaleString() : ""}</td>
                            <td className="px-3 py-2 text-blue-700 font-semibold underline underline-offset-2">{payment?.label ?? ""}</td>
                            <td className="px-3 py-2 text-right text-slate-900">{payment ? payment.amount.toLocaleString() : ""}</td>
                          </tr>
                        )
                      })}
                      <tr className="border-t bg-slate-50 font-semibold text-slate-900">
                        <td className="px-3 py-2">Dr. total</td>
                        <td className="px-3 py-2 text-right">{receiptTotal.toLocaleString()}</td>
                        <td className="px-3 py-2">Cr. Total</td>
                        <td className="px-3 py-2 text-right">{paymentTotal.toLocaleString()}</td>
                      </tr>
                      <tr className="border-t bg-slate-100 font-semibold text-slate-900">
                        <td className="px-3 py-2">Cash at Bank C/D</td>
                        <td className="px-3 py-2 text-right">2276978.3</td>
                        <td className="px-3 py-2">Cash at Bank C/D</td>
                        <td className="px-3 py-2 text-right">2276978.3</td>
                      </tr>
                      <tr className="border-t bg-slate-100 font-semibold text-slate-900">
                        <td className="px-3 py-2">Cash in Hand C/D</td>
                        <td className="px-3 py-2 text-right">0</td>
                        <td className="px-3 py-2">Cash in Hand C/D</td>
                        <td className="px-3 py-2 text-right">0</td>
                      </tr>
                      <tr className="border-t bg-slate-50 font-semibold text-slate-900">
                        <td className="px-3 py-2">Grand Total</td>
                        <td className="px-3 py-2 text-right">{(receiptTotal + 2276978.3).toLocaleString()}</td>
                        <td className="px-3 py-2">Grand Total</td>
                        <td className="px-3 py-2 text-right">{(paymentTotal + 2276978.3).toLocaleString()}</td>
                      </tr>
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
