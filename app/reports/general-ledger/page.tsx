"use client"

import { useMemo, useState } from "react"
import { Menu, Printer, Search, Sheet } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type GroupRow = {
  groupCode: string
  groupName: string
  opening: number
  debit: number
  credit: number
  closing: number
}

type LedgerRow = {
  voucherNo: string
  refNo: string
  voucherDate: string
  accountCode: string
  accountName: string
  particulars: string
  subsidiaryType?: string
  subsidiaryName?: string
  currency: string
  debit: number
  credit: number
  balance: number
}

const groupRows: GroupRow[] = [
  { groupCode: "904", groupName: "Non-Operating Expenses", opening: 95000, debit: 0, credit: 0, closing: 95000 },
  { groupCode: "901", groupName: "Operating Expenses", opening: 17304913.91, debit: 250850, credit: 0, closing: 17555763.91 },
  { groupCode: "905", groupName: "Tax Expenses", opening: 214000, debit: 0, credit: 0, closing: 214000 },
]

const ledgerRows: LedgerRow[] = [
  {
    voucherNo: "CP12-250017",
    refNo: "101",
    voucherDate: "30/12/2025",
    accountCode: "9010105006",
    accountName: "Office Rent",
    particulars: "Cash paid to Shoimur Rahman Sob on Dept Admin, 800 rent against 1st month Oct + charges 30.12.25",
    subsidiaryType: "Cost Center",
    subsidiaryName: "Admin",
    currency: "BDT",
    debit: 0,
    credit: 1500,
    balance: 4434.64,
  },
  {
    voucherNo: "CP12-250029",
    refNo: "103",
    voucherDate: "30/12/2025",
    accountCode: "9010901007,9010105022",
    accountName: "Trade Show/Display Expenses",
    particulars: "Cash paid to Shoimur Rahman Sob on Dept Admin, 800 rent against 2nd Month Fee 30.12.25",
    subsidiaryType: "Cost Center",
    subsidiaryName: "Admin",
    currency: "BDT",
    debit: 0,
    credit: 10188.05,
    balance: 43219.69,
  },
  {
    voucherNo: "CP12-250034",
    refNo: "107",
    voucherDate: "30/12/2025",
    accountCode: "9010105017",
    accountName: "Advance Against Expenses (IOU)",
    particulars: "Cash paid to Shoimur Rahman Sob on Dept Admin, 800 rent against 2nd Month Fee 30.12.25",
    subsidiaryType: "Cost Center",
    subsidiaryName: "Admin",
    currency: "BDT",
    debit: 0,
    credit: 216.5,
    balance: 42011.05,
  },
  {
    voucherNo: "CP12-250048",
    refNo: "115",
    voucherDate: "30/12/2025",
    accountCode: "9010101002,9010101007",
    accountName: "Tea & Refreshment Expenses - Office",
    particulars: "Cash paid to Tasnim Mia: Receipt lunch Dept Admin, Imp 4001 against Travel Dept Staff Using Bill for Entertainment & Dining 2013.25 cash paid through Eoin",
    subsidiaryType: "Cost Center",
    subsidiaryName: "Admin",
    currency: "BDT",
    debit: 0,
    credit: 28470.82,
    balance: 391540.06,
  },
  {
    voucherNo: "CR12-250021",
    refNo: "118",
    voucherDate: "30/12/2025",
    accountCode: "9010101008",
    accountName: "Pixumart",
    particulars: "Cash received from Rayhan Hasan 8400 Dept Admin as Bill against Pixumart 30.12.25",
    subsidiaryType: "Customer",
    subsidiaryName: "Pixumart",
    currency: "BDT",
    debit: 1250000,
    credit: 0,
    balance: 5033130,
  },
]

const classNames = ["Indirect Expenses", "Direct Expenses", "Operating Income"]
const groupNames = ["Operating Expenses", "Non-Operating Expenses", "Tax Expenses"]
const subGroupNames = ["Office", "Admin", "Finance", "HR"]
const controlNames = ["Control 1", "Control 2", "Control 3"]
const searchTypes = ["Group Wise", "Ledger Wise"]
const statuses = ["All", "Posted", "Draft"]
const currencies = ["BDT", "USD", "EUR"]

export default function GeneralLedgerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [filters, setFilters] = useState({
    from: "2025-12-30",
    to: "2026-01-13",
    className: "Indirect Expenses",
    groupName: "",
    subGroupName: "",
    controlName: "",
    searchType: "Group Wise" as "Group Wise" | "Ledger Wise",
    status: "All",
    accountName: "1010101001 - Petty Cash in Hand",
    subsidiaryType: "",
    subsidiaryName: "",
    currency: "BDT",
  })
  const [showResults, setShowResults] = useState(false)

  const groupTotals = useMemo(() => {
    const totalOpening = groupRows.reduce((sum, r) => sum + r.opening, 0)
    const totalDebit = groupRows.reduce((sum, r) => sum + r.debit, 0)
    const totalCredit = groupRows.reduce((sum, r) => sum + r.credit, 0)
    const totalClosing = groupRows.reduce((sum, r) => sum + r.closing, 0)
    return { totalOpening, totalDebit, totalCredit, totalClosing }
  }, [])

  const ledgerTotals = useMemo(() => {
    const totalDebit = ledgerRows.reduce((sum, r) => sum + r.debit, 0)
    const totalCredit = ledgerRows.reduce((sum, r) => sum + r.credit, 0)
    const totalBalance = ledgerRows.reduce((sum, r) => sum + r.balance, 0)
    return { totalDebit, totalCredit, totalBalance }
  }, [])

  const isGroupWise = filters.searchType === "Group Wise"

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
              <h1 className="text-sm font-semibold text-foreground">General Ledger</h1>
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
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
                  <Label className="text-xs text-slate-600">Search Type</Label>
                  <Select
                    value={filters.searchType}
                    onValueChange={(v) => setFilters((p) => ({ ...p, searchType: v as "Group Wise" | "Ledger Wise" }))}
                  >
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {searchTypes.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
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

              {isGroupWise ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Class Name</Label>
                    <Select value={filters.className} onValueChange={(v) => setFilters((p) => ({ ...p, className: v }))}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {classNames.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Group Name</Label>
                    <Select value={filters.groupName} onValueChange={(v) => setFilters((p) => ({ ...p, groupName: v }))}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select One" />
                      </SelectTrigger>
                      <SelectContent>
                        {groupNames.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Sub Group Name</Label>
                    <Select value={filters.subGroupName} onValueChange={(v) => setFilters((p) => ({ ...p, subGroupName: v }))}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select One" />
                      </SelectTrigger>
                      <SelectContent>
                        {subGroupNames.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Control Name</Label>
                    <Select value={filters.controlName} onValueChange={(v) => setFilters((p) => ({ ...p, controlName: v }))}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select One" />
                      </SelectTrigger>
                      <SelectContent>
                        {controlNames.map((g) => (
                          <SelectItem key={g} value={g}>{g}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 text-sm">
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Account Name</Label>
                    <Input
                      value={filters.accountName}
                      onChange={(e) => setFilters((p) => ({ ...p, accountName: e.target.value }))}
                      className="h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Subsidiary Type</Label>
                    <Input
                      value={filters.subsidiaryType}
                      onChange={(e) => setFilters((p) => ({ ...p, subsidiaryType: e.target.value }))}
                      className="h-9 text-sm"
                      placeholder="-Select-"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Subsidiary Name</Label>
                    <Input
                      value={filters.subsidiaryName}
                      onChange={(e) => setFilters((p) => ({ ...p, subsidiaryName: e.target.value }))}
                      className="h-9 text-sm"
                      placeholder="-Select-"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-slate-600">Currency</Label>
                    <Select value={filters.currency} onValueChange={(v) => setFilters((p) => ({ ...p, currency: v }))}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" className="h-9 px-4 text-sm" onClick={() => setShowResults(true)}>
                  Search
                </Button>
                <Button variant="outline" size="sm" className="h-9 px-4 text-sm">
                  Print
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-white">
            <CardHeader className="pb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-sm">Results</CardTitle>
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
                <div className="px-4 py-6 text-center text-sm text-slate-500">Click search to load ledger</div>
              ) : isGroupWise ? (
                <div className="overflow-x-auto">
                  <div className="flex items-center justify-end px-3 py-2 border-b border-slate-100 bg-slate-50">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input className="h-8 w-56 pl-8 text-xs" placeholder="Search..." />
                    </div>
                  </div>
                  <table className="min-w-full text-xs">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-3 py-2 text-left">#</th>
                        <th className="px-3 py-2 text-left">Group Code</th>
                        <th className="px-3 py-2 text-left">Group Name</th>
                        <th className="px-3 py-2 text-right">Opening Balance</th>
                        <th className="px-3 py-2 text-right">Debit Amount</th>
                        <th className="px-3 py-2 text-right">Credit Amount</th>
                        <th className="px-3 py-2 text-right">Closing Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupRows.map((row, idx) => (
                        <tr key={row.groupCode} className="border-t">
                          <td className="px-3 py-2 text-slate-700">{idx + 1}</td>
                          <td className="px-3 py-2 text-slate-700">{row.groupCode}</td>
                          <td className="px-3 py-2 text-blue-700 font-semibold underline underline-offset-2">{row.groupName}</td>
                          <td className="px-3 py-2 text-right text-slate-900">{row.opening.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right text-slate-900">{row.debit.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right text-slate-900">{row.credit.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right text-slate-900">{row.closing.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 text-slate-900 font-semibold">
                      <tr className="border-t">
                        <td colSpan={3} className="px-3 py-2 text-right">Total</td>
                        <td className="px-3 py-2 text-right">{groupTotals.totalOpening.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">{groupTotals.totalDebit.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">{groupTotals.totalCredit.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">{groupTotals.totalClosing.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="flex items-center justify-end px-3 py-2 border-b border-slate-100 bg-slate-50">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input className="h-8 w-56 pl-8 text-xs" placeholder="Search..." />
                    </div>
                  </div>
                  <table className="min-w-full text-xs">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-3 py-2 text-left">#</th>
                        <th className="px-3 py-2 text-left">Voucher No</th>
                        <th className="px-3 py-2 text-left">Ref No</th>
                        <th className="px-3 py-2 text-left">Voucher Date</th>
                        <th className="px-3 py-2 text-left">Acc. Code</th>
                        <th className="px-3 py-2 text-left">Account Name</th>
                        <th className="px-3 py-2 text-left">Particulars</th>
                        <th className="px-3 py-2 text-left">Subsidiary Type</th>
                        <th className="px-3 py-2 text-left">Subsidiary Name</th>
                        <th className="px-3 py-2 text-left">Currency</th>
                        <th className="px-3 py-2 text-right">Debit</th>
                        <th className="px-3 py-2 text-right">Credit</th>
                        <th className="px-3 py-2 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledgerRows.map((row, idx) => (
                        <tr key={row.voucherNo + idx} className="border-t">
                          <td className="px-3 py-2 text-slate-700">{idx + 1}</td>
                          <td className="px-3 py-2 text-blue-700 font-semibold underline underline-offset-2">{row.voucherNo}</td>
                          <td className="px-3 py-2 text-slate-700">{row.refNo}</td>
                          <td className="px-3 py-2 text-slate-700">{row.voucherDate}</td>
                          <td className="px-3 py-2 text-slate-700">{row.accountCode}</td>
                          <td className="px-3 py-2 text-slate-700">{row.accountName}</td>
                          <td className="px-3 py-2 text-slate-700">{row.particulars}</td>
                          <td className="px-3 py-2 text-slate-700">{row.subsidiaryType ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{row.subsidiaryName ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{row.currency}</td>
                          <td className="px-3 py-2 text-right text-slate-900">{row.debit.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right text-slate-900">{row.credit.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right text-slate-900">{row.balance.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 text-slate-900 font-semibold">
                      <tr className="border-t">
                        <td colSpan={10} className="px-3 py-2 text-right">Total</td>
                        <td className="px-3 py-2 text-right">{ledgerTotals.totalDebit.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">{ledgerTotals.totalCredit.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right">{ledgerTotals.totalBalance.toLocaleString()}</td>
                      </tr>
                    </tfoot>
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
