"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Plug } from "lucide-react"

type IntegrationRow = {
  id: number
  name: string
  category: string
  status: "Connected" | "Not Connected"
  lastSync: string
}

const seedIntegrations: IntegrationRow[] = [
  { id: 1, name: "Stripe", category: "Billing", status: "Connected", lastSync: "03/12/2025 08:15" },
  { id: 2, name: "Slack", category: "Notifications", status: "Connected", lastSync: "03/12/2025 07:40" },
  { id: 3, name: "Azure AD", category: "Identity", status: "Not Connected", lastSync: "-" },
]

export default function IntegrationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () =>
      seedIntegrations.filter((row) =>
        [row.name, row.category, row.status, row.lastSync].join(" ").toLowerCase().includes(search.toLowerCase()),
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
              <h1 className="text-sm font-semibold text-foreground">Integrations</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4 space-y-3">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Input placeholder="Search integrations..." className="h-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm">
                <option>Category</option>
                <option>Billing</option>
                <option>Notifications</option>
                <option>Identity</option>
                <option>Data Sync</option>
              </select>
              <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm">
                <option>Status</option>
                <option>Connected</option>
                <option>Not Connected</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button className="px-5 gap-2">
                <Plug className="h-4 w-4" />
                Add Integration
              </Button>
              <Button variant="outline" className="px-5">
                Reset
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-3">
            <div className="flex items-center justify-between pb-3">
              <div className="text-xs text-muted-foreground">Connections</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200 text-sm shadow-sm">
                <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  <tr>
                    <th className="border border-slate-200 px-3 py-2 text-left">Integration</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Category</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Status</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Last Sync</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.name}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.category}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.status}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.lastSync}</td>
                      <td className="border border-slate-200 px-3 py-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline">
                            Manage
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="border border-slate-200 px-3 py-6 text-center text-sm text-muted-foreground">
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
