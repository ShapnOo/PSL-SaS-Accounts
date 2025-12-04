"use client"

import { useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Menu } from "lucide-react"

type EntryRow = { id: number; sl: number; date: string; particulars: string; chequeNo?: string; amount: number; reconciled?: boolean }

const emptyList: EntryRow[] = []

export default function BankReconciliationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [filters, setFilters] = useState({
    fiscalYear: "2025-2026",
    month: "Jan",
    year: "2025",
    location: "",
    glCode: "",
  })

  const [balances, setBalances] = useState({
    adjustBalance: "",
    bookBalance: "",
    difference: "",
  })

  const sections = [
    { title: "Add: Amount received but not yet credited by bank", key: "add" },
    { title: "Less: Un presented Cheques", key: "less" },
    { title: "Entry not yet passed in passed nook", key: "notPassed" },
  ]

  const receipts: EntryRow[] = emptyList
  const payments: EntryRow[] = emptyList

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
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Bank Reconciliation</p>
              <h1 className="text-sm font-semibold text-foreground">Summary</h1>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            Load records
          </Button>
        </header>

        <div className="p-4 lg:p-6 space-y-6">
          {/* Filters */}
          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4">
            <div className="grid gap-3 md:grid-cols-5 lg:grid-cols-6">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">Financial Year</p>
                <Input value={filters.fiscalYear} onChange={(e) => setFilters({ ...filters, fiscalYear: e.target.value })} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">Month</p>
                <Input value={filters.month} onChange={(e) => setFilters({ ...filters, month: e.target.value })} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">Year</p>
                <Input value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">Location</p>
                <Input value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="h-9 text-sm" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.12em]">GL Code</p>
                <Input value={filters.glCode} onChange={(e) => setFilters({ ...filters, glCode: e.target.value })} className="h-9 text-sm" />
              </div>
            </div>
          </div>

          {/* Balance and lists */}
          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              <div className="rounded-xl border border-border/70 bg-gradient-to-r from-slate-50 via-white to-slate-50 shadow-sm p-4">
                <p className="text-sm font-semibold text-foreground">Balance as per Bank statement</p>
              </div>

              {sections.map((section) => (
                <div key={section.key} className="rounded-xl border border-border/70 bg-card shadow-sm p-4">
                  <p className="text-sm font-semibold text-foreground mb-3">{section.title}</p>
                  <div className="overflow-x-auto rounded-md border border-border/60">
                    <table className="min-w-full text-xs">
                      <thead className="bg-muted/70 text-muted-foreground">
                        <tr>
                          <th className="px-2 py-2 text-left">SL</th>
                          <th className="px-2 py-2 text-left">Tr. No</th>
                          <th className="px-2 py-2 text-left">Tr. Date</th>
                          <th className="px-2 py-2 text-left">Particulars</th>
                          <th className="px-2 py-2 text-left">Cheque No</th>
                          <th className="px-2 py-2 text-left">Amount</th>
                          <th className="px-2 py-2 text-left">Reconciled</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td colSpan={7} className="px-2 py-3 text-center text-muted-foreground">
                            No data available
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4 space-y-4">
                <p className="text-sm font-semibold text-foreground">Entry not yet passed in passed nook</p>

                <div className="rounded-md border border-border/60 overflow-hidden space-y-2 pb-3">
                  <div className="bg-blue-900 text-white text-sm font-semibold px-3 py-2">a) Receipts</div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead className="bg-muted/70 text-muted-foreground">
                        <tr>
                          <th className="px-2 py-2 text-left">SL</th>
                          <th className="px-2 py-2 text-left">Date</th>
                          <th className="px-2 py-2 text-left">Particulars</th>
                          <th className="px-2 py-2 text-left">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {receipts.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-2 py-3 text-center text-muted-foreground">
                              No data available
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center gap-2 px-3">
                    <Button variant="outline" size="sm" className="h-8 px-3">
                      Add
                    </Button>
                    <Input placeholder="Amount" className="h-8 w-32 text-sm" />
                  </div>
                </div>

                <div className="rounded-md border border-border/60 overflow-hidden space-y-2 pb-3">
                  <div className="bg-blue-900 text-white text-sm font-semibold px-3 py-2">b) Payment</div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead className="bg-muted/70 text-muted-foreground">
                        <tr>
                          <th className="px-2 py-2 text-left">SL</th>
                          <th className="px-2 py-2 text-left">Date</th>
                          <th className="px-2 py-2 text-left">Particulars</th>
                          <th className="px-2 py-2 text-left">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-2 py-3 text-center text-muted-foreground">
                              No data available
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center gap-2 px-3">
                    <Button variant="outline" size="sm" className="h-8 px-3">
                      Add
                    </Button>
                    <Input placeholder="Amount" className="h-8 w-32 text-sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4">
                <p className="text-sm font-semibold text-foreground">Amount (Taka)</p>
                <Input className="mt-2 h-9 text-sm" />
              </div>

              <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground">Adjust Balance</p>
                <Input className="h-9 text-sm" value={balances.adjustBalance} onChange={(e) => setBalances({ ...balances, adjustBalance: e.target.value })} />
                <p className="text-sm font-semibold text-foreground">Book Balance</p>
                <Input className="h-9 text-sm" value={balances.bookBalance} onChange={(e) => setBalances({ ...balances, bookBalance: e.target.value })} />
                <p className="text-sm font-semibold text-foreground">Difference</p>
                <Input className="h-9 text-sm" value={balances.difference} onChange={(e) => setBalances({ ...balances, difference: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Particulars */}
          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">Particulars</p>
            <Input className="h-9 text-sm" />
            <div className="flex gap-2">
              <Button className="h-9 px-4">Submit</Button>
              <Button className="h-9 px-4" variant="outline">
                Print
              </Button>
              <Button className="h-9 px-4" variant="outline">
                New
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
