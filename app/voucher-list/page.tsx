"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Calendar, Edit3, Eye, Menu, Search, Tags } from "lucide-react"

type VoucherRow = {
  id: number
  voucherNo: string
  voucherType: string
  transactionNo: string
  date: string
  amount: number
  particulars: string
  status: "Approved" | "Pending"
}

const voucherTypes = [
  "Cash Payment",
  "Journal Voucher",
  "Bank Payment Voucher",
  "Cash Received Voucher",
  "Sales Voucher",
  "Purchase Voucher",
] as const

const seedRows: VoucherRow[] = [
  {
    id: 1,
    voucherNo: "CP10-250046",
    voucherType: "Cash Payment",
    transactionNo: "344",
    date: "2025-10-16",
    amount: 1949,
    particulars: "Cash paid to Md. Al- Amin, Accounts for final settlement of July",
    status: "Approved",
  },
  {
    id: 2,
    voucherNo: "JV09-250060",
    voucherType: "Journal Voucher",
    transactionNo: "344",
    date: "2025-09-09",
    amount: 5000,
    particulars: "Service fee from Bengal Root (Cripton ERP) for September 2025",
    status: "Approved",
  },
  {
    id: 3,
    voucherNo: "CP10-250055",
    voucherType: "Cash Payment",
    transactionNo: "343",
    date: "2025-10-16",
    amount: 638,
    particulars: "Cash paid to Mahfuzur Rahman against conveyance & lunch 30.09.2025",
    status: "Approved",
  },
  {
    id: 4,
    voucherNo: "JV09-250059",
    voucherType: "Journal Voucher",
    transactionNo: "343",
    date: "2025-09-09",
    amount: 10500,
    particulars: "Service fee from Best Electronics (Cripton Pro VAT) for September 2025",
    status: "Approved",
  },
  {
    id: 5,
    voucherNo: "CP10-250044",
    voucherType: "Cash Payment",
    transactionNo: "342",
    date: "2025-10-16",
    amount: 4443,
    particulars: "Cash paid to Maruf Hassan against conveyance & lunch 01.09.25 to 17.09.25",
    status: "Approved",
  },
  {
    id: 6,
    voucherNo: "JV09-250058",
    voucherType: "Journal Voucher",
    transactionNo: "342",
    date: "2025-09-09",
    amount: 5000,
    particulars: "Service fee from Edison Real Estate (Cripton ERP) for September 2025",
    status: "Approved",
  },
  {
    id: 7,
    voucherNo: "CP10-250043",
    voucherType: "Cash Payment",
    transactionNo: "341",
    date: "2025-10-16",
    amount: 3710,
    particulars: "Cash paid to Tanvir Rahman Shoaib against conveyance & lunch 01.09.25 to 17.09.25",
    status: "Approved",
  },
  {
    id: 8,
    voucherNo: "JV09-250057",
    voucherType: "Journal Voucher",
    transactionNo: "341",
    date: "2025-09-08",
    amount: 10000,
    particulars: "Service fee from Edison Footwear (Cripton ERP) for September 2025",
    status: "Approved",
  },
  {
    id: 9,
    voucherNo: "CP10-250042",
    voucherType: "Cash Payment",
    transactionNo: "340",
    date: "2025-10-16",
    amount: 1040,
    particulars: "Cash paid to Sultan Ahmed against conveyance & lunch 09.09.25 to 22.09.25",
    status: "Approved",
  },
  {
    id: 10,
    voucherNo: "JV09-250056",
    voucherType: "Journal Voucher",
    transactionNo: "340",
    date: "2025-09-08",
    amount: 10000,
    particulars: "Service fee from OMC Footwear Limited for September 2025",
    status: "Approved",
  },
]

export default function VoucherListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [filters, setFilters] = useState({
    voucherType: "",
    dateFrom: "",
    dateTo: "",
    status: "",
    accountName: "",
  })

  const filteredRows = useMemo(() => {
    return seedRows.filter((row) => {
      const matchesType = filters.voucherType ? row.voucherType === filters.voucherType : true
      const matchesStatus = filters.status ? row.status === filters.status : true
      const matchesAccount = filters.accountName
        ? row.particulars.toLowerCase().includes(filters.accountName.toLowerCase())
        : true
      const matchesFrom = filters.dateFrom ? new Date(row.date) >= new Date(filters.dateFrom) : true
      const matchesTo = filters.dateTo ? new Date(row.date) <= new Date(filters.dateTo) : true
      return matchesType && matchesStatus && matchesAccount && matchesFrom && matchesTo
    })
  }, [filters])

  const resetFilters = () =>
    setFilters({
      voucherType: "",
      dateFrom: "",
      dateTo: "",
      status: "",
      accountName: "",
    })

  return (
    <div className="flex min-h-screen bg-background">
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
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Transaction</p>
              <h1 className="text-sm font-semibold text-foreground">Voucher List</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="grid gap-3 border-b border-border/70 p-4 md:grid-cols-5">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Voucher Type</p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                  value={filters.voucherType}
                  onChange={(e) => setFilters((prev) => ({ ...prev, voucherType: e.target.value }))}
                >
                  <option value="">All</option>
                  {voucherTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Date From</p>
                <Input
                  type="date"
                  className="h-10 text-sm"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Date To</p>
                <Input
                  type="date"
                  className="h-10 text-sm"
                  value={filters.dateTo}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Status</p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                  value={filters.status}
                  onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">All</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Account Name</p>
                <Input
                  placeholder="Search particulars"
                  className="h-10 text-sm"
                  value={filters.accountName}
                  onChange={(e) => setFilters((prev) => ({ ...prev, accountName: e.target.value }))}
                />
              </div>

              <div className="md:col-span-5 flex flex-wrap gap-2">
                <Button className="h-10 gap-2 bg-slate-900 text-white hover:bg-slate-800">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                <Button variant="outline" className="h-10" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 font-medium">
                Showing {filteredRows.length} of {seedRows.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200 text-sm shadow-sm">
                <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  <tr>
                    <th className="border border-slate-200 px-3 py-2 text-left">SL</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Voucher No</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Voucher Type</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Transaction No</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Date</th>
                    <th className="border border-slate-200 px-3 py-2 text-right">Amount</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Particulars</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Status</th>
                    <th className="border border-slate-200 px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, idx) => (
                    <tr key={row.id} className={cn(idx % 2 === 0 ? "bg-white" : "bg-slate-50/70", "hover:bg-slate-100 transition-colors")}>
                      <td className="border border-slate-200 px-3 py-2 text-muted-foreground">{idx + 1}</td>
                      <td className="border border-slate-200 px-3 py-2 font-semibold text-foreground">{row.voucherNo}</td>
                      <td className="border border-slate-200 px-3 py-2">
                        <div className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
                          <Tags className="h-3.5 w-3.5" />
                          {row.voucherType}
                        </div>
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-muted-foreground">{row.transactionNo}</td>
                      <td className="border border-slate-200 px-3 py-2 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{row.date}</span>
                        </div>
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-right font-semibold text-foreground">
                        {row.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-xs leading-snug text-foreground/80">{row.particulars}</td>
                      <td className="border border-slate-200 px-3 py-2">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
                            row.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                              : "bg-amber-50 text-amber-700 ring-amber-100",
                          )}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-right text-xs">
                        <div className="inline-flex items-center gap-1.5">
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50">
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-50">
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
