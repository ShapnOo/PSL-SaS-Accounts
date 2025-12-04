"use client"

import { useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Building2, Menu, NotebookPen, Sparkles, Tag, X } from "lucide-react"

type Sector = {
  id: number
  companyCode: string
  company: string
  component: string
  description: string
}

const seedSectors: Sector[] = [
  { id: 1, companyCode: "101", company: "Pakiza", component: "TE", description: "N/A" },
  { id: 2, companyCode: "103", company: "ESS", component: "ESS", description: "12434" },
]

const componentOptions = ["TE", "ESS", "ERP", "Retail"]

export default function SectorNamePage() {
  const [sectors, setSectors] = useState<Sector[]>(seedSectors)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [form, setForm] = useState({
    companyCode: "",
    company: "",
    component: "",
    description: "",
  })

  const sortedSectors = useMemo(() => [...sectors].sort((a, b) => a.company.localeCompare(b.company)), [sectors])

  const resetForm = () =>
    setForm({
      companyCode: "",
      company: "",
      component: "",
      description: "",
    })

  const handleSubmit = () => {
    if (!form.companyCode.trim() || !form.company.trim() || !form.component.trim()) {
      return
    }

    const nextId = Math.max(0, ...sectors.map((p) => p.id)) + 1
    setSectors((prev) => [
      ...prev,
      {
        id: nextId,
        companyCode: form.companyCode.trim(),
        company: form.company.trim(),
        component: form.component.trim(),
        description: form.description.trim(),
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
              <h1 className="text-sm font-semibold text-foreground">Sector Name</h1>
            </div>
          </div>
          <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <NotebookPen className="h-4 w-4" />
            New Sector
          </Button>
        </header>

        <div className="p-4 lg:p-6">
          <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">List View</p>
                <p className="text-xs text-muted-foreground">Manage sector names and components</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{sortedSectors.length} sectors</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/70">
                <thead className="bg-muted/60">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/90">
                    <th className="px-3 py-3 sm:px-4">SL</th>
                    <th className="px-3 py-3 sm:px-4">Company Code</th>
                    <th className="px-3 py-3 sm:px-4">Company</th>
                    <th className="px-3 py-3 sm:px-4">Component</th>
                    <th className="px-3 py-3 sm:px-4">Description</th>
                    <th className="px-3 py-3 sm:px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {sortedSectors.map((sector, index) => (
                    <tr key={sector.id} className="text-sm text-foreground/90 hover:bg-muted/40 transition-colors">
                      <td className="px-3 py-3 sm:px-4 text-muted-foreground">{index + 1}</td>
                      <td className="px-3 py-3 sm:px-4 font-semibold text-foreground">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-semibold text-slate-600">
                            {sector.companyCode}
                          </span>
                          <div className="leading-tight">
                            <div className="text-xs text-muted-foreground">Code</div>
                            <div className="text-sm text-foreground/90">{sector.companyCode}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <div className="leading-tight">
                          <div className="font-semibold text-foreground/90">{sector.company}</div>
                          <p className="text-[11px] text-muted-foreground">Company</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
                          <Tag className="h-3.5 w-3.5" />
                          {sector.component}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <p className="text-sm text-foreground/80">{sector.description || "—"}</p>
                        <p className="text-[11px] text-muted-foreground">Notes</p>
                      </td>
                      <td className="px-3 py-3 sm:px-4 text-right text-xs text-muted-foreground">
                        <div className="inline-flex items-center gap-1.5">
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50">
                            Edit
                          </button>
                          <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50">
                            Delete
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
                  <p className="text-sm font-semibold text-foreground">Create Sector</p>
                  <p className="text-xs text-muted-foreground">Define company and component</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative grid gap-4 px-6 py-5 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground" htmlFor="companyCode">
                  Company Code <span className="text-amber-500">*</span>
                </label>
                <Input
                  id="companyCode"
                  placeholder="e.g. 101"
                  value={form.companyCode}
                  onChange={(e) => setForm((prev) => ({ ...prev, companyCode: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground" htmlFor="company">
                  Company <span className="text-amber-500">*</span>
                </label>
                <Input
                  id="company"
                  placeholder="e.g. Pakiza"
                  value={form.company}
                  onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground" htmlFor="component">
                  Component <span className="text-amber-500">*</span>
                </label>
                <select
                  id="component"
                  className="h-10 w-full rounded-lg border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                  value={form.component}
                  onChange={(e) => setForm((prev) => ({ ...prev, component: e.target.value }))}
                >
                  <option value="">Select component</option>
                  {componentOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground" htmlFor="description">
                  Description
                </label>
                <Input
                  id="description"
                  placeholder="Optional notes"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="relative flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-slate-900 text-white hover:bg-slate-800"
                onClick={handleSubmit}
                disabled={!form.companyCode.trim() || !form.company.trim() || !form.component.trim()}
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
