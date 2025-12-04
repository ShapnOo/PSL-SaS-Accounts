"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileSearch, Menu } from "lucide-react"

type LogRow = {
  id: number
  actor: string
  action: string
  entity: string
  timestamp: string
  ip: string
  status: "Success" | "Failed"
}

const seedLogs: LogRow[] = [
  { id: 1, actor: "Tahmid Afsar", action: "Updated Role", entity: "Admin", timestamp: "03/12/2025 09:12", ip: "10.0.0.12", status: "Success" },
  { id: 2, actor: "Sohanur Rahr", action: "Login", entity: "Portal", timestamp: "02/12/2025 21:44", ip: "10.0.0.77", status: "Failed" },
]

export default function AuditLogsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState("")

  const filtered = useMemo(
    () =>
      seedLogs.filter((row) =>
        [row.actor, row.action, row.entity, row.timestamp, row.ip, row.status].join(" ").toLowerCase().includes(search.toLowerCase()),
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
              <h1 className="text-sm font-semibold text-foreground">Audit Logs</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4 space-y-3">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Input placeholder="Search by user/action/entity" className="h-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              <Input placeholder="Date from" type="date" className="h-10" />
              <Input placeholder="Date to" type="date" className="h-10" />
              <Input placeholder="IP Address" className="h-10" />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button className="px-5 gap-2">
                <FileSearch className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="px-5">
                Reset
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-3">
            <div className="flex items-center justify-between pb-3">
              <div className="text-xs text-muted-foreground">Recent Activity</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200 text-sm shadow-sm">
                <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  <tr>
                    <th className="border border-slate-200 px-3 py-2 text-left">Actor</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Action</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Entity</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Timestamp</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">IP</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.actor}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.action}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.entity}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.timestamp}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.ip}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.status}</td>
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
