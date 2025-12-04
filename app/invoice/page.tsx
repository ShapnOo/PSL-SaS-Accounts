"use client"

import { useMemo, useState } from "react"
import { Edit, Menu, Trash2 } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Invoice = {
  id: number
  invoiceNo: string
  customer: string
  issueDate: string
  dueDate: string
  subtotal: number
  tax: number
  discount: number
  shipping: number
  paidAmount: number
  status: "Draft" | "Unpaid" | "Partially Paid" | "Paid" | "Overdue"
  currency: string
}

const accent = "#1B254D"

const seedInvoices: Invoice[] = [
  { id: 1, invoiceNo: "INV-1001", customer: "Pakiza Footwear", issueDate: "2024-12-01", dueDate: "2024-12-15", subtotal: 14250, tax: 1000, discount: 0, shipping: 0, paidAmount: 0, status: "Unpaid", currency: "USD" },
  { id: 2, invoiceNo: "INV-1002", customer: "Green Valley Retail", issueDate: "2024-12-03", dueDate: "2024-12-18", subtotal: 8420, tax: 700, discount: 200, shipping: 0, paidAmount: 3000, status: "Partially Paid", currency: "USD" },
  { id: 3, invoiceNo: "INV-1003", customer: "Northwind Traders", issueDate: "2024-12-05", dueDate: "2024-12-20", subtotal: 22000, tax: 1400, discount: 0, shipping: 0, paidAmount: 23400, status: "Paid", currency: "EUR" },
  { id: 4, invoiceNo: "INV-1004", customer: "Crescent Mart", issueDate: "2024-12-07", dueDate: "2024-12-21", subtotal: 5600, tax: 500, discount: 0, shipping: 0, paidAmount: 0, status: "Draft", currency: "USD" },
  { id: 5, invoiceNo: "INV-1005", customer: "Blue River Exports", issueDate: "2024-12-09", dueDate: "2024-12-24", subtotal: 16800, tax: 1200, discount: 110, shipping: 0, paidAmount: 0, status: "Overdue", currency: "USD" },
]

export default function InvoicePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>(seedInvoices)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<Invoice["status"] | "All">("All")
  const [currencyFilter, setCurrencyFilter] = useState<Invoice["currency"] | "All">("All")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<Omit<Invoice, "id">>({
    invoiceNo: "",
    customer: "",
    issueDate: "",
    dueDate: "",
    subtotal: 0,
    tax: 0,
    discount: 0,
    shipping: 0,
    paidAmount: 0,
    status: "Draft",
    currency: "USD",
  })
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; targetId: number | null }>({ open: false, targetId: null })
  const [paymentAmount, setPaymentAmount] = useState(0)

  const filtered = useMemo(
    () =>
      invoices.filter((inv) => {
        const matchSearch = `${inv.invoiceNo} ${inv.customer}`.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === "All" || inv.status === statusFilter
        const matchCurrency = currencyFilter === "All" || inv.currency === currencyFilter
        return matchSearch && matchStatus && matchCurrency
      }),
    [invoices, search, statusFilter, currencyFilter],
  )

  const handleAdd = () => {
    if (!form.invoiceNo || !form.customer || !form.issueDate || !form.dueDate || !form.subtotal) return
    if (editingId) {
      setInvoices((prev) => prev.map((inv) => (inv.id === editingId ? { ...inv, ...form } : inv)))
    } else {
      const next: Invoice = {
        id: invoices.length ? Math.max(...invoices.map((i) => i.id)) + 1 : 1,
        ...form,
      }
      setInvoices((prev) => [next, ...prev])
    }
    setEditingId(null)
    setDialogOpen(false)
    setForm({ invoiceNo: "", customer: "", issueDate: "", dueDate: "", subtotal: 0, tax: 0, discount: 0, shipping: 0, status: "Draft", currency: "USD" })
  }

  const handleEdit = (inv: Invoice) => {
    setForm({
      invoiceNo: inv.invoiceNo,
      customer: inv.customer,
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
      subtotal: inv.subtotal,
      tax: inv.tax,
      discount: inv.discount,
      shipping: inv.shipping,
      paidAmount: inv.paidAmount,
      status: inv.status,
      currency: inv.currency,
    })
    setEditingId(inv.id)
    setDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id))
  }

  const handleMarkPaid = (id: number) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, status: "Paid" } : inv)))
  }

  const statusBadge = (status: Invoice["status"]) => {
    const map: Record<Invoice["status"], string> = {
      Draft: "bg-slate-100 text-slate-700",
      Unpaid: "bg-amber-50 text-amber-700",
      "Partially Paid": "bg-blue-50 text-blue-700",
      Paid: "bg-emerald-50 text-emerald-700",
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
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Sales</p>
              <h1 className="text-sm font-semibold text-foreground">Invoices</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search invoice no. or customer..."
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
                <SelectItem value="Unpaid">Unpaid</SelectItem>
                <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
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
              Add Invoice
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-[11px]">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">Invoice No</th>
                  <th className="px-3 py-2 text-left">Customer</th>
                  <th className="px-3 py-2 text-left">Issue Date</th>
                  <th className="px-3 py-2 text-left">Due Date</th>
                  <th className="px-3 py-2 text-left">Subtotal</th>
                  <th className="px-3 py-2 text-left">Tax</th>
                  <th className="px-3 py-2 text-left">Discount</th>
                  <th className="px-3 py-2 text-left">Shipping</th>
                  <th className="px-3 py-2 text-left">Total</th>
                  <th className="px-3 py-2 text-left">Status</th>
                  <th className="px-3 py-2 text-left">Paid</th>
                  <th className="px-3 py-2 text-left">Balance</th>
                  <th className="px-3 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inv, idx) => (
                  <tr key={inv.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="px-3 py-2 text-slate-900">{inv.invoiceNo}</td>
                    <td className="px-3 py-2 text-slate-900">{inv.customer}</td>
                    <td className="px-3 py-2 text-slate-900">{inv.issueDate}</td>
                    <td className="px-3 py-2 text-slate-900">{inv.dueDate}</td>
                    <td className="px-3 py-2 text-slate-900">{inv.currency} {inv.subtotal.toLocaleString()}</td>
                    <td className="px-3 py-2 text-slate-900">{inv.currency} {inv.tax.toLocaleString()}</td>
                    <td className="px-3 py-2 text-slate-900">{inv.currency} {inv.discount.toLocaleString()}</td>
                    <td className="px-3 py-2 text-slate-900">{inv.currency} {inv.shipping.toLocaleString()}</td>
                    <td className="px-3 py-2 text-slate-900">
                      {inv.currency} {(inv.subtotal + inv.tax + inv.shipping - inv.discount).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{statusBadge(inv.status)}</td>
                    <td className="px-3 py-2 text-slate-900">
                      {inv.currency} {inv.paidAmount.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-slate-900">
                      {inv.currency} {(inv.subtotal + inv.tax + inv.shipping - inv.discount - inv.paidAmount).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-2 text-[11px]" onClick={() => handleEdit(inv)}>
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-[11px] text-rose-600"
                          onClick={() => handleDelete(inv.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </Button>
                        {inv.status !== "Paid" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-[11px] text-emerald-700"
                            onClick={() => setPaymentModal({ open: true, targetId: inv.id })}
                          >
                            Record Payment
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-sm text-slate-500">
                      No invoices found
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
            <DialogTitle style={{ color: accent }}>{editingId ? "Edit Invoice" : "Add Invoice"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Invoice No *</Label>
                <Input
                  value={form.invoiceNo}
                  onChange={(e) => setForm((p) => ({ ...p, invoiceNo: e.target.value }))}
                  className="h-9 text-[11px]"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Customer *</Label>
                <Input
                  value={form.customer}
                  onChange={(e) => setForm((p) => ({ ...p, customer: e.target.value }))}
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
                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as Invoice["status"] }))}>
                  <SelectTrigger className="h-9 text-[11px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                    <SelectItem value="Partially Paid">Partially Paid</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
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
              Save Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
