"use client"

import { useMemo, useState } from "react"
import { Menu, Printer, Search } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DaybookRow = {
  voucherNo: string
  date: string
  voucherType: string
  particulars: string
  accountHead: string
  debit: number
  credit: number
}

const sampleRows: DaybookRow[] = [
  {
    voucherNo: "TV24-000200 (1)",
    date: "01/12/2025",
    voucherType: "Journal Voucher",
    particulars:
      "Software Sales to Infinity Clothing LTD as per BRFV PF/BV/AN/INV/0025/25 dated 01/12/2025. Dr GL: 4105 Revenue. Cr: 1101 AR.",
    accountHead: "Software Sales",
    debit: 0,
    credit: 800000,
  },
  {
    voucherNo: "TV24-000201 (1)",
    date: "01/12/2025",
    voucherType: "Journal Voucher",
    particulars:
      "Monthly Service Fee Crypto Web App as per BRFV PF/BV/AN/INV/0026/25 dated 01/12/2025. Dr: 1101 AR. Cr: 4105 Revenue.",
    accountHead: "Software Support Service Sales",
    debit: 0,
    credit: 350000,
  },
  {
    voucherNo: "TV24-000202 (1)",
    date: "01/12/2025",
    voucherType: "Journal Voucher",
    particulars:
      "Crypto Web Application fee to ABC Payroll. Dr: 1101 Accounts Receivable. Cr: 4105 Software Service Revenue.",
    accountHead: "AR Crypto ERP",
    debit: 1040000,
    credit: 0,
  },
  {
    voucherNo: "TV24-000203 (1)",
    date: "01/12/2025",
    voucherType: "Journal Voucher",
    particulars:
      "Bad debt provision reversal for last month. Dr: 1305 Provision. Cr: 4105 Other income.",
    accountHead: "AR Crypto ERP",
    debit: 0,
    credit: 120000,
  },
  {
    voucherNo: "TV24-000204 (1)",
    date: "01/12/2025",
    voucherType: "Journal Voucher",
    particulars:
      "Monthly Service Fee Crypto Web App as per BRFV PF/BV/AN/INV/0027/25 dated 01/12/2025.",
    accountHead: "Software Support Service Sales",
    debit: 0,
    credit: 2100000,
  },
  {
    voucherNo: "TV24-000205 (1)",
    date: "01/12/2025",
    voucherType: "Journal Voucher",
    particulars:
      "Crypto Web Application fee to ABC Payroll. Dr 1101 AR. Cr 4105 Service Revenue.",
    accountHead: "AR Crypto ERP",
    debit: 1304000,
    credit: 0,
  },
  {
    voucherNo: "TV24-000206 (1)",
    date: "01/12/2025",
    voucherType: "Journal Voucher",
    particulars:
      "Payroll management service to Pakiza App. Dr 1101 AR. Cr 4105 Software Service Revenue.",
    accountHead: "Software Support Service Sales",
    debit: 1403000,
    credit: 0,
  },
  {
    voucherNo: "TV24-000207 (1)",
    date: "01/12/2025",
    voucherType: "Journal Voucher",
    particulars:
      "Bad debt provision for AR. Dr: 6105 Bad debt expense. Cr: 1305 Provision for doubtful debt.",
    accountHead: "BR & Other Income",
    debit: 125000,
    credit: 0,
  },
  {
    voucherNo: "TV24-000208 (1)",
    date: "01/12/2025",
    voucherType: "Journal Voucher",
    particulars:
      "Crypto Web App license renewal for Software Support, Dr AR, Cr Sales.",
    accountHead: "AR Crypto ERP",
    debit: 720000,
    credit: 0,
  },
  {
    voucherNo: "TV24-000209 (1)",
    date: "01/12/2025",
    voucherType: "Journal Voucher",
    particulars:
      "Crypto Web App implementation for Pakiza. Dr AR. Cr Software Support Service Sales.",
    accountHead: "Software Support Service Sales",
    debit: 0,
    credit: 700000,
  },
]

const voucherTypes = ["Journal Voucher", "Payment Voucher", "Receipt Voucher"]
const statuses = ["Pending", "Posted"]

export default function DaybookPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [filters, setFilters] = useState({
    from: "2025-12-01",
    to: "2026-01-14",
    ledger: "",
    voucherType: "Journal Voucher",
    status: "Pending",
    search: "",
  })

  const filteredRows = useMemo(() => {
    return sampleRows.filter((row) => {
      const term = filters.search.toLowerCase()
      const matchesSearch =
        !term ||
        row.voucherNo.toLowerCase().includes(term) ||
        row.particulars.toLowerCase().includes(term) ||
        row.accountHead.toLowerCase().includes(term)
      return matchesSearch
    })
  }, [filters.search])

  const totals = filteredRows.reduce(
    (acc, row) => {
      acc.debit += row.debit
      acc.credit += row.credit
      return acc
    },
    { debit: 0, credit: 0 },
  )

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} collapsed={sidebarCollapsed} onClose={() => setSidebarOpen(false)} onToggleCollapse={() => setSidebarCollapsed((p) => !p)} />
      <main className={`flex-1 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-[18rem]"}`}>
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border/40 bg-card/95 backdrop-blur-sm px-4 lg:px-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Reports</p>
              <h1 className="text-sm font-semibold text-foreground">Daybook</h1>
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
                  <Label className="text-xs text-slate-600">Account Ledger</Label>
                  <Input
                    value={filters.ledger}
                    onChange={(e) => setFilters((p) => ({ ...p, ledger: e.target.value }))}
                    className="h-9 text-sm"
                    placeholder="Search ledger"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Voucher Type</Label>
                  <Select value={filters.voucherType} onValueChange={(v) => setFilters((p) => ({ ...p, voucherType: v }))}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {voucherTypes.map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
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
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" className="h-9 px-4 text-sm">Search</Button>
                <Button variant="outline" size="sm" className="h-9 px-4 text-sm">Print</Button>
                <div className="ml-auto relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={filters.search}
                    onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                    placeholder="Search..."
                    className="h-9 w-56 pl-8 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-white">
            <CardHeader className="pb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-sm">Entries</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">Excel</Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">Print</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Voucher</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Voucher Type</th>
                      <th className="px-3 py-2 text-left">Particulars</th>
                      <th className="px-3 py-2 text-left">Account Head</th>
                      <th className="px-3 py-2 text-right">Debit</th>
                      <th className="px-3 py-2 text-right">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, idx) => (
                      <tr key={row.voucherNo + idx} className="border-t">
                        <td className="px-3 py-2 text-blue-700 font-semibold">{row.voucherNo}</td>
                        <td className="px-3 py-2 text-slate-700">{row.date}</td>
                        <td className="px-3 py-2 text-slate-700">{row.voucherType}</td>
                        <td className="px-3 py-2 text-slate-700">{row.particulars}</td>
                        <td className="px-3 py-2 text-slate-700">{row.accountHead}</td>
                        <td className="px-3 py-2 text-right text-slate-900">{row.debit.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-slate-900">{row.credit.toLocaleString()}</td>
                      </tr>
                    ))}
                    {filteredRows.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-3 py-4 text-center text-slate-500">
                          No entries found
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 text-slate-900 font-semibold">
                    <tr className="border-t">
                      <td colSpan={5} className="px-3 py-2 text-right">Total:</td>
                      <td className="px-3 py-2 text-right">{totals.debit.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right">{totals.credit.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <span>Showing {filteredRows.length} of {sampleRows.length} entries</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">Previous</Button>
                  <span className="px-2">1</span>
                  <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
