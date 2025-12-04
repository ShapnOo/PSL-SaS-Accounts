"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Input } from "@/components/ui/input"

type CoaRow = {
  id: number
  className: string
  groupName: string
  subGroupName: string
  controlName: string
  code: string
  currency: string
  status: "Active" | "Inactive"
}

const seed: CoaRow[] = [
  {
    id: 1,
    className: "Assets",
    groupName: "Current Assets",
    subGroupName: "Cash & Bank",
    controlName: "Cash on Hand",
    code: "1010",
    currency: "USD",
    status: "Active",
  },
  {
    id: 2,
    className: "Assets",
    groupName: "Current Assets",
    subGroupName: "Cash & Bank",
    controlName: "Bank Accounts",
    code: "1020",
    currency: "USD",
    status: "Active",
  },
  {
    id: 3,
    className: "Liabilities",
    groupName: "Current Liabilities",
    subGroupName: "Payables",
    controlName: "Accounts Payable",
    code: "2010",
    currency: "USD",
    status: "Active",
  },
]

export default function ChartOfAccountsListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | CoaRow["status"]>("All")

  const filtered = useMemo(
    () =>
      seed.filter((row) => {
        const matchesSearch = [row.className, row.groupName, row.subGroupName, row.controlName, row.code]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
        const matchesStatus = statusFilter === "All" || row.status === statusFilter
        return matchesSearch && matchesStatus
      }),
    [search, statusFilter],
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
            <button className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Chart of Accounts</p>
              <h1 className="text-sm font-semibold text-foreground">View Accounts</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Search</p>
              <Input
                placeholder="Search by class, group, control"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Status</p>
              <select
                className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              >
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Class</th>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Group</th>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Sub Group</th>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Control Name</th>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Code</th>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Currency</th>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="px-3 py-2 text-slate-900">{row.className}</td>
                    <td className="px-3 py-2 text-slate-900">{row.groupName}</td>
                    <td className="px-3 py-2 text-slate-900">{row.subGroupName}</td>
                    <td className="px-3 py-2 text-slate-900">{row.controlName}</td>
                    <td className="px-3 py-2 text-slate-900">{row.code}</td>
                    <td className="px-3 py-2 text-slate-700">{row.currency}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                          row.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-sm text-slate-500">
                      No accounts found
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
