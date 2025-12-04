"use client"

import { useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Menu, Plus, Printer, RefreshCcw, RotateCcw, Save, X } from "lucide-react"

type ReconEntry = {
  id: number
  accountCode: string
  accountName: string
  chequeNo: string
  chequeDate: string
  amount: number
}

export default function BankReconciliationVoucherPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [form, setForm] = useState({
    voucherCode: "",
    voucherDate: "2025-12-03",
    byCheque: false,
    bankCharge: false,
    withoutCheque: false,
  })

  const [draft, setDraft] = useState({
    accountCode: "",
    accountName: "",
    chequeNo: "",
    chequeDate: "",
    amount: "",
  })

  const [entries, setEntries] = useState<ReconEntry[]>([])

  const addEntry = () => {
    if (!draft.accountCode || !draft.accountName || !draft.amount) return
    const nextId = Math.max(0, ...entries.map((e) => e.id)) + 1
    setEntries((prev) => [
      ...prev,
      {
        id: nextId,
        accountCode: draft.accountCode,
        accountName: draft.accountName,
        chequeNo: draft.chequeNo,
        chequeDate: draft.chequeDate,
        amount: Number(draft.amount),
      },
    ])
    setDraft({ accountCode: "", accountName: "", chequeNo: "", chequeDate: "", amount: "" })
  }

  const removeEntry = (id: number) => setEntries((prev) => prev.filter((e) => e.id !== id))
  const resetEntries = () => {
    setEntries([])
    setDraft({ accountCode: "", accountName: "", chequeNo: "", chequeDate: "", amount: "" })
  }

  const totalAmount = entries.reduce((sum, e) => sum + e.amount, 0)

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
              <h1 className="text-sm font-semibold text-foreground">Bank Voucher</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-6">
          {/* Voucher info */}
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="grid gap-4 p-4 md:grid-cols-3">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Voucher Code</p>
                <Input
                  value={form.voucherCode}
                  onChange={(e) => setForm((prev) => ({ ...prev, voucherCode: e.target.value }))}
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Voucher Date</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={form.voucherDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, voucherDate: e.target.value }))}
                    className="h-9 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Voucher Option</p>
                <div className="flex flex-wrap gap-4 text-sm text-foreground">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.byCheque}
                      onChange={(e) => setForm((prev) => ({ ...prev, byCheque: e.target.checked }))}
                    />
                    <span>By Cheque</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.bankCharge}
                      onChange={(e) => setForm((prev) => ({ ...prev, bankCharge: e.target.checked }))}
                    />
                    <span>Bank Charge</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.withoutCheque}
                      onChange={(e) => setForm((prev) => ({ ...prev, withoutCheque: e.target.checked }))}
                    />
                    <span>Without Cheque</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction details */}
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/70 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Transaction Details</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid gap-3 md:grid-cols-5">
                <Input
                  placeholder="Account Code"
                  className="h-9 text-sm"
                  value={draft.accountCode}
                  onChange={(e) => setDraft((prev) => ({ ...prev, accountCode: e.target.value }))}
                />
                <Input
                  placeholder="Account Name"
                  className="h-9 text-sm"
                  value={draft.accountName}
                  onChange={(e) => setDraft((prev) => ({ ...prev, accountName: e.target.value }))}
                />
                <Input
                  type="date"
                  placeholder="Cheque Date"
                  className="h-9 text-sm"
                  value={draft.chequeDate}
                  onChange={(e) => setDraft((prev) => ({ ...prev, chequeDate: e.target.value }))}
                />
                <Input
                  placeholder="Cheque No"
                  className="h-9 text-sm"
                  value={draft.chequeNo}
                  onChange={(e) => setDraft((prev) => ({ ...prev, chequeNo: e.target.value }))}
                />
                <Input
                  placeholder="Amount"
                  className="h-9 text-sm text-right"
                  value={draft.amount}
                  onChange={(e) => setDraft((prev) => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button className="h-9 gap-2" variant="outline" onClick={addEntry}>
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
                <Button variant="outline" className="h-9 gap-2" onClick={resetEntries}>
                  <RefreshCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* Entries */}
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/70 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Entries</p>
            </div>
            <div className="p-4 space-y-3">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border/70">
                  <thead className="bg-muted/60">
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/90">
                      <th className="px-2 py-2">SL</th>
                      <th className="px-2 py-2">Acc Code</th>
                      <th className="px-2 py-2">Acc Name</th>
                      <th className="px-2 py-2">Cheque No</th>
                      <th className="px-2 py-2">Cheque Date</th>
                      <th className="px-2 py-2 text-right">Amount</th>
                      <th className="px-2 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/70">
                    {entries.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-2 py-4 text-center text-sm text-muted-foreground">
                          No entries added.
                        </td>
                      </tr>
                    )}
                    {entries.map((entry, index) => (
                      <tr key={entry.id} className="text-sm text-foreground/90">
                        <td className="px-2 py-2 text-muted-foreground">{index + 1}</td>
                        <td className="px-2 py-2">{entry.accountCode || "—"}</td>
                        <td className="px-2 py-2">{entry.accountName || "—"}</td>
                        <td className="px-2 py-2">{entry.chequeNo || "—"}</td>
                        <td className="px-2 py-2">{entry.chequeDate || "—"}</td>
                        <td className="px-2 py-2 text-right">
                          {entry.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-2 py-2 text-right text-xs">
                          <button
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50"
                            onClick={() => removeEntry(entry.id)}
                          >
                            <X className="h-3 w-3" />
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
                  <span>{totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Particulars */}
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="border-b border-border/70 px-4 py-3">
              <p className="text-sm font-semibold text-foreground">Particulars</p>
            </div>
            <div className="p-4">
              <Input placeholder="Add particulars..." className="h-9 text-sm" />
            </div>
            <div className="flex gap-2 px-4 pb-4">
              <Button className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
                <Save className="h-4 w-4" />
                Submit
              </Button>
              <Button variant="outline" className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
              <Button variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                New
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
