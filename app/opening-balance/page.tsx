"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileSpreadsheet, FileText, Menu, Pencil, Printer, Trash2 } from "lucide-react"

type OpeningRow = {
  id: number
  sl: number
  accountHead: string
  costCenter: string
  openingDate: string
  debit: number
  credit: number
  invoiceNo: string
  referenceNo: string
  supplier: string
  customer: string
  employee: string
}

const seedRows: OpeningRow[] = [
  {
    id: 1,
    sl: 1,
    accountHead: "AR Cripton ERP",
    costCenter: "Cripton Pro VAT",
    openingDate: "01/07/2025",
    debit: 5250,
    credit: 0,
    invoiceNo: "2025/10316",
    referenceNo: "",
    supplier: "",
    customer: "Habitus Fashion Limited",
    employee: "",
  },
  {
    id: 2,
    sl: 2,
    accountHead: "Safety & Security Equipment",
    costCenter: "Cripton Pro VAT",
    openingDate: "01/07/2025",
    debit: 20000,
    credit: 0,
    invoiceNo: "",
    referenceNo: "",
    supplier: "",
    customer: "N.R Spinning Mills Limited",
    employee: "",
  },
]

export default function OpeningBalancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [accountName, setAccountName] = useState("Select...")
  const [costCenter, setCostCenter] = useState("Select...")
  const [supplier, setSupplier] = useState("Select...")
  const [customer, setCustomer] = useState("Select...")
  const [employee, setEmployee] = useState("Select...")
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () =>
      seedRows.filter((row) =>
        [row.accountHead, row.costCenter, row.customer, row.supplier, row.employee, row.invoiceNo, row.referenceNo]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search],
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
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Chart of Accounts</p>
              <h1 className="text-sm font-semibold text-foreground">Opening Balance</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4 space-y-4">
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Account Name</p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                >
                  <option>Select...</option>
                  <option>AR Cripton ERP</option>
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Cost Center</p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm"
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                >
                  <option>Select...</option>
                  <option>Cripton Pro VAT</option>
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Debit</p>
                <Input type="number" placeholder="0.00" className="h-10" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Credit</p>
                <Input type="number" placeholder="0.00" className="h-10" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Opening Date</p>
                <Input type="date" className="h-10" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Invoice Number</p>
                <Input placeholder="Invoice Number" className="h-10" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Reference Number</p>
                <Input placeholder="Reference Number" className="h-10" />
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Supplier</p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                >
                  <option>Select...</option>
                  <option>N.R Spinning Mills Limited</option>
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Customer Name</p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm"
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                >
                  <option>Select...</option>
                  <option>Habitus Fashion Limited</option>
                </select>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Employee Name</p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm"
                  value={employee}
                  onChange={(e) => setEmployee(e.target.value)}
                >
                  <option>Select...</option>
                  <option>Tahmid Afsar</option>
                </select>
              </div>
              <div className="space-y-1 md:col-span-2 lg:col-span-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Narration</p>
                <Input placeholder="Narration" className="h-10" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button className="px-5">Add</Button>
              <Button variant="outline" className="px-5">
                Reset
              </Button>
              <div className="ml-auto flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <FileSpreadsheet className="h-4 w-4" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <FileText className="h-4 w-4" />
                  PDF
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-3">
            <div className="flex items-center justify-end pb-3">
              <Input
                placeholder="Search..."
                className="h-9 w-full max-w-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200 text-sm shadow-sm">
                <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  <tr>
                    <th className="border border-slate-200 px-3 py-2 text-left">SL No</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Account Head</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Cost Center Name</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Opening Date</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Debit</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Credit</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Invoice No</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Reference No</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Supplier</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Customer</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Emp Name</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="border border-slate-200 px-3 py-2">{row.sl}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.accountHead}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.costCenter}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.openingDate}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.debit.toLocaleString()}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.credit.toLocaleString()}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.invoiceNo}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.referenceNo}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.supplier}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.customer}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.employee}</td>
                      <td className="border border-slate-200 px-3 py-2">
                        <div className="flex items-center gap-2 justify-end">
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 inline-flex items-center gap-1">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 inline-flex items-center gap-1">
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={12} className="border border-slate-200 px-3 py-6 text-center text-sm text-muted-foreground">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between pt-3 text-xs text-muted-foreground">
              <span>Showing 1 to {filtered.length} of {seedRows.length} entries</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm">Previous</Button>
                <Button size="sm">1</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
