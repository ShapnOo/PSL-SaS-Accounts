"use client"

import { useMemo, useState } from "react"
import { Edit, Menu, Trash2 } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Purchase = {
  id: number
  poNo: string
  vendor: string
  issueDate: string
  dueDate: string
  subtotal: number
  tax: number
  discount: number
  shipping: number
  status: "Draft" | "Unbilled" | "Partially Billed" | "Billed" | "Overdue"
  currency: string
}

const accent = "#1B254D"

const seedPurchases: Purchase[] = [
  { id: 1, poNo: "PO-5001", vendor: "Leather Supply Co.", issueDate: "2024-12-02", dueDate: "2024-12-17", subtotal: 12000, tax: 800, discount: 0, shipping: 0, status: "Unbilled", currency: "USD" },
  { id: 2, poNo: "PO-5002", vendor: "IT Hardware Hub", issueDate: "2024-12-04", dueDate: "2024-12-19", subtotal: 8800, tax: 600, discount: 0, shipping: 0, status: "Partially Billed", currency: "USD" },
  { id: 3, poNo: "PO-5003", vendor: "Global Logistics", issueDate: "2024-12-06", dueDate: "2024-12-21", subtotal: 20000, tax: 1500, discount: 0, shipping: 0, status: "Billed", currency: "USD" },
  { id: 4, poNo: "PO-5004", vendor: "Paper & Stationery", issueDate: "2024-12-08", dueDate: "2024-12-22", subtotal: 2500, tax: 300, discount: 0, shipping: 0, status: "Draft", currency: "USD" },
  { id: 5, poNo: "PO-5005", vendor: "Marketing Studio", issueDate: "2024-12-10", dueDate: "2024-12-25", subtotal: 5800, tax: 500, discount: 0, shipping: 0, status: "Overdue", currency: "USD" },
]

export default function PurchasePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [purchases, setPurchases] = useState<Purchase[]>(seedPurchases)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<Purchase["status"] | "All">("All")
  const [currencyFilter, setCurrencyFilter] = useState<Purchase["currency"] | "All">("All")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Omit<Purchase, "id">>({
    poNo: "",
    vendor: "",
    issueDate: "",
    dueDate: "",
    subtotal: 0,
    tax: 0,
    discount: 0,
    shipping: 0,
    status: "Draft",
    currency: "USD",
  })

  const filtered = useMemo(
    () =>
      purchases.filter((po) => {
        const matchSearch = `${po.poNo} ${po.vendor}`.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "All" || po.status === statusFilter
        const matchCurrency = currencyFilter === "All" || po.currency === currencyFilter
        return matchSearch && matchStatus && matchCurrency
      }),
    [purchases, search, statusFilter, currencyFilter],
  )

  const handleAdd = () => {
    if (!form.poNo || !form.vendor || !form.issueDate || !form.dueDate || !form.subtotal) return
    if (editingId) {
      setPurchases((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form } : p)))
    } else {
      const next: Purchase = {
        id: purchases.length ? Math.max(...purchases.map((p) => p.id)) + 1 : 1,
        ...form,
      }
      setPurchases((prev) => [next, ...prev])
    }
    setEditingId(null)
    setDialogOpen(false)
    setForm({ poNo: "", vendor: "", issueDate: "", dueDate: "", subtotal: 0, tax: 0, discount: 0, shipping: 0, status: "Draft", currency: "USD" })
  }

  const handleEdit = (po: Purchase) => {
    setForm({ poNo: po.poNo, vendor: po.vendor, issueDate: po.issueDate, dueDate: po.dueDate, amount: po.amount, status: po.status })
    setEditingId(po.id)
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setPurchases((prev) => prev.filter((p) => p.id !== id))
  }

  const statusBadge = (status: Purchase["status"]) => {
    const map: Record<Purchase["status"], string> = {
      Draft: "bg-slate-100 text-slate-700",
      Unbilled: "bg-amber-50 text-amber-700",
      "Partially Billed": "bg-blue-50 text-blue-700",
      Billed: "bg-emerald-50 text-emerald-700",
      Overdue: "bg-rose-50 text-rose-700",
    }
    return <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${map[status]}`}>{status}</span>
  }

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
            <button className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
              <Menu className="mx-auto" size={18} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Purchasing</p>
              <h1 className="text-sm font-semibold text-foreground">Purchase</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search PO no. or vendor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-64 text-[11px]"
            />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="h-9 w-40 text-[11px]">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Unbilled">Unbilled</SelectItem>
                <SelectItem value="Partially Billed">Partially Billed</SelectItem>
                <SelectItem value="Billed">Billed</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={currencyFilter} onValueChange={(v) => setCurrencyFilter(v as typeof currencyFilter)}>
              <SelectTrigger className="h-9 w-32 text-[11px]">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Currency</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
            <Button
              style={{ backgroundColor: accent }}
              className="h-9 rounded-md px-4 text-[11px] text-white shadow-sm hover:brightness-110"
              onClick={() => setDialogOpen(true)}
            >
              Add Purchase
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-[11px]">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">PO No</th>
                  <th className="px-3 py-2 text-left">Vendor</th>
                  <th className="px-3 py-2 text-left">Issue Date</th>
                  <th className="px-3 py-2 text-left">Due Date</th>
                  <th className="px-3 py-2 text-left">Subtotal</th>
                  <th className="px-3 py-2 text-left">Tax</th>
                  <th className="px-3 py-2 text-left">Discount</th>
                  <th className="px-3 py-2 text-left">Shipping</th>
                  <th className="px-3 py-2 text-left">Total</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((po, idx) => (
                  <tr key={po.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="px-3 py-2 text-slate-900">{po.poNo}</td>
                    <td className="px-3 py-2 text-slate-900">{po.vendor}</td>
                    <td className="px-3 py-2 text-slate-900">{po.issueDate}</td>
                    <td className="px-3 py-2 text-slate-900">{po.dueDate}</td>
                    <td className="px-3 py-2 text-slate-900">{po.currency} {po.subtotal.toLocaleString()}</td>
                    <td className="px-3 py-2 text-slate-900">{po.currency} {po.tax.toLocaleString()}</td>
                    <td className="px-3 py-2 text-slate-900">{po.currency} {po.discount.toLocaleString()}</td>
                    <td className="px-3 py-2 text-slate-900">{po.currency} {po.shipping.toLocaleString()}</td>
                    <td className="px-3 py-2 text-slate-900">
                      {po.currency} {(po.subtotal + po.tax + po.shipping - po.discount).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{statusBadge(po.status)}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-2 text-[11px]" onClick={() => handleEdit(po)}>
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-[11px] text-rose-600"
                          onClick={() => handleDelete(po.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-sm text-slate-500">
                      No purchase orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ color: accent }}>{editingId ? "Edit Purchase" : "Add Purchase"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">PO No *</Label>
                <Input
                  value={form.poNo}
                  onChange={(e) => setForm((p) => ({ ...p, poNo: e.target.value }))}
                  className="h-9 text-[11px]"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Vendor *</Label>
                <Input
                  value={form.vendor}
                  onChange={(e) => setForm((p) => ({ ...p, vendor: e.target.value }))}
                  className="h-9 text-[11px]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Issue Date *</Label>
                <Input
                  type="date"
                  value={form.issueDate}
                  onChange={(e) => setForm((p) => ({ ...p, issueDate: e.target.value }))}
                  className="h-9 text-[11px]"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Due Date *</Label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                  className="h-9 text-[11px]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Subtotal *</Label>
                <Input
                  type="number"
                  value={form.subtotal || ""}
                  onChange={(e) => setForm((p) => ({ ...p, subtotal: Number(e.target.value) || 0 }))}
                  className="h-9 text-[11px]"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Currency</Label>
                <Select value={form.currency} onValueChange={(v) => setForm((p) => ({ ...p, currency: v }))}>
                  <SelectTrigger className="h-9 text-[11px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Tax</Label>
                <Input
                  type="number"
                  value={form.tax || ""}
                  onChange={(e) => setForm((p) => ({ ...p, tax: Number(e.target.value) || 0 }))}
                  className="h-9 text-[11px]"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Discount</Label>
                <Input
                  type="number"
                  value={form.discount || ""}
                  onChange={(e) => setForm((p) => ({ ...p, discount: Number(e.target.value) || 0 }))}
                  className="h-9 text-[11px]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Shipping</Label>
                <Input
                  type="number"
                  value={form.shipping || ""}
                  onChange={(e) => setForm((p) => ({ ...p, shipping: Number(e.target.value) || 0 }))}
                  className="h-9 text-[11px]"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as Purchase["status"] }))}>
                  <SelectTrigger className="h-9 text-[11px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Unbilled">Unbilled</SelectItem>
                    <SelectItem value="Partially Billed">Partially Billed</SelectItem>
                    <SelectItem value="Billed">Billed</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="text-[11px]" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button style={{ backgroundColor: accent }} className="text-white text-[11px]" onClick={handleAdd}>
              Save Purchase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
