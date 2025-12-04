"use client"

import { useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, Menu } from "lucide-react"

const invoices = [
  { id: "INV-2025-001", period: "Nov 2025", amount: "$499", status: "Paid", date: "01/12/2025" },
  { id: "INV-2025-002", period: "Dec 2025", amount: "$499", status: "Due", date: "01/01/2026" },
]

export default function BillingPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Administration</p>
              <h1 className="text-sm font-semibold text-foreground">Billing & Subscription</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">Plan</p>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-border/70 bg-white p-3">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Current Plan</p>
                <p className="text-lg font-semibold">Enterprise</p>
                <p className="text-sm text-muted-foreground">Users: 250 • Workspaces: Unlimited</p>
              </div>
              <div className="rounded-lg border border-border/70 bg-white p-3 space-y-2">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Payment Method</p>
                <Input placeholder="Card ending 4242" className="h-10" />
                <Button className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Update Card
                </Button>
              </div>
              <div className="rounded-lg border border-border/70 bg-white p-3 space-y-2">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Billing Email</p>
                <Input placeholder="billing@company.com" className="h-10" />
                <Button variant="outline">Save</Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-3">
            <div className="flex items-center justify-between pb-3">
              <div className="text-xs text-muted-foreground">Invoices</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200 text-sm shadow-sm">
                <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  <tr>
                    <th className="border border-slate-200 px-3 py-2 text-left">Invoice</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Period</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Amount</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Status</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Date</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv, idx) => (
                    <tr key={inv.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{inv.id}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{inv.period}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{inv.amount}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{inv.status}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{inv.date}</td>
                      <td className="border border-slate-200 px-3 py-2 text-right">
                        <Button variant="outline" size="sm">Download</Button>
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
