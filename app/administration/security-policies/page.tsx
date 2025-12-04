"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Shield } from "lucide-react"

type PolicyRow = {
  id: number
  name: string
  requirement: string
  enforced: boolean
  scope: string
}

const seedPolicies: PolicyRow[] = [
  { id: 1, name: "MFA Required", requirement: "Enforce MFA for all users", enforced: true, scope: "All Companies" },
  { id: 2, name: "Password Policy", requirement: "12 chars, rotation 90 days", enforced: true, scope: "All Companies" },
  { id: 3, name: "IP Allowlist", requirement: "Office IPs only", enforced: false, scope: "Pakiza Accounts" },
]

export default function SecurityPoliciesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState("")
  const [scope, setScope] = useState("All Companies")

  const filtered = useMemo(
    () =>
      seedPolicies.filter((row) => {
        const matchesSearch = [row.name, row.requirement, row.scope, row.enforced ? "enforced" : "not"].join(" ").toLowerCase().includes(search.toLowerCase())
        const matchesScope = scope === "All Companies" || row.scope === scope
        return matchesSearch && matchesScope
      }),
    [search, scope],
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
              <h1 className="text-sm font-semibold text-foreground">Security Policies</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4 space-y-3">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Input placeholder="Policy Name" className="h-10" />
              <Input placeholder="Requirement" className="h-10" />
              <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm" value={scope} onChange={(e) => setScope(e.target.value)}>
                <option>All Companies</option>
                <option>Pakiza Accounts</option>
                <option>Cripton Labs</option>
              </select>
              <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm">
                <option>Enforced?</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button className="px-5 gap-2">
                <Shield className="h-4 w-4" />
                Save Policy
              </Button>
              <Button variant="outline" className="px-5">
                Reset
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
              <div className="text-xs text-muted-foreground">Policies</div>
              <div className="flex flex-wrap items-center gap-2">
                <select className="h-9 rounded-md border border-border/80 bg-white px-3 text-sm" value={scope} onChange={(e) => setScope(e.target.value)}>
                  <option>All Companies</option>
                  <option>Pakiza Accounts</option>
                  <option>Cripton Labs</option>
                </select>
                <Input
                  placeholder="Search..."
                  className="h-9 w-full max-w-xs"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-slate-200 text-sm shadow-sm">
                <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                  <tr>
                    <th className="border border-slate-200 px-3 py-2 text-left">Policy</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Scope</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Requirement</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Enforced</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.name}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.scope}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.requirement}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.enforced ? "Yes" : "No"}</td>
                      <td className="border border-slate-200 px-3 py-2">
                        <div className="flex items-center gap-2 justify-end">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline">
                            Delete
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
