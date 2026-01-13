"use client"

import { useMemo, useState } from "react"
import { Menu, Printer, Search, Sheet } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Entry = {
  date: string
  voucher: string
  accountCode: string
  accountName: string
  amount: number
}

const statusOptions = ["All", "Posted", "Draft"]

const receipts: Entry[] = [
  { date: "15/12/2025", voucher: "CP12-250010", accountCode: "9010105006", accountName: "Office Rent", amount: 2500 },
  { date: "21/12/2025", voucher: "CP12-250013", accountCode: "1010700001", accountName: "AR Cricton ERP", amount: 100000 },
  { date: "30/12/2025", voucher: "CP12-250019", accountCode: "1010901008", accountName: "Pixumart", amount: 125000 },
  { date: "14/12/2025", voucher: "CP12-250018", accountCode: "1010901007", accountName: "AR Cricton Web & Apps", amount: 90000 },
  { date: "15/12/2025", voucher: "CP12-250012", accountCode: "1010901008", accountName: "Pixumart", amount: 100000 },
  { date: "21/12/2025", voucher: "CP12-250017", accountCode: "1010700001", accountName: "AR Cricton ERP", amount: 149000 },
  { date: "04/12/2025", voucher: "CP12-250004", accountCode: "1010702003", accountName: "Cheques in Hand (Petty Cash)", amount: 100000 },
  { date: "18/12/2025", voucher: "CP12-250015", accountCode: "1010700001", accountName: "AR Cricton ERP", amount: 140000 },
  { date: "07/12/2025", voucher: "CP12-250011", accountCode: "1010901007", accountName: "Pakiza Knit Composite Ltd.-PK", amount: 2847940.4 },
  { date: "21/12/2025", voucher: "CP12-250020", accountCode: "1010202003", accountName: "Cheques in Hand (Petty Cash)", amount: 2300000 },
  { date: "29/12/2025", voucher: "TV12-250024", accountCode: "9010105006", accountName: "Office Rent,Office Rent,Service", amount: 3032440 },
  { date: "31/12/2025", voucher: "CR12-250015", accountCode: "1010700001", accountName: "AR Cricton ERP", amount: 85024.4 },
  { date: "29/12/2025", voucher: "CR12-250011", accountCode: "1010901008", accountName: "Pixumart", amount: 23499.9 },
  { date: "29/12/2025", voucher: "CP12-250017", accountCode: "1010901007", accountName: "Pakiza Knit Composite Ltd.-PK", amount: 200000 },
  { date: "21/12/2025", voucher: "CP12-250014", accountCode: "1010801008", accountName: "Pixumart", amount: 110017.7 },
  { date: "21/12/2025", voucher: "CP12-250016", accountCode: "1010202003", accountName: "Salary Advance (Advance Against)", amount: 1 },
  { date: "04/12/2025", voucher: "CP12-250002", accountCode: "1010901008", accountName: "Pixumart", amount: 50000 },
]

const payments: Entry[] = [
  { date: "6/12/2025", voucher: "CP12-250014", accountCode: "1010101006", accountName: "Advance Against Expenses (IOU)", amount: 20000 },
  { date: "4/12/2025", voucher: "CP12-250013", accountCode: "9010105006", accountName: "Office Rent", amount: 109272.02 },
  { date: "17/12/2025", voucher: "CP12-250034", accountCode: "9010501067,9010105022", accountName: "Office Conveyance Expenses,Emp", amount: 731.2 },
  { date: "31/12/2025", voucher: "CP12-250051", accountCode: "9010105017", accountName: "Advance Against Expenses (IOU)", amount: 70000 },
  { date: "14/12/2025", voucher: "CP12-250026", accountCode: "9010105017", accountName: "Office Conveyance Expenses", amount: 790 },
  { date: "4/12/2025", voucher: "CP12-250014", accountCode: "9010105017", accountName: "Office Conveyance Expenses", amount: 2400 },
  { date: "25/12/2025", voucher: "CP12-250042", accountCode: "9010501067,9010105022", accountName: "Office Conveyance Expenses", amount: 17300 },
  { date: "14/12/2025", voucher: "CP12-250028", accountCode: "9010105017", accountName: "Advance Against Vehicle Fuel", amount: 50000 },
  { date: "23/12/2025", voucher: "CP12-250036", accountCode: "1010101006", accountName: "Advance Against Expenses (IOU)", amount: 8000 },
  { date: "29/12/2025", voucher: "CP12-250045", accountCode: "1010101006", accountName: "Advance Against Expenses (IOU)", amount: 5000 },
  { date: "31/12/2025", voucher: "CP12-250049", accountCode: "1010101006", accountName: "Employee Lunch Subsidy Expenses", amount: 1370 },
  { date: "30/12/2025", voucher: "CP12-250048", accountCode: "9010101002,9010101007", accountName: "Tea & Refreshment Expenses", amount: 2676 },
  { date: "6/12/2025", voucher: "CP12-250018", accountCode: "1010101006", accountName: "Advance Against Expenses (IOU)", amount: 9065.22 },
  { date: "28/12/2025", voucher: "CP12-250044", accountCode: "9010105017", accountName: "Office Conveyance Expenses", amount: 500 },
  { date: "25/12/2025", voucher: "CP12-250043", accountCode: "9010105017", accountName: "Office Conveyance Expenses", amount: 1660 },
  { date: "21/12/2025", voucher: "CP12-250040", accountCode: "9010101003", accountName: "Advance Against Vehicle Fuel", amount: 8000 },
  { date: "4/12/2025", voucher: "CP12-250009", accountCode: "9010105006,9010105017", accountName: "Salary Advance (Advance Against Salary)", amount: 4000 },
]

const formatAmount = (value: number) => value.toLocaleString()

export default function CashBookPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [filters, setFilters] = useState({
    from: "2025-12-01",
    to: "2026-01-13",
    account: "1010101001 - Petty Cash in Hand",
    status: "All",
  })
  const [showResults, setShowResults] = useState(false)
  const receiptTotal = useMemo(() => receipts.reduce((sum, r) => sum + r.amount, 0), [])
  const paymentTotal = useMemo(() => payments.reduce((sum, r) => sum + r.amount, 0), [])

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
              <h1 className="text-sm font-semibold text-foreground">Cash Book</h1>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-sm">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Date From</Label>
                  <Input
                    type="date"
                    value={filters.from}
                    onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Date To</Label>
                  <Input
                    type="date"
                    value={filters.to}
                    onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Account Name</Label>
                  <Input
                    value={filters.account}
                    onChange={(e) => setFilters((p) => ({ ...p, account: e.target.value }))}
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
                      {statusOptions.map((s) => (
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
                    Print
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-4">
            <LedgerTable title="Receipts" entries={receipts} showResults={showResults} total={receiptTotal} />
            <LedgerTable title="Payments" entries={payments} showResults={showResults} total={paymentTotal} />
          </div>
        </div>
      </main>
    </div>
  )
}

function LedgerTable({ title, entries, showResults, total }: { title: string; entries: Entry[]; showResults: boolean; total: number }) {
  return (
    <Card className="border border-border/70 bg-white">
      <CardHeader className="pb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-sm">{title}</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-2">
            <Sheet className="h-3.5 w-3.5" /> Excel
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" /> Print
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {!showResults ? (
          <div className="px-4 py-6 text-center text-sm text-slate-500">Click search to load {title.toLowerCase()}</div>
        ) : (
          <>
            <div className="flex items-center justify-end px-3 py-2 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input className="h-8 w-48 pl-8 text-xs" placeholder="Search..." />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left">#</th>
                    <th className="px-3 py-2 text-left">Date</th>
                    <th className="px-3 py-2 text-left">Voucher No</th>
                    <th className="px-3 py-2 text-left">Account Code</th>
                    <th className="px-3 py-2 text-left">Account Name</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr key={entry.voucher + idx} className="border-t">
                      <td className="px-3 py-2 text-slate-700">{idx + 1}</td>
                      <td className="px-3 py-2 text-slate-700">{entry.date}</td>
                      <td className="px-3 py-2 text-blue-700 font-semibold underline underline-offset-2">{entry.voucher}</td>
                      <td className="px-3 py-2 text-slate-700">{entry.accountCode}</td>
                      <td className="px-3 py-2 text-slate-700">{entry.accountName}</td>
                      <td className="px-3 py-2 text-right text-slate-900">{formatAmount(entry.amount)}</td>
                    </tr>
                  ))}
                  {entries.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-3 py-4 text-center text-slate-500">No entries found</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-slate-50 text-slate-900 font-semibold">
                  <tr className="border-t">
                    <td colSpan={5} className="px-3 py-2 text-right">Total</td>
                    <td className="px-3 py-2 text-right">{formatAmount(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <span>Showing {entries.length} entries</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">Previous</Button>
                <span className="px-2">1</span>
                <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">Next</Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
