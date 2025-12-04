"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil } from "lucide-react"

type CoaRow = {
  id: number
  moduleName: string
  featureName: string
  voucherType: string
  accountHead: string
  mode: "Dr" | "Cr"
  itemCategory: string
}

const moduleOptions = ["Select...", "INV", "PUR", "FIN"]
const documentOptions = ["Select...", "MRR", "PO", "Invoice"]

const seedRows: CoaRow[] = [
  {
    id: 1,
    moduleName: "INV",
    featureName: "MRR",
    voucherType: "Inventory Voucher",
    accountHead: "Stationary Payable Clearing A/C",
    mode: "Cr",
    itemCategory: "General Stationary",
  },
  {
    id: 2,
    moduleName: "INV",
    featureName: "MRR",
    voucherType: "Inventory Voucher",
    accountHead: "Printing, Stationaries & Office Supplies Stock",
    mode: "Dr",
    itemCategory: "General Stationary",
  },
]

export default function ModuleWiseCoaListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [module, setModule] = useState(moduleOptions[0])
  const [document, setDocument] = useState(documentOptions[0])
  const [rows] = useState<CoaRow[]>(seedRows)

  const filtered = useMemo(
    () =>
      rows.filter(
        (row) =>
          (module === "Select..." || row.moduleName === module) &&
          (document === "Select..." || row.featureName === document),
      ),
    [rows, module, document],
  )

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
              <Pencil className="h-5 w-5 rotate-45" />
            </Button>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Chart of Accounts</p>
              <h1 className="text-sm font-semibold text-foreground">Module wise COA List</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4">
            <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] items-end">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Module Name</p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                  value={module}
                  onChange={(e) => setModule(e.target.value)}
                >
                  {moduleOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Document Name <span className="text-amber-500">*</span>
                </p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                >
                  {documentOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <Button className="h-10 px-6">Search</Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-200 text-sm shadow-sm">
              <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  <th className="border border-slate-200 px-3 py-2 text-left">Module Name</th>
                  <th className="border border-slate-200 px-3 py-2 text-left">Feature Name</th>
                  <th className="border border-slate-200 px-3 py-2 text-left">Voucher Type</th>
                  <th className="border border-slate-200 px-3 py-2 text-left">Account Head</th>
                  <th className="border border-slate-200 px-3 py-2 text-left">Mode</th>
                  <th className="border border-slate-200 px-3 py-2 text-left">Item Category</th>
                  <th className="border border-slate-200 px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="border border-slate-200 px-3 py-2 text-foreground">{row.moduleName}</td>
                    <td className="border border-slate-200 px-3 py-2 text-foreground">{row.featureName}</td>
                    <td className="border border-slate-200 px-3 py-2 text-foreground">{row.voucherType}</td>
                    <td className="border border-slate-200 px-3 py-2 text-foreground">{row.accountHead}</td>
                    <td className="border border-slate-200 px-3 py-2 text-foreground">{row.mode}</td>
                    <td className="border border-slate-200 px-3 py-2 text-foreground">{row.itemCategory}</td>
                    <td className="border border-slate-200 px-3 py-2">
                      <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 inline-flex items-center gap-1">
                        <Pencil className="h-3.5 w-3.5" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="border border-slate-200 px-3 py-6 text-center text-sm text-muted-foreground">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
