"use client"

import { useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Calendar, FileText, Menu, Plus, RefreshCcw } from "lucide-react"

type JournalEntry = {
  id: number
  accountName: string
  costCenter: string
  invoiceNo: string
  refNo: string
  supplier: string
  customer: string
  employee: string
  narration: string
  debit: number
  credit: number
}

const seedEntries: JournalEntry[] = [
  {
    id: 1,
    accountName: "Accounts Payable",
    costCenter: "General",
    invoiceNo: "INV-101",
    refNo: "REF-01",
    supplier: "Bengal Root",
    customer: "",
    employee: "",
    narration: "One month service fee for September 2025",
    debit: 0,
    credit: 5000,
  },
  {
    id: 2,
    accountName: "Cash",
    costCenter: "General",
    invoiceNo: "INV-101",
    refNo: "REF-01",
    supplier: "Bengal Root",
    customer: "",
    employee: "",
    narration: "Settlement of service fee",
    debit: 5000,
    credit: 0,
  },
]

export default function JournalVoucherPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [form, setForm] = useState({
    fiscalYear: "2025-2026",
    voucherType: "Journal Voucher",
    date: "2025-12-03",
    transactionNo: "",
    manualVoucherNo: "",
    narration: "",
  })

  const [entries, setEntries] = useState<JournalEntry[]>(seedEntries)

  const addEntry = () => {
    const nextId = Math.max(0, ...entries.map((e) => e.id)) + 1
    setEntries((prev) => [
      ...prev,
      {
        id: nextId,
        accountName: "",
        costCenter: "",
        invoiceNo: "",
        refNo: "",
        supplier: "",
        customer: "",
        employee: "",
        narration: "",
        debit: 0,
        credit: 0,
      },
    ])
  }

  const totalDebit = entries.reduce((sum, e) => sum + e.debit, 0)
  const totalCredit = entries.reduce((sum, e) => sum + e.credit, 0)

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
              <h1 className="text-sm font-semibold text-foreground">Journal Voucher</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="grid gap-4 border-b border-border/70 p-4 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Financial Year</p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                  value={form.fiscalYear}
                  onChange={(e) => setForm((prev) => ({ ...prev, fiscalYear: e.target.value }))}
                >
                  <option value="2025-2026">2025-2026</option>
                  <option value="2024-2025">2024-2025</option>
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Voucher Type</p>
                <select className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm" disabled>
                  <option>Journal Voucher</option>
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Date</p>
                <Input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Transaction No</p>
                <Input
                  value={form.transactionNo}
                  onChange={(e) => setForm((prev) => ({ ...prev, transactionNo: e.target.value }))}
                  className="h-10 text-sm"
                  placeholder="Auto / manual"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Manual Voucher No</p>
                <Input
                  value={form.manualVoucherNo}
                  onChange={(e) => setForm((prev) => ({ ...prev, manualVoucherNo: e.target.value }))}
                  className="h-10 text-sm"
                  placeholder="Enter manual no"
                />
              </div>
              <div className="space-y-1 md:col-span-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Narration</p>
                <Input
                  placeholder="Enter narration..."
                  value={form.narration}
                  onChange={(e) => setForm((prev) => ({ ...prev, narration: e.target.value }))}
                  className="h-10 text-sm"
                />
              </div>

              <div className="md:col-span-4 flex flex-wrap gap-2">
                <Button className="bg-slate-900 text-white hover:bg-slate-800 h-10 gap-2">
                  <FileText className="h-4 w-4" />
                  Save
                </Button>
                <Button variant="outline" className="h-10 gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-5">
                <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm">
                  <option>Select Account Name</option>
                </select>
                <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm">
                  <option>Cost Center</option>
                </select>
                <Input placeholder="Invoice Number" className="h-10 text-sm" />
                <Input placeholder="Reference Number" className="h-10 text-sm" />
                <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm">
                  <option>Supplier</option>
                </select>
                <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm">
                  <option>Customer Name</option>
                </select>
                <Input placeholder="Employee Name" className="h-10 text-sm" />
                <Input placeholder="Narration" className="h-10 text-sm" />
                <Input placeholder="Debit" className="h-10 text-sm text-right" />
                <Input placeholder="Credit" className="h-10 text-sm text-right" />
                <div className="flex items-center gap-2">
                  <Button className="h-10 gap-2" variant="outline" onClick={addEntry}>
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                  <Button variant="outline" className="h-10 gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border/70">
                  <thead className="bg-muted/60">
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/90">
                      <th className="px-2 py-2">SL</th>
                      <th className="px-2 py-2">Account Name</th>
                      <th className="px-2 py-2">Cost Center</th>
                      <th className="px-2 py-2">Inv No</th>
                      <th className="px-2 py-2">Ref No</th>
                      <th className="px-2 py-2">Supplier</th>
                      <th className="px-2 py-2">Customer</th>
                      <th className="px-2 py-2">Emp. Name</th>
                      <th className="px-2 py-2">Narration</th>
                      <th className="px-2 py-2 text-right">Debit</th>
                      <th className="px-2 py-2 text-right">Credit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {entries.map((entry, index) => (
                      <tr key={entry.id} className="text-sm text-foreground/90">
                        <td className="px-2 py-2 text-muted-foreground">{index + 1}</td>
                        <td className="px-2 py-2">{entry.accountName || "—"}</td>
                        <td className="px-2 py-2">{entry.costCenter || "—"}</td>
                        <td className="px-2 py-2">{entry.invoiceNo || "—"}</td>
                        <td className="px-2 py-2">{entry.refNo || "—"}</td>
                        <td className="px-2 py-2">{entry.supplier || "—"}</td>
                        <td className="px-2 py-2">{entry.customer || "—"}</td>
                        <td className="px-2 py-2">{entry.employee || "—"}</td>
                        <td className="px-2 py-2">{entry.narration || "—"}</td>
                        <td className="px-2 py-2 text-right">{entry.debit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                        <td className="px-2 py-2 text-right">{entry.credit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex items-center justify-end gap-6 text-sm font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total :</span>
                  <span>{totalDebit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Debit</span>
                  <span>{totalDebit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Credit</span>
                  <span>{totalCredit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
