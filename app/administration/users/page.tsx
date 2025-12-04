"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Menu, Pencil, Plus, Trash2, UserPlus } from "lucide-react"

type UserRow = {
  id: number
  name: string
  email: string
  role: string
  company: string
  status: "Active" | "Invited" | "Suspended"
  lastActive: string
}

const seedUsers: UserRow[] = [
  { id: 1, name: "Tahmid Afsar", email: "tahmid@pakiza.com", role: "Admin", company: "Pakiza Accounts", status: "Active", lastActive: "03/12/2025" },
  { id: 2, name: "Sohanur Rahr", email: "sohanur@cripton.com", role: "Manager", company: "Cripton Labs", status: "Active", lastActive: "02/12/2025" },
  { id: 3, name: "Lamia Ray", email: "lamia@pakiza.com", role: "Viewer", company: "Pakiza Accounts", status: "Invited", lastActive: "-" },
]

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState("")
  const [company, setCompany] = useState("All Companies")
  const [status, setStatus] = useState("All Statuses")
  const [role, setRole] = useState("All Roles")
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "Pakiza Accounts",
    role: "Viewer",
    status: "Active",
    mfa: true,
  })

  const filtered = useMemo(
    () =>
      seedUsers.filter((row) => {
        const matchesSearch = [row.name, row.email, row.role, row.company, row.status].join(" ").toLowerCase().includes(search.toLowerCase())
        const matchesCompany = company === "All Companies" || row.company === company
        const matchesStatus = status === "All Statuses" || row.status === status
        const matchesRole = role === "All Roles" || row.role === role
        return matchesSearch && matchesCompany && matchesStatus && matchesRole
      }),
    [search, company, status, role],
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
              <h1 className="text-sm font-semibold text-foreground">Users</h1>
            </div>
          </div>
          <Button className="gap-2" onClick={() => setModalOpen(true)}>
            <UserPlus className="h-4 w-4" />
            Invite User
          </Button>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-4 space-y-3">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Input placeholder="Full Name" className="h-10" />
              <Input placeholder="Email" type="email" className="h-10" />
              <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
                <option>All Roles</option>
                <option>Admin</option>
                <option>Manager</option>
                <option>Viewer</option>
              </select>
              <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm" value={company} onChange={(e) => setCompany(e.target.value)}>
                <option>All Companies</option>
                <option>Pakiza Accounts</option>
                <option>Cripton Labs</option>
              </select>
              <select className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>All Statuses</option>
                <option>Active</option>
                <option>Invited</option>
                <option>Suspended</option>
              </select>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <Button className="px-5 gap-2" onClick={() => setModalOpen(true)}>
                <Plus className="h-4 w-4" />
                Add / Invite
              </Button>
              <Button variant="outline" className="px-5">
                Reset
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-border/70 bg-card shadow-sm p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
              <div className="text-xs text-muted-foreground">Users</div>
              <div className="flex flex-wrap items-center gap-2">
                <select className="h-9 rounded-md border border-border/80 bg-white px-3 text-sm" value={company} onChange={(e) => setCompany(e.target.value)}>
                  <option>All Companies</option>
                  <option>Pakiza Accounts</option>
                  <option>Cripton Labs</option>
                </select>
                <select className="h-9 rounded-md border border-border/80 bg-white px-3 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option>All Roles</option>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Viewer</option>
                </select>
                <select className="h-9 rounded-md border border-border/80 bg-white px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Invited</option>
                  <option>Suspended</option>
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
                    <th className="border border-slate-200 px-3 py-2 text-left">Name</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Email</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Role</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Company</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Status</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Last Active</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, idx) => (
                    <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.name}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.email}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.role}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.company}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.status}</td>
                      <td className="border border-slate-200 px-3 py-2 text-slate-900">{row.lastActive}</td>
                      <td className="border border-slate-200 px-3 py-2">
                        <div className="flex items-center gap-2 justify-end">
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 inline-flex items-center gap-1">
                            <Mail className="h-3.5 w-3.5" />
                            Resend Invite
                          </button>
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 inline-flex items-center gap-1">
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 inline-flex items-center gap-1">
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
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
        </div>
      </main>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-3xl rounded-xl bg-white shadow-2xl ring-1 ring-border">
            <div className="flex items-center justify-between border-b border-border/60 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">User</p>
                <h2 className="text-sm font-semibold text-foreground">Add / Invite User</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                Close
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <Input
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="h-10"
                />
                <Input
                  placeholder="Email *"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="h-10"
                />
                <select
                  className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                >
                  <option>Pakiza Accounts</option>
                  <option>Cripton Labs</option>
                </select>
                <Input
                  placeholder="Password *"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="h-10"
                />
                <Input
                  placeholder="Confirm Password *"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  className="h-10"
                />
                <select
                  className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                >
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Viewer</option>
                </select>
                <select
                  className="h-10 rounded-md border border-border/80 bg-white px-3 text-sm"
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                >
                  <option>Active</option>
                  <option>Invited</option>
                  <option>Suspended</option>
                </select>
                <div className="flex items-center gap-2 rounded-md border border-border/80 bg-white px-3 py-2">
                  <input
                    id="mfa"
                    type="checkbox"
                    className="h-4 w-4"
                    checked={form.mfa}
                    onChange={(e) => setForm((f) => ({ ...f, mfa: e.target.checked }))}
                  />
                  <label htmlFor="mfa" className="text-sm text-slate-700">
                    Enforce MFA
                  </label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button className="gap-2">
                  <Mail className="h-4 w-4" />
                  Save & Send Invite
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
