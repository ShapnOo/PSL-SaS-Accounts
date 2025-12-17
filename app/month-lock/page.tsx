"use client"

import { useEffect, useMemo, useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { CalendarSearch, CalendarX2, CheckCircle, Menu } from "lucide-react"

type MonthLock = {
  id: number
  month: string
  year: number
  status: "Locked" | "Unlocked"
}

const seedMonths: MonthLock[] = [
  { id: 1, month: "July", year: 2025, status: "Unlocked" },
  { id: 2, month: "August", year: 2025, status: "Unlocked" },
  { id: 3, month: "September", year: 2025, status: "Unlocked" },
  { id: 4, month: "October", year: 2025, status: "Unlocked" },
  { id: 5, month: "November", year: 2025, status: "Unlocked" },
  { id: 6, month: "December", year: 2025, status: "Unlocked" },
  { id: 7, month: "January", year: 2026, status: "Unlocked" },
  { id: 8, month: "February", year: 2026, status: "Unlocked" },
  { id: 9, month: "March", year: 2026, status: "Unlocked" },
  { id: 10, month: "April", year: 2026, status: "Unlocked" },
  { id: 11, month: "May", year: 2026, status: "Unlocked" },
  { id: 12, month: "June", year: 2026, status: "Unlocked" },
]

const monthToIndex: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
}

const deriveFiscalYear = (month: MonthLock) => {
  const monthIndex = monthToIndex[month.month]
  const startYear = monthIndex >= 7 ? month.year : month.year - 1
  const endYear = startYear + 1
  return `${startYear}-${endYear}`
}

export default function MonthLockPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [months, setMonths] = useState<MonthLock[]>(seedMonths)
  const [selectedFiscalYear, setSelectedFiscalYear] = useState<string>(() => deriveFiscalYear(seedMonths[0]))

  const fiscalYearOptions = useMemo(() => {
    const options = Array.from(new Set(months.map((m) => deriveFiscalYear(m))))
    return options.sort((a, b) => Number(a.split("-")[0]) - Number(b.split("-")[0]))
  }, [months])

  useEffect(() => {
    if (!fiscalYearOptions.length) return
    if (!selectedFiscalYear || !fiscalYearOptions.includes(selectedFiscalYear)) {
      setSelectedFiscalYear(fiscalYearOptions[0])
    }
  }, [fiscalYearOptions, selectedFiscalYear])

  const filteredMonths = useMemo(
    () => months.filter((m) => deriveFiscalYear(m) === selectedFiscalYear),
    [months, selectedFiscalYear],
  )

  const toggleLock = (id: number) => {
    setMonths((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: m.status === "Locked" ? "Unlocked" : "Locked" } : m)),
    )
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
              <h1 className="text-sm font-semibold text-foreground">Month Lock</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="flex flex-wrap items-center gap-3 border-b border-border/70 p-4">
              <div className="flex items-center gap-2">
                <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Fiscal Year</div>
                <Select value={selectedFiscalYear} onValueChange={setSelectedFiscalYear}>
                  <SelectTrigger className="h-9 w-44 text-sm">
                    <div className="flex items-center gap-2">
                      <CalendarSearch className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select fiscal year" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {fiscalYearOptions.map((fy) => (
                      <SelectItem key={fy} value={fy}>
                        {fy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Showing {selectedFiscalYear} ({filteredMonths.length} months)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border/70">
                <thead className="bg-muted/60">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/90">
                    <th className="px-3 py-3 sm:px-4">Month Name</th>
                    <th className="px-3 py-3 sm:px-4">Year</th>
                    <th className="px-3 py-3 sm:px-4">Status</th>
                    <th className="px-3 py-3 sm:px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/70">
                  {filteredMonths.map((m) => (
                    <tr key={m.id} className="text-sm text-foreground/90 hover:bg-muted/40 transition-colors">
                      <td className="px-3 py-3 sm:px-4">{m.month}</td>
                      <td className="px-3 py-3 sm:px-4 text-muted-foreground">{m.year}</td>
                      <td className="px-3 py-3 sm:px-4">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
                            m.status === "Locked"
                              ? "bg-rose-50 text-rose-700 ring-rose-100"
                              : "bg-emerald-50 text-emerald-700 ring-emerald-100",
                          )}
                        >
                          {m.status === "Locked" ? (
                            <CalendarX2 className="h-3.5 w-3.5" />
                          ) : (
                            <CheckCircle className="h-3.5 w-3.5" />
                          )}
                          {m.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 sm:px-4 text-right text-xs">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            className={cn(
                              "rounded-md px-3 py-1 text-[11px] font-semibold text-white",
                              m.status === "Locked" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-900 hover:bg-slate-800",
                            )}
                            onClick={() => toggleLock(m.id)}
                          >
                            {m.status === "Locked" ? "Unlock" : "Lock"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredMonths.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-sm text-muted-foreground">
                        No months found for the selected fiscal year.
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
