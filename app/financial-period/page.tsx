"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { CalendarDays, Lock, Menu, Plus, ShieldCheck, Sparkles, X } from "lucide-react"

type Period = {
  id: number
  name: string
  startDate: string
  endDate: string
  lockStatus: "Locked" | "Unlocked"
  status: "Active" | "Inactive"
}

const seedPeriods: Period[] = [
  {
    id: 1,
    name: "FY 2024-25",
    startDate: "2024-07-01",
    endDate: "2025-06-30",
    lockStatus: "Unlocked",
    status: "Active",
  },
  {
    id: 2,
    name: "FY 2023-24",
    startDate: "2023-07-01",
    endDate: "2024-06-30",
    lockStatus: "Locked",
    status: "Active",
  },
]

export default function FinancialPeriodPage() {
  const [periods, setPeriods] = useState<Period[]>(seedPeriods)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    lockStatus: "Unlocked",
    status: "Active",
  })

  const sortedPeriods = useMemo(
    () =>
      [...periods].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
    [periods],
  )

  const resetForm = () =>
    setForm({
      name: "",
      startDate: "",
      endDate: "",
      lockStatus: "Unlocked",
      status: "Active",
    })

  const handleSubmit = () => {
    if (!form.name.trim() || !form.startDate || !form.endDate) {
      return
    }

    const nextId = Math.max(0, ...periods.map((p) => p.id)) + 1
    setPeriods((prev) => [
      ...prev,
      {
        id: nextId,
        name: form.name.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        lockStatus: form.lockStatus as Period["lockStatus"],
        status: form.status as Period["status"],
      },
    ])
    setIsModalOpen(false)
    resetForm()
  }

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
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Configuration</p>
              <h1 className="text-sm font-semibold text-foreground">Financial Periods</h1>
            </div>
          </div>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            New Period
          </Button>
        </header>

        <div className="p-4 lg:p-6">
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">List View</p>
                <p className="text-xs text-muted-foreground">Manage and lock your fiscal periods</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>{sortedPeriods.length} periods</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/70">
                <thead className="bg-muted/60">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/90">
                    <th className="px-3 py-3 sm:px-4">Name</th>
                    <th className="px-3 py-3 sm:px-4">Start</th>
                    <th className="px-3 py-3 sm:px-4">End</th>
                    <th className="px-3 py-3 sm:px-4">Lock</th>
                    <th className="px-3 py-3 sm:px-4">Status</th>
                    <th className="px-3 py-3 sm:px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {sortedPeriods.map((period) => (
                    <tr key={period.id} className="text-sm text-foreground/90 hover:bg-muted/40 transition-colors">
                      <td className="px-3 py-3 sm:px-4 font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-600">
                            {period.name.slice(0, 2).toUpperCase()}
                          </span>
                          <div className="leading-tight">
                            <div>{period.name}</div>
                            <p className="text-[11px] text-muted-foreground">Fiscal year</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4 text-muted-foreground">
                        <div className="leading-tight">
                          <div className="font-semibold text-foreground/90 text-xs sm:text-sm">{period.startDate}</div>
                          <p className="text-[11px] text-muted-foreground">Start</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4 text-muted-foreground">
                        <div className="leading-tight">
                          <div className="font-semibold text-foreground/90 text-xs sm:text-sm">{period.endDate}</div>
                          <p className="text-[11px] text-muted-foreground">End</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
                            period.lockStatus === "Locked"
                              ? "bg-amber-50 text-amber-700 ring-amber-100"
                              : "bg-emerald-50 text-emerald-700 ring-emerald-100",
                          )}
                        >
                          <Lock className="h-3.5 w-3.5" />
                          {period.lockStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
                            period.status === "Active"
                              ? "bg-blue-50 text-blue-700 ring-blue-100"
                              : "bg-slate-100 text-slate-700 ring-slate-200",
                          )}
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {period.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 text-right text-xs text-muted-foreground">
                        <div className="inline-flex items-center gap-2">
                          <button className="rounded-md px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50">
                            Edit
                          </button>
                          <button className="rounded-md px-2 py-1 text-[11px] font-semibold text-amber-700 hover:bg-amber-50">
                            Lock
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_30%_20%,rgba(15,23,42,0.05),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.08),transparent_30%)]" />
            <div className="relative flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Create Financial Period</p>
                  <p className="text-xs text-muted-foreground">Define the window and lock rules</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative grid gap-4 px-6 py-5 sm:grid-cols-2">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-foreground" htmlFor="name">
                  Name <span className="text-amber-500">*</span>
                </label>
                <Input
                  id="name"
                  placeholder="e.g. FY 2024-25"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground" htmlFor="startDate">
                  Start Date <span className="text-amber-500">*</span>
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground" htmlFor="endDate">
                  End Date <span className="text-amber-500">*</span>
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground" htmlFor="lockStatus">
                  Lock Status <span className="text-amber-500">*</span>
                </label>
                <select
                  id="lockStatus"
                  className="h-10 w-full rounded-lg border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                  value={form.lockStatus}
                  onChange={(e) => setForm((prev) => ({ ...prev, lockStatus: e.target.value }))}
                >
                  <option value="Unlocked">Unlocked</option>
                  <option value="Locked">Locked</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground" htmlFor="status">
                  Status <span className="text-amber-500">*</span>
                </label>
                <select
                  id="status"
                  className="h-10 w-full rounded-lg border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                  value={form.status}
                  onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="relative flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-slate-900 text-white hover:bg-slate-800"
                onClick={handleSubmit}
                disabled={!form.name.trim() || !form.startDate || !form.endDate}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
