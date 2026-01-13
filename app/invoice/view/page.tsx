"use client"

import { useMemo, useState } from "react"
import { Calendar, Download, Menu, Printer } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const invoice = {
  number: "INV-000011",
  client: "InflyInvoices",
  quoteDate: "2026-01-13",
  dueDate: "2026-01-14",
  status: "Unpaid",
  recurring: true,
  currency: "USD",
  paymentQr: "ABA",
  lines: [
    { id: 1, product: "Consulting Services", qty: 10, unitPrice: 250, tax: 5 },
    { id: 2, product: "Support Retainer", qty: 1, unitPrice: 1200, tax: 0 },
  ],
  discountType: "Before Tax",
  discountValue: 5,
  notes: "Payment due within 14 days. Late fees may apply.",
}

export default function InvoiceViewPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const totals = useMemo(() => {
    const subtotal = invoice.lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0)
    const discount = subtotal * (invoice.discountValue / 100)
    const taxableBase = Math.max(subtotal - discount, 0)
    const tax = invoice.lines.reduce((sum, l) => sum + l.qty * l.unitPrice * (l.tax / 100), 0)
    const total = taxableBase + tax
    return { subtotal, discount, tax, total }
  }, [])

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
              <h1 className="text-sm font-semibold text-foreground">View Invoice</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button size="sm" className="gap-2">
              <Download className="h-4 w-4" /> Download PDF
            </Button>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4 print:p-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-slate-900">Invoice {invoice.number}</h2>
              <p className="text-sm text-slate-600">Issued to {invoice.client}</p>
            </div>
            <Badge variant="secondary" className="text-xs font-semibold">{invoice.status}</Badge>
          </div>

          <Card className="border border-border/70 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Basic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <InfoItem label="Client" value={invoice.client} />
                <InfoItem label="Invoice Number" value={invoice.number} />
                <InfoItem label="Quote Date" value={invoice.quoteDate} icon />
                <InfoItem label="Due Date" value={invoice.dueDate} icon />
                <InfoItem label="Status" value={invoice.status} />
                <InfoItem label="Currency" value={invoice.currency} />
                <InfoItem label="Payment QR Code" value={invoice.paymentQr} />
                <InfoItem label="Recurring" value={invoice.recurring ? "Yes" : "No"} />
                <InfoItem label="Discount Type" value={`${invoice.discountValue}% (${invoice.discountType})`} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="overflow-x-auto rounded-md border border-slate-200">
                <table className="min-w-full text-xs">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-left">Qty</th>
                      <th className="px-3 py-2 text-left">Unit Price</th>
                      <th className="px-3 py-2 text-left">Tax %</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.lines.map((line) => {
                      const amount = line.qty * line.unitPrice + line.qty * line.unitPrice * (line.tax / 100)
                      return (
                        <tr key={line.id} className="border-t">
                          <td className="px-3 py-2 text-slate-900">{line.product}</td>
                          <td className="px-3 py-2 text-slate-700">{line.qty}</td>
                          <td className="px-3 py-2 text-slate-700">{line.unitPrice.toFixed(2)}</td>
                          <td className="px-3 py-2 text-slate-700">{line.tax}%</td>
                          <td className="px-3 py-2 text-right font-semibold text-slate-900">{amount.toFixed(2)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex justify-between">
                  <span>Sub Total :</span>
                  <span className="font-semibold">{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount :</span>
                  <span className="font-semibold">-{totals.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax :</span>
                  <span className="font-semibold">{totals.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-slate-900">
                  <span>Total :</span>
                  <span>{totals.total.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-600">Notes & Terms</p>
                <p className="rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-slate-700">
                  {invoice.notes}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function InfoItem({ label, value, icon = false }: { label: string; value: string; icon?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <p className="flex items-center gap-1 text-sm font-semibold text-slate-900">
        {icon && <Calendar className="h-4 w-4 text-slate-400" />}
        {value}
      </p>
    </div>
  )
}
