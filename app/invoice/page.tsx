"use client"

import { useMemo, useState } from "react"
import { Calendar, Menu, Plus, Trash2 } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

type LineItem = {
  id: number
  product: string
  qty: number
  price: number
  taxRate: number
}

type InvoiceRow = {
  id: number
  invoiceNo: string
  client: string
  status: string
  issueDate: string
  dueDate: string
  currency: string
  total: number
}

const clients = ["InflyInvoices", "Blue River Exports", "Crescent Mart", "Northwind Traders"]
const currencies = ["USD", "EUR", "GBP"]
const statuses = ["Draft", "Unpaid", "Partially Paid", "Paid"]
const discounts = ["Before Tax", "After Tax"]

const seedInvoices: InvoiceRow[] = [
  { id: 1, invoiceNo: "INV-000845", client: "InflyInvoices", status: "Unpaid", issueDate: "2026-01-10", dueDate: "2026-01-24", currency: "USD", total: 12400 },
  { id: 2, invoiceNo: "INV-000846", client: "Blue River Exports", status: "Draft", issueDate: "2026-01-11", dueDate: "2026-01-26", currency: "USD", total: 8200 },
  { id: 3, invoiceNo: "INV-000847", client: "Crescent Mart", status: "Paid", issueDate: "2026-01-09", dueDate: "2026-01-15", currency: "GBP", total: 5400 },
]

const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Draft: "bg-slate-100 text-slate-700",
    Unpaid: "bg-amber-50 text-amber-700",
    "Partially Paid": "bg-blue-50 text-blue-700",
    Paid: "bg-emerald-50 text-emerald-700",
  }
  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ${map[status] ?? "bg-slate-100 text-slate-700"}`}>{status}</span>
}

export default function InvoiceCreatePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [showCreate, setShowCreate] = useState(false)
  const [invoices, setInvoices] = useState<InvoiceRow[]>(seedInvoices)
  const [customers, setCustomers] = useState<string[]>(clients)
  const [customerDialogOpen, setCustomerDialogOpen] = useState(false)
  const [customerForm, setCustomerForm] = useState({
    name: "",
    address: "",
    phone: "",
    vatNo: "",
    tinNo: "",
    registrationNo: "",
    crmClient: "",
  })
  const [viewInvoice, setViewInvoice] = useState<InvoiceRow | null>(null)

  const [form, setForm] = useState({
    client: "",
    invoicePrefix: "INV-",
    invoiceNumber: "0000011",
    quoteDate: "2026-01-13",
    dueDate: "2026-01-14",
    status: "Unpaid",
    currency: "USD",
    isRecurring: false,
    note: "",
    discountType: "After Tax" as "Before Tax" | "After Tax",
    discountValue: 0,
    summaryDiscountType: "Flat" as "Flat" | "Percent",
  })

  const [lines, setLines] = useState<LineItem[]>([
    { id: 1, product: "", qty: 1, price: 0, taxRate: 0 },
  ])

  const totals = useMemo(() => {
    const subtotal = lines.reduce((sum, l) => sum + l.qty * l.price, 0)
    const tax = lines.reduce((sum, l) => sum + l.qty * l.price * (l.taxRate / 100), 0)
    const discountAmount =
      form.summaryDiscountType === "Percent" ? subtotal * (form.discountValue / 100) : form.discountValue

    if (form.discountType === "Before Tax") {
      const taxable = Math.max(subtotal - discountAmount, 0)
      const total = taxable + tax
      return { subtotal, tax, discount: discountAmount, total }
    }

    const total = subtotal + tax - discountAmount
    return { subtotal, tax, discount: discountAmount, total }
  }, [lines, form.discountType, form.discountValue, form.summaryDiscountType])

  const updateLine = (id: number, patch: Partial<LineItem>) => {
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, ...patch } : line)))
  }

  const addLine = () => {
    setLines((prev) => [...prev, { id: prev.length ? Math.max(...prev.map((l) => l.id)) + 1 : 1, product: "", qty: 1, price: 0, taxRate: 0 }])
  }

  const removeLine = (id: number) => setLines((prev) => prev.filter((l) => l.id !== id))

  const handleSave = (status: string) => {
    if (!form.client || !form.invoiceNumber || !form.dueDate || !form.quoteDate) return
    const record: InvoiceRow = {
      id: Date.now(),
      invoiceNo: `${form.invoicePrefix}${form.invoiceNumber}`,
      client: form.client,
      status,
      issueDate: form.quoteDate,
      dueDate: form.dueDate,
      currency: form.currency,
      total: totals.total,
    }
    setInvoices((prev) => [record, ...prev])
    setShowCreate(false)
    setLines([{ id: 1, product: "", qty: 1, price: 0, taxRate: 0 }])
    setForm((p) => ({ ...p, client: "", invoiceNumber: "0000011", note: "", discountValue: 0 }))
  }

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
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Invoices</p>
              <h1 className="text-sm font-semibold text-foreground">Invoices</h1>
            </div>
          </div>
          <Button size="sm" onClick={() => setShowCreate(true)}>Create Invoice</Button>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          {!showCreate && (
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-xs">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                  <tr>
                    <th className="px-3 py-2 text-left">Invoice</th>
                    <th className="px-3 py-2 text-left">Client</th>
                    <th className="px-3 py-2 text-left">Issue Date</th>
                    <th className="px-3 py-2 text-left">Due Date</th>
                    <th className="px-3 py-2 text-left">Total</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-t">
                      <td className="px-3 py-2 text-slate-900 font-semibold">{inv.invoiceNo}</td>
                      <td className="px-3 py-2 text-slate-700">{inv.client}</td>
                      <td className="px-3 py-2 text-slate-700">{inv.issueDate}</td>
                      <td className="px-3 py-2 text-slate-700">{inv.dueDate}</td>
                      <td className="px-3 py-2 text-slate-900">{inv.currency} {inv.total.toLocaleString()}</td>
                      <td className="px-3 py-2">{statusBadge(inv.status)}</td>
                      <td className="px-3 py-2">
                        <Button variant="outline" size="sm" className="h-8 px-2 text-[11px]" onClick={() => setViewInvoice(inv)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {invoices.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-4 text-center text-slate-500">No invoices yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {showCreate && (
            <div className="space-y-5 max-w-5xl mx-auto">
              <Card className="border border-border/70 bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Basic Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-slate-600">Client *</Label>
                        <Button variant="outline" size="sm" className="h-8 text-[11px]" onClick={() => setCustomerDialogOpen(true)}>
                          New Customer
                        </Button>
                      </div>
                      <Select value={form.client} onValueChange={(v) => setForm((p) => ({ ...p, client: v }))}>
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                        <SelectContent>
                          {customers.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Invoice Number *</Label>
                      <div className="grid grid-cols-[minmax(140px,1fr)_minmax(140px,1fr)] gap-3 items-end">
                        <Input
                          value={form.invoicePrefix}
                          onChange={(e) => setForm((p) => ({ ...p, invoicePrefix: e.target.value }))}
                          className="h-10 text-sm"
                        />
                        <Input
                          value={form.invoiceNumber}
                          onChange={(e) => setForm((p) => ({ ...p, invoiceNumber: e.target.value }))}
                          className="h-10 text-sm"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Quote Date *</Label>
                      <Input
                        type="date"
                        value={form.quoteDate}
                        onChange={(e) => setForm((p) => ({ ...p, quoteDate: e.target.value }))}
                        className="h-10 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Due Date *</Label>
                      <Input
                        type="date"
                        value={form.dueDate}
                        onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
                        className="h-10 text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Status *</Label>
                      <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-slate-600">Currency</Label>
                      <Select value={form.currency} onValueChange={(v) => setForm((p) => ({ ...p, currency: v }))}>
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end gap-3">
                      <Switch checked={form.isRecurring} onCheckedChange={(v) => setForm((p) => ({ ...p, isRecurring: v }))} />
                      <span className="text-xs text-slate-700">This is recurring invoice</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/70 bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto rounded-md border border-slate-200">
                    <table className="min-w-full text-xs">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 text-left">Product *</th>
                          <th className="px-3 py-2 text-left">Qty *</th>
                          <th className="px-3 py-2 text-left">Unit Price *</th>
                          <th className="px-3 py-2 text-left">Tax %</th>
                          <th className="px-3 py-2 text-left">Amount</th>
                          <th className="px-3 py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {lines.map((line) => {
                          const amount = line.qty * line.price + line.qty * line.price * (line.taxRate / 100)
                          return (
                            <tr key={line.id} className="border-t">
                              <td className="px-3 py-2">
                                <Input
                                  value={line.product}
                                  onChange={(e) => updateLine(line.id, { product: e.target.value })}
                                  placeholder="Select Product or free text"
                                  className="h-9 text-xs"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="number"
                                  value={line.qty}
                                  onChange={(e) => updateLine(line.id, { qty: Number(e.target.value) || 0 })}
                                  className="h-9 text-xs"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="number"
                                  value={line.price}
                                  onChange={(e) => updateLine(line.id, { price: Number(e.target.value) || 0 })}
                                  className="h-9 text-xs"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <Input
                                  type="number"
                                  value={line.taxRate}
                                  onChange={(e) => updateLine(line.id, { taxRate: Number(e.target.value) || 0 })}
                                  className="h-9 text-xs"
                                />
                              </td>
                              <td className="px-3 py-2 text-right font-semibold text-slate-900">{amount.toFixed(2)}</td>
                              <td className="px-3 py-2">
                                <Button variant="outline" size="sm" className="h-8 px-2 text-[11px]" onClick={() => removeLine(line.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                        {lines.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-3 py-3 text-center text-slate-500">
                              Add at least one product
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <Button variant="outline" size="sm" className="h-9 text-xs" onClick={addLine}>
                    <Plus className="h-4 w-4 mr-1" /> Add Product
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-border/70 bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={form.discountType === "Before Tax"}
                          onCheckedChange={(checked) => setForm((p) => ({ ...p, discountType: checked ? "Before Tax" : "After Tax" }))}
                        />
                        <span className="text-xs text-slate-700">Discount %(applied before tax)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-600">Discount</Label>
                          <Input
                            type="number"
                            value={form.discountValue || ""}
                            onChange={(e) => setForm((p) => ({ ...p, discountValue: Number(e.target.value) || 0 }))}
                            className="h-9 text-xs"
                            placeholder="Discount"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-slate-600">Discount Type</Label>
                          <Select
                            value={form.summaryDiscountType}
                            onValueChange={(v) => setForm((p) => ({ ...p, summaryDiscountType: v as "Flat" | "Percent" }))}
                          >
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue placeholder="Select Discount Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Flat">Flat</SelectItem>
                              <SelectItem value="Percent">Percent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-slate-600">Notes & Terms</Label>
                        <Textarea
                          value={form.note}
                          onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                          className="text-xs"
                          placeholder="Add note and terms"
                        />
                      </div>
                    </div>
                    <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700">
                      <div className="flex justify-between">
                        <span>Sub Total :</span>
                        <span className="font-semibold">{totals.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax :</span>
                        <span className="font-semibold">{totals.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount :</span>
                        <span className="font-semibold">{totals.discount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base font-semibold text-slate-900">
                        <span>Total :</span>
                        <span>{totals.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="h-9 text-xs">
                      Add Note & Terms
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="h-10 px-4 text-sm" onClick={() => handleSave("Draft")}>
                  Save As Draft
                </Button>
                <Button className="h-10 px-4 text-sm" onClick={() => handleSave("Unpaid")}>
                  Save & Send
                </Button>
                <Button variant="outline" className="h-10 px-4 text-sm" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Dialog open={customerDialogOpen} onOpenChange={setCustomerDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Customer Information</DialogTitle>
            <p className="text-xs text-slate-500">Add new customer details</p>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs text-slate-700">Name *</Label>
              <Input
                value={customerForm.name}
                onChange={(e) => setCustomerForm((p) => ({ ...p, name: e.target.value }))}
                className="h-10 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-700">Address</Label>
              <Input
                value={customerForm.address}
                onChange={(e) => setCustomerForm((p) => ({ ...p, address: e.target.value }))}
                className="h-10 text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-700">Phone</Label>
                <Input
                  value={customerForm.phone}
                  onChange={(e) => setCustomerForm((p) => ({ ...p, phone: e.target.value }))}
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-700">Vat No</Label>
                <Input
                  value={customerForm.vatNo}
                  onChange={(e) => setCustomerForm((p) => ({ ...p, vatNo: e.target.value }))}
                  className="h-10 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-700">Tin No</Label>
                <Input
                  value={customerForm.tinNo}
                  onChange={(e) => setCustomerForm((p) => ({ ...p, tinNo: e.target.value }))}
                  className="h-10 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-700">Registration No</Label>
                <Input
                  value={customerForm.registrationNo}
                  onChange={(e) => setCustomerForm((p) => ({ ...p, registrationNo: e.target.value }))}
                  className="h-10 text-sm"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-700">CRM Client</Label>
              <Select value={customerForm.crmClient} onValueChange={(v) => setCustomerForm((p) => ({ ...p, crmClient: v }))}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select Client" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setCustomerDialogOpen(false)}>Close</Button>
            <Button
              onClick={() => {
                if (!customerForm.name.trim()) return
                setCustomers((prev) => Array.from(new Set([customerForm.name, ...prev])))
                setForm((p) => ({ ...p, client: customerForm.name }))
                setCustomerForm({ name: "", address: "", phone: "", vatNo: "", tinNo: "", registrationNo: "", crmClient: "" })
                setCustomerDialogOpen(false)
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewInvoice} onOpenChange={(open) => setViewInvoice(open ? viewInvoice : null)}>
        <DialogContent className="sm:max-w-3xl print:max-w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Invoice Preview</span>
              {viewInvoice ? <Badge>{viewInvoice.status}</Badge> : null}
            </DialogTitle>
            {viewInvoice && (
              <p className="text-xs text-slate-500">
                {viewInvoice.invoiceNo} · {viewInvoice.client}
              </p>
            )}
          </DialogHeader>
          {viewInvoice && (
            <div className="space-y-4 print:space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Client</p>
                  <p className="font-semibold text-slate-900">{viewInvoice.client}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Invoice No</p>
                  <p className="font-semibold text-slate-900">{viewInvoice.invoiceNo}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Issue Date</p>
                  <p className="font-semibold text-slate-900">{viewInvoice.issueDate}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500">Due Date</p>
                  <p className="font-semibold text-slate-900">{viewInvoice.dueDate}</p>
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Total</span>
                  <span className="font-semibold text-slate-900">{viewInvoice.currency} {viewInvoice.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Status</span>
                  <span>{viewInvoice.status}</span>
                </div>
              </div>
              <div className="flex gap-2 print:hidden">
                <Button variant="outline" onClick={() => setViewInvoice(null)}>Close</Button>
                <Button onClick={() => window.print()}>Print</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
