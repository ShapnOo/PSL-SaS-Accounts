"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Pencil, Shield, Trash2 } from "lucide-react"

type PermissionRow = {
  id: number
  user: string
  role: string
  module: string
  company: string
  status: "Active" | "Suspended"
  lastUpdated: string
  canView: boolean
  canEdit: boolean
}

const seedPermissions: PermissionRow[] = [
  {
    id: 1,
    user: "Tahmid Afsar",
    role: "Admin",
    module: "Financial Period",
    company: "Pakiza Accounts",
    status: "Active",
    lastUpdated: "02/12/2025",
    canView: true,
    canEdit: true,
  },
  {
    id: 2,
    user: "Sohanur Rahr",
    role: "Manager",
    module: "Voucher List",
    company: "Cripton Labs",
    status: "Active",
    lastUpdated: "28/11/2025",
    canView: true,
    canEdit: false,
  },
]

export default function UserPermissionsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState("")
  const [company, setCompany] = useState("All Companies")
  const [role, setRole] = useState("All Roles")

  const filtered = useMemo(
    () =>
      seedPermissions.filter((row) =>
        [row.user, row.role, row.module, row.company, row.status, row.canView ? "view" : "", row.canEdit ? "edit" : ""]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        (company === "All Companies" || row.company === company) &&
        (role === "All Roles" || row.role === role),
      ),
    [search, company, role],
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
              <h1 className="text-sm font-semibold text-foreground">User Permissions</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4 space-y-3">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Input placeholder="User" className="h-10" />
              <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
                <option>All Roles</option>
                <option>Admin</option>
                <option>Manager</option>
                <option>Viewer</option>
              </select>
              <Input placeholder="Module / Menu" className="h-10" />
              <select
                className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              >
                <option>All Companies</option>
                <option>Pakiza Accounts</option>
                <option>Cripton Labs</option>
              </select>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" className="h-4 w-4" /> View
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" className="h-4 w-4" /> Edit
                </label>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button className="px-5 gap-2">
                <Shield className="h-4 w-4" />
                Save Permission
              </Button>
              <Button variant="outline" className="px-5">
                Reset
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-3">
            <div className="flex items-center justify-between pb-3">
              <div className="text-xs text-muted-foreground">Permission Matrix</div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="h-9 rounded-md border border-border/80 bg-white px-3 text-sm"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                >
                  <option>All Companies</option>
                  <option>Pakiza Accounts</option>
                  <option>Cripton Labs</option>
                </select>
                <select
                  className="h-9 rounded-md border border-border/80 bg-white px-3 text-sm"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Viewer</option>
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
                    <th className="border border-slate-200 px-3 py-2 text-left">User</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Company</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Role</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Module</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">View</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Edit</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Status</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Updated</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.user}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.company}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.role}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.module}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.canView ? "Yes" : "No"}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.canEdit ? "Yes" : "No"}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.status}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.lastUpdated}</td>
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
