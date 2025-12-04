"use client"

import { useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Menu, Plus, RefreshCcw } from "lucide-react"

type PaymentEntry = {
  id: number
  accountName: string
  narration: string
  costCenter: string
  invoiceNo: string
  refNo: string
  supplier: string
  customer: string
  employee: string
  debit: number
  credit: number
}

const accountHeadOptions = ["Select account", "Head Office Account", "Collection Account", "Petty Cash"]
const supplierOptions = ["Select supplier", "Bengal Root", "Edison Footwear", "OMC Footwear"]
const accountOptions = ["Select account", "Cash", "Accounts Payable", "Expense - Travel"]
const costCenterOptions = ["Select cost center", "General", "IT", "Sales"]

const seedEntries: PaymentEntry[] = []

export default function BankPaymentVoucherPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [form, setForm] = useState({
    fiscalYear: "2025-2026",
    voucherType: "Bank Payment",
    date: "2025-12-03",
    transactionNo: "",
    manualVoucherNo: "",
    accountHead: "",
    chequeNo: "",
    chequeDate: "2025-12-03",
    paidTo: "",
    supplier: "",
  })

  const [entries, setEntries] = useState<PaymentEntry[]>(seedEntries)

  const addEntry = () => {
    const nextId = Math.max(0, ...entries.map((e) => e.id)) + 1
    setEntries((prev) => [
      ...prev,
      {
        id: nextId,
        accountName: "",
        narration: "",
        costCenter: "",
        invoiceNo: "",
        refNo: "",
        supplier: "",
        customer: "",
        employee: "",
        debit: 0,
        credit: 0,
      },
    ])
  }

  const resetEntries = () => setEntries(seedEntries)

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
              <h1 className="text-sm font-semibold text-foreground">Bank Payment Voucher</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-6">
          {/* Voucher information */}
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <h2 className="text-sm font-semibold text-foreground">Voucher Information</h2>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-4">
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="h-10 text-sm"
                  />
                </div>
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
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Manual Voucher No</p>
                <Input
                  value={form.manualVoucherNo}
                  onChange={(e) => setForm((prev) => ({ ...prev, manualVoucherNo: e.target.value }))}
                  className="h-10 text-sm"
                  placeholder="Enter manual voucher no"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">A/C Head</p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                  value={form.accountHead}
                  onChange={(e) => setForm((prev) => ({ ...prev, accountHead: e.target.value }))}
                >
                  {accountHeadOptions.map((opt) => (
                    <option key={opt} value={opt === "Select account" ? "" : opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Cheque No</p>
                <Input
                  value={form.chequeNo}
                  onChange={(e) => setForm((prev) => ({ ...prev, chequeNo: e.target.value }))}
                  className="h-10 text-sm"
                  placeholder="Enter cheque no"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Cheque Date</p>
                <Input
                  type="date"
                  value={form.chequeDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, chequeDate: e.target.value }))}
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Pay To</p>
                <Input
                  value={form.paidTo}
                  onChange={(e) => setForm((prev) => ({ ...prev, paidTo: e.target.value }))}
                  className="h-10 text-sm"
                  placeholder="Beneficiary"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Supplier</p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                  value={form.supplier}
                  onChange={(e) => setForm((prev) => ({ ...prev, supplier: e.target.value }))}
                >
                  {supplierOptions.map((opt) => (
                    <option key={opt} value={opt === "Select supplier" ? "" : opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Line input */}
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Line Input</h3>
            </div>
            <div className="p-4">
              <div className="grid gap-3 md:grid-cols-5">
                <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm">
                  {accountOptions.map((opt) => (
                    <option key={opt} value={opt === "Select account" ? "" : opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <Input placeholder="Narration" className="h-10 text-sm" />
                <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm">
                  {costCenterOptions.map((opt) => (
                    <option key={opt} value={opt === "Select cost center" ? "" : opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <Input placeholder="Invoice Number" className="h-10 text-sm" />
                <Input placeholder="Reference Number" className="h-10 text-sm" />
                <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm">
                  {supplierOptions.map((opt) => (
                    <option key={opt} value={opt === "Select supplier" ? "" : opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <Input placeholder="Customer Name" className="h-10 text-sm" />
                <Input placeholder="Employee Name" className="h-10 text-sm" />
                <Input placeholder="Debit" className="h-10 text-sm text-right" />
                <Input placeholder="Credit" className="h-10 text-sm text-right" />
                <div className="flex items-center gap-2">
                  <Button className="h-10 gap-2" variant="outline" onClick={addEntry}>
                    <Plus className="h-4 w-4" />
                    Add
                  </Button>
                  <Button variant="outline" className="h-10 gap-2" onClick={resetEntries}>
                    <RefreshCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Entries */}
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Entries</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border/70">
                  <thead className="bg-muted/60">
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/90">
                      <th className="px-2 py-2">SL</th>
                      <th className="px-2 py-2">Account Name</th>
                      <th className="px-2 py-2">Narration</th>
                      <th className="px-2 py-2">Cost Center</th>
                      <th className="px-2 py-2">Inv No</th>
                      <th className="px-2 py-2">Ref No</th>
                      <th className="px-2 py-2">Supplier</th>
                      <th className="px-2 py-2">Customer</th>
                      <th className="px-2 py-2">Emp. Name</th>
                      <th className="px-2 py-2 text-right">Debit</th>
                      <th className="px-2 py-2 text-right">Credit</th>
                      <th className="px-2 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {entries.length === 0 && (
                      <tr>
                        <td colSpan={12} className="px-2 py-4 text-center text-sm text-muted-foreground">
                          No entries added.
                        </td>
                      </tr>
                    )}
                    {entries.map((entry, index) => (
                      <tr key={entry.id} className="text-sm text-foreground/90">
                        <td className="px-2 py-2 text-muted-foreground">{index + 1}</td>
                        <td className="px-2 py-2">{entry.accountName || "—"}</td>
                        <td className="px-2 py-2">{entry.narration || "—"}</td>
                        <td className="px-2 py-2">{entry.costCenter || "—"}</td>
                        <td className="px-2 py-2">{entry.invoiceNo || "—"}</td>
                        <td className="px-2 py-2">{entry.refNo || "—"}</td>
                        <td className="px-2 py-2">{entry.supplier || "—"}</td>
                        <td className="px-2 py-2">{entry.customer || "—"}</td>
                        <td className="px-2 py-2">{entry.employee || "—"}</td>
                        <td className="px-2 py-2 text-right">
                          {entry.debit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-2 py-2 text-right">
                          {entry.credit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-2 py-2 text-right text-xs">
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50">
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 flex items-center justify-end gap-6 text-sm font-semibold text-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total:</span>
                  <span>{(totalDebit + totalCredit).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
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
