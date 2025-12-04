"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Pencil, Trash2 } from "lucide-react"

type CompanyRow = {
  id: number
  name: string
  code: string
  currency: string
  fiscalYear: string
  subdomain: string
  plan: "Starter" | "Growth" | "Enterprise"
  region: string
  status: "Active" | "Inactive"
}

const seedCompanies: CompanyRow[] = [
  {
    id: 1,
    name: "Pakiza Accounts",
    code: "PKZ",
    currency: "USD",
    fiscalYear: "2025-2026",
    subdomain: "pakiza",
    plan: "Enterprise",
    region: "US-East",
    status: "Active",
  },
  {
    id: 2,
    name: "Cripton Labs",
    code: "CRP",
    currency: "EUR",
    fiscalYear: "2024-2025",
    subdomain: "cripton",
    plan: "Growth",
    region: "EU-West",
    status: "Active",
  },
]

export default function CompanySetupPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () =>
      seedCompanies.filter((row) =>
        [row.name, row.code, row.currency, row.fiscalYear, row.status].join(" ").toLowerCase().includes(search.toLowerCase()),
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
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Administration</p>
              <h1 className="text-sm font-semibold text-foreground">Company Setup</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4 space-y-3">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Input placeholder="Company Name" className="h-10" />
              <Input placeholder="Company Code" className="h-10" />
              <Input placeholder="Currency" className="h-10" />
              <Input placeholder="Fiscal Year (e.g., 2025-2026)" className="h-10" />
              <Input placeholder="Subdomain (e.g., company)" className="h-10" />
              <Input placeholder="Data Region (e.g., US-East)" className="h-10" />
              <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm">
                <option>Plan</option>
                <option>Starter</option>
                <option>Growth</option>
                <option>Enterprise</option>
              </select>
              <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm">
                <option>Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button className="px-5">Save</Button>
              <Button variant="outline" className="px-5">
                Reset
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-3">
            <div className="flex items-center justify-between pb-3">
              <div className="text-xs text-muted-foreground">Companies</div>
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
                    <th className="border border-slate-200 px-3 py-2 text-left">Name</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Code</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Subdomain</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Currency</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Fiscal Year</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Plan</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Region</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Status</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.name}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.code}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.subdomain}.yourapp.com</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.currency}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.fiscalYear}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.plan}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.region}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.status}</td>
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
                      <td colSpan={6} className="border border-slate-200 px-3 py-6 text-center text-sm text-muted-foreground">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
