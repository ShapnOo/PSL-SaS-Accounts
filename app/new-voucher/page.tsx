"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CheckCircle, Filter, Menu, Plus, Tags, X } from "lucide-react"

type Voucher = {
  id: number
  name: string
  shortName: string
  voucherType: string
  status: "Active" | "Inactive"
}

const voucherTypes = [
  "Purchase Voucher",
  "Cash Payment Voucher",
  "Bank Payment Voucher",
  "Negotiation Voucher",
  "Inventory Voucher",
  "Sales Voucher",
  "Cash Received Voucher",
  "Cash Voucher",
  "Bank Received Voucher",
  "Journal Voucher",
] as const

const seedVouchers: Voucher[] = [
  { id: 1, name: "Purchase Voucher", shortName: "PV", voucherType: "Purchase Voucher", status: "Active" },
  { id: 2, name: "Cash Payment Voucher", shortName: "CPV", voucherType: "Cash Payment Voucher", status: "Active" },
  { id: 3, name: "Bank Payment Voucher", shortName: "BPV", voucherType: "Bank Payment Voucher", status: "Active" },
  { id: 4, name: "Negotiation Voucher", shortName: "NV", voucherType: "Negotiation Voucher", status: "Active" },
  { id: 5, name: "Inventory Voucher", shortName: "INV", voucherType: "Inventory Voucher", status: "Active" },
  { id: 6, name: "Sales Voucher", shortName: "SV", voucherType: "Sales Voucher", status: "Active" },
  { id: 7, name: "Cash Received Voucher", shortName: "CRV", voucherType: "Cash Received Voucher", status: "Active" },
  { id: 8, name: "Cash Voucher", shortName: "COV", voucherType: "Cash Voucher", status: "Active" },
  { id: 9, name: "Bank Received Voucher", shortName: "BRV", voucherType: "Bank Received Voucher", status: "Active" },
  { id: 10, name: "Journal Voucher", shortName: "JV", voucherType: "Journal Voucher", status: "Active" },
]

export default function NewVoucherPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>(seedVouchers)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [filters, setFilters] = useState({ voucherType: "", status: "" })
  const [form, setForm] = useState({ name: "", shortName: "", voucherType: "", status: "Active" as Voucher["status"] })

  const filteredVouchers = useMemo(() => {
    return vouchers.filter((v) => {
      const typeMatch = filters.voucherType ? v.voucherType === filters.voucherType : true
      const statusMatch = filters.status ? v.status === filters.status : true
      return typeMatch && statusMatch
    })
  }, [vouchers, filters])

  const resetForm = () => setForm({ name: "", shortName: "", voucherType: "", status: "Active" })

  const handleAdd = () => {
    if (!form.name.trim() || !form.shortName.trim() || !form.voucherType.trim()) return
    const nextId = Math.max(0, ...vouchers.map((v) => v.id)) + 1
    setVouchers((prev) => [
      ...prev,
      {
        id: nextId,
        name: form.name.trim(),
        shortName: form.shortName.trim(),
        voucherType: form.voucherType.trim(),
        status: form.status,
      },
    ])
    resetForm()
  }

  const handleResetFilters = () => setFilters({ voucherType: "", status: "" })

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
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Configuration</p>
              <h1 className="text-sm font-semibold text-foreground">New Voucher</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="grid gap-3 border-b border-border/70 p-4 lg:grid-cols-5">
              <Input
                placeholder="Voucher Name"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="h-10 text-sm"
              />
              <Input
                placeholder="Voucher Short Name"
                value={form.shortName}
                onChange={(e) => setForm((prev) => ({ ...prev, shortName: e.target.value.toUpperCase() }))}
                className="h-10 text-sm"
              />
              <select
                className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                value={form.voucherType}
                onChange={(e) => setForm((prev) => ({ ...prev, voucherType: e.target.value }))}
              >
                <option value="">Voucher Type</option>
                {voucherTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as Voucher["status"] }))}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <div className="flex items-center gap-2">
                <Button
                  className="h-10 gap-2 bg-slate-900 text-white hover:bg-slate-800"
                  onClick={handleAdd}
                  disabled={!form.name.trim() || !form.shortName.trim() || !form.voucherType.trim()}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
                <Button variant="outline" className="h-10 text-xs" onClick={resetForm}>
                  Reset
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 px-4 py-3 text-xs text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full bg-muted/60 px-3 py-1 font-medium">
                <Filter className="h-3.5 w-3.5" />
                Filters
              </div>
              <select
                className="h-8 rounded-md border border-border/80 bg-white px-3 text-xs text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                value={filters.voucherType}
                onChange={(e) => setFilters((prev) => ({ ...prev, voucherType: e.target.value }))}
              >
                <option value="">All Types</option>
                {voucherTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                className="h-8 rounded-md border border-border/80 bg-white px-3 text-xs text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                value={filters.status}
                onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleResetFilters}>
                Clear Filters
              </Button>
              <span className="text-[11px] text-muted-foreground">Total: {filteredVouchers.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/70">
                <thead className="bg-muted/60">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/90">
                    <th className="px-3 py-3 sm:px-4">Voucher Name</th>
                    <th className="px-3 py-3 sm:px-4">Short Name</th>
                    <th className="px-3 py-3 sm:px-4">Voucher Type</th>
                    <th className="px-3 py-3 sm:px-4">Status</th>
                    <th className="px-3 py-3 sm:px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {filteredVouchers.map((voucher) => (
                    <tr key={voucher.id} className="text-sm text-foreground/90 hover:bg-muted/40 transition-colors">
                      <td className="px-3 py-3 sm:px-4 font-semibold text-foreground">{voucher.name}</td>
                      <td className="px-3 py-3 sm:px-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                            {voucher.shortName}
                          </span>
                          <span className="text-xs text-foreground/80">{voucher.shortName}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <div className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
                          <Tags className="h-3.5 w-3.5" />
                          {voucher.voucherType}
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
                            voucher.status === "Active"
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
                              : "bg-slate-100 text-slate-700 ring-slate-200",
                          )}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          {voucher.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 text-right text-xs">
                        <div className="inline-flex items-center gap-1.5">
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50">
                            Edit
                          </button>
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50">
                            Delete
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
