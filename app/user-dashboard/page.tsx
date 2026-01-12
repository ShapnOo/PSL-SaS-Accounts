"use client"

import { useEffect, useState } from "react"
import { Bell, Calendar, Download, Filter, Menu, Search } from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { QuickAccess } from "@/components/quick-access"

type ChartView = "line" | "bar" | "area" | "pie"
type ChartSeries = { key: string; label: string; color?: string }

const durationFilters = [
  { label: "Today", value: "Today" },
  { label: "Last 7 days", value: "Last 7 days" },
  { label: "Last 14 days", value: "Last 14 days" },
  { label: "Last 30 days", value: "Last 30 days" },
  { label: "Last 3 Months", value: "Last 3 Months" },
  { label: "Last 6 Months", value: "Last 6 Months" },
  { label: "Last 1 Year", value: "Last 1 Year" },
]
const chartViewOptions: { label: string; value: ChartView }[] = [
  { label: "Line Chart", value: "line" },
  { label: "Bar Chart", value: "bar" },
  { label: "Area Chart", value: "area" },
  { label: "Pie Chart", value: "pie" },
]

const userDashboardCards = [
  {
    id: "total-voucher",
    title: "Total Voucher",
    description: "Voucher mix across all channels and branches.",
    metric: "BDT 1,248",
    change: "+8.3% vs last 30d",
    chartKey: "totalVoucher",
    accent: "#2563eb",
  },
  {
    id: "expense-trend",
    title: "Expense Trend",
    description: "Monthly outflow mix by department.",
    metric: "BDT 332,450",
    change: "Stable pacing vs last year",
    chartKey: "expenseTrend",
    accent: "#e11d48",
  },
  {
    id: "receivable-payable",
    title: "Receivable vs Payable",
    description: "Outstanding collections compared to liabilities.",
    metric: "45% / 55%",
    change: "Payables up 6% this quarter",
    chartKey: "receivablePayable",
    accent: "#0ea5e9",
  },
  {
    id: "aging-status",
    title: "Receivable vs Payable Aging Status",
    description: "Buckets showing how long receivables sit.",
    metric: "78 flagged items",
    change: "+12 items past 90 days",
    chartKey: "agingStatus",
    accent: "#16a34a",
  },
  {
    id: "employee-advance",
    title: "Employee Advance Statement",
    description: "Advances issued vs recovered.",
    metric: "54 advances",
    change: "Recovery at 92%",
    chartKey: "employeeAdvance",
    accent: "#c026d3",
  },
  {
    id: "intercompany",
    title: "Inter Company Transaction Statement",
    description: "Inter-company transfers and clearings.",
    metric: "BDT 120,400",
    change: "Two settlements pending",
    chartKey: "intercompany",
    accent: "#f97316",
  },
] as const

type ChartDefinition = {
  trend: Array<{ label: string; [key: string]: number | string }>
  breakdown: { name: string; value: number }[]
  series?: ChartSeries[]
  valueKey?: string
}

const chartDefinitions: Record<typeof userDashboardCards[number]["chartKey"], ChartDefinition> = {
  totalVoucher: {
    series: [
      { key: "sales", label: "Sales", color: "#2563eb" },
      { key: "purchases", label: "Purchases", color: "#f97316" },
      { key: "journal", label: "Journal", color: "#22c55e" },
      { key: "cash", label: "Cash", color: "#0ea5e9" },
    ],
    trend: [
      { label: "Jan", sales: 55, purchases: 22, journal: 14, cash: 11 },
      { label: "Feb", sales: 68, purchases: 27, journal: 16, cash: 12 },
      { label: "Mar", sales: 72, purchases: 30, journal: 18, cash: 18 },
      { label: "Apr", sales: 85, purchases: 32, journal: 20, cash: 23 },
      { label: "May", sales: 79, purchases: 28, journal: 19, cash: 26 },
      { label: "Jun", sales: 90, purchases: 31, journal: 22, cash: 29 },
      { label: "Jul", sales: 88, purchases: 33, journal: 21, cash: 23 },
      { label: "Aug", sales: 92, purchases: 35, journal: 23, cash: 28 },
      { label: "Sep", sales: 98, purchases: 38, journal: 25, cash: 28 },
      { label: "Oct", sales: 105, purchases: 41, journal: 26, cash: 32 },
      { label: "Nov", sales: 101, purchases: 39, journal: 25, cash: 33 },
      { label: "Dec", sales: 110, purchases: 42, journal: 27, cash: 33 },
      { label: "Jan-2", sales: 115, purchases: 44, journal: 29, cash: 35 },
      { label: "Feb-2", sales: 122, purchases: 47, journal: 30, cash: 37 },
      { label: "Mar-2", sales: 128, purchases: 50, journal: 32, cash: 39 },
      { label: "Apr-2", sales: 134, purchases: 53, journal: 34, cash: 41 },
      { label: "May-2", sales: 139, purchases: 55, journal: 35, cash: 43 },
    ],
    breakdown: [
      { name: "Sales", value: 640 },
      { name: "Purchases", value: 270 },
      { name: "Journal", value: 165 },
      { name: "Cash", value: 173 },
    ],
  },
  expenseTrend: {
    series: [
      { key: "payroll", label: "Payroll", color: "#e11d48" },
      { key: "utilities", label: "Utilities", color: "#6366f1" },
      { key: "travel", label: "Travel", color: "#f59e0b" },
      { key: "supplies", label: "Supplies", color: "#10b981" },
    ],
    trend: [
      { label: "Jan", payroll: 70, utilities: 22, travel: 12, supplies: 8 },
      { label: "Feb", payroll: 85, utilities: 28, travel: 15, supplies: 9 },
      { label: "Mar", payroll: 92, utilities: 30, travel: 18, supplies: 10 },
      { label: "Apr", payroll: 88, utilities: 26, travel: 14, supplies: 9 },
      { label: "May", payroll: 96, utilities: 32, travel: 17, supplies: 11 },
      { label: "Jun", payroll: 90, utilities: 29, travel: 16, supplies: 10 },
      { label: "Jul", payroll: 98, utilities: 33, travel: 19, supplies: 11 },
      { label: "Aug", payroll: 102, utilities: 34, travel: 21, supplies: 12 },
      { label: "Sep", payroll: 110, utilities: 36, travel: 22, supplies: 13 },
      { label: "Oct", payroll: 108, utilities: 35, travel: 20, supplies: 12 },
      { label: "Nov", payroll: 115, utilities: 37, travel: 23, supplies: 13 },
      { label: "Dec", payroll: 120, utilities: 39, travel: 24, supplies: 14 },
      { label: "Jan-2", payroll: 125, utilities: 40, travel: 25, supplies: 15 },
      { label: "Feb-2", payroll: 130, utilities: 42, travel: 27, supplies: 16 },
      { label: "Mar-2", payroll: 136, utilities: 44, travel: 29, supplies: 17 },
      { label: "Apr-2", payroll: 132, utilities: 41, travel: 27, supplies: 16 },
      { label: "May-2", payroll: 138, utilities: 43, travel: 30, supplies: 17 },
    ],
    breakdown: [
      { name: "Payroll", value: 210 },
      { name: "Utilities", value: 80 },
      { name: "Travel", value: 35 },
      { name: "Supplies", value: 15 },
    ],
  },
  receivablePayable: {
    series: [
      { key: "receivable", label: "Receivable", color: "#0ea5e9" },
      { key: "payable", label: "Payable", color: "#ef4444" },
    ],
    trend: [
      { label: "Jan", receivable: 52, payable: 45 },
      { label: "Feb", receivable: 55, payable: 46 },
      { label: "Mar", receivable: 57, payable: 47 },
      { label: "Apr", receivable: 60, payable: 49 },
      { label: "May", receivable: 59, payable: 48 },
      { label: "Jun", receivable: 63, payable: 50 },
      { label: "Jul", receivable: 66, payable: 52 },
      { label: "Aug", receivable: 64, payable: 51 },
      { label: "Sep", receivable: 67, payable: 53 },
      { label: "Oct", receivable: 70, payable: 54 },
      { label: "Nov", receivable: 68, payable: 52 },
      { label: "Dec", receivable: 72, payable: 55 },
      { label: "Jan-2", receivable: 74, payable: 56 },
      { label: "Feb-2", receivable: 76, payable: 57 },
      { label: "Mar-2", receivable: 79, payable: 59 },
      { label: "Apr-2", receivable: 82, payable: 61 },
      { label: "May-2", receivable: 81, payable: 60 },
    ],
    breakdown: [
      { name: "Receivable", value: 68 },
      { name: "Payable", value: 82 },
    ],
  },
  agingStatus: {
    series: [
      { key: "current", label: "0-30", color: "#22c55e" },
      { key: "mid", label: "31-60", color: "#eab308" },
      { key: "late", label: "61-90", color: "#f97316" },
      { key: "critical", label: "90+", color: "#ef4444" },
    ],
    trend: [
      { label: "Jan", current: 62, mid: 18, late: 10, critical: 5 },
      { label: "Feb", current: 64, mid: 19, late: 9, critical: 6 },
      { label: "Mar", current: 63, mid: 20, late: 10, critical: 7 },
      { label: "Apr", current: 65, mid: 19, late: 11, critical: 7 },
      { label: "May", current: 66, mid: 18, late: 11, critical: 7 },
      { label: "Jun", current: 67, mid: 19, late: 10, critical: 7 },
      { label: "Jul", current: 68, mid: 18, late: 11, critical: 7 },
      { label: "Aug", current: 69, mid: 19, late: 10, critical: 6 },
      { label: "Sep", current: 70, mid: 20, late: 9, critical: 6 },
      { label: "Oct", current: 68, mid: 21, late: 10, critical: 7 },
      { label: "Nov", current: 67, mid: 22, late: 10, critical: 7 },
      { label: "Dec", current: 69, mid: 21, late: 11, critical: 7 },
      { label: "Jan-2", current: 70, mid: 21, late: 11, critical: 7 },
      { label: "Feb-2", current: 71, mid: 22, late: 12, critical: 7 },
      { label: "Mar-2", current: 72, mid: 23, late: 11, critical: 8 },
      { label: "Apr-2", current: 73, mid: 22, late: 12, critical: 8 },
    ],
    breakdown: [
      { name: "0-30", value: 68 },
      { name: "31-60", value: 21 },
      { name: "61-90", value: 9 },
      { name: "90+", value: 4 },
    ],
  },
  employeeAdvance: {
    series: [
      { key: "travel", label: "Travel", color: "#0ea5e9" },
      { key: "housing", label: "Housing", color: "#8b5cf6" },
      { key: "events", label: "Events", color: "#22c55e" },
      { key: "petty", label: "Petty", color: "#f97316" },
    ],
    trend: [
      { label: "Jan", travel: 12, housing: 6, events: 8, petty: 5 },
      { label: "Feb", travel: 15, housing: 7, events: 9, petty: 6 },
      { label: "Mar", travel: 16, housing: 8, events: 10, petty: 6 },
      { label: "Apr", travel: 18, housing: 9, events: 11, petty: 7 },
      { label: "May", travel: 14, housing: 8, events: 10, petty: 6 },
      { label: "Jun", travel: 17, housing: 9, events: 11, petty: 7 },
      { label: "Jul", travel: 15, housing: 8, events: 10, petty: 6 },
      { label: "Aug", travel: 19, housing: 10, events: 12, petty: 7 },
      { label: "Sep", travel: 18, housing: 9, events: 11, petty: 6 },
      { label: "Oct", travel: 21, housing: 11, events: 13, petty: 7 },
      { label: "Nov", travel: 20, housing: 10, events: 12, petty: 7 },
      { label: "Dec", travel: 22, housing: 11, events: 13, petty: 8 },
      { label: "Jan-2", travel: 23, housing: 12, events: 14, petty: 8 },
      { label: "Feb-2", travel: 24, housing: 12, events: 15, petty: 9 },
      { label: "Mar-2", travel: 25, housing: 13, events: 16, petty: 9 },
    ],
    breakdown: [
      { name: "Travel", value: 39 },
      { name: "Housing", value: 33 },
      { name: "Events", value: 18 },
      { name: "Petty", value: 12 },
    ],
  },
  intercompany: {
    series: [
      { key: "settled", label: "Settled", color: "#22c55e" },
      { key: "pending", label: "Pending", color: "#f97316" },
    ],
    trend: [
      { label: "Jan", settled: 22, pending: 13 },
      { label: "Feb", settled: 28, pending: 14 },
      { label: "Mar", settled: 26, pending: 11 },
      { label: "Apr", settled: 20, pending: 9 },
      { label: "May", settled: 30, pending: 15 },
      { label: "Jun", settled: 33, pending: 20 },
      { label: "Jul", settled: 32, pending: 18 },
      { label: "Aug", settled: 35, pending: 16 },
      { label: "Sep", settled: 34, pending: 17 },
      { label: "Oct", settled: 37, pending: 18 },
      { label: "Nov", settled: 36, pending: 17 },
      { label: "Dec", settled: 38, pending: 19 },
      { label: "Jan-2", settled: 40, pending: 20 },
      { label: "Feb-2", settled: 42, pending: 21 },
      { label: "Mar-2", settled: 44, pending: 22 },
    ],
    breakdown: [
      { name: "Settled", value: 76 },
      { name: "Pending", value: 24 },
    ],
  },
}

const palette = ["#2563eb", "#10b981", "#f59e0b", "#ec4899", "#22d3ee", "#f97316", "#7c3aed"]

const summaryTiles = [
  {
    label: "Total Income",
    value: "BDT 325,450",
    caption: "This month’s inflow",
    type: "Income",
  },
  {
    label: "Total Expense",
    value: "BDT 214,980",
    caption: "This month’s outflow",
    type: "Expense",
  },
  {
    label: "Total Account Payable",
    value: "BDT 98,400",
    caption: "Due to vendors",
    type: "Payable",
  },
  {
    label: "Total Account Receivable",
    value: "BDT 142,300",
    caption: "Receivable from clients",
    type: "Receivable",
  },
] as const

export default function UserDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeFilter, setActiveFilter] = useState(durationFilters[1].value)
  const [chartViews, setChartViews] = useState<Record<string, ChartView>>(
    () =>
      userDashboardCards.reduce<Record<string, ChartView>>((acc, card) => {
        acc[card.id] = "line"
        return acc
      }, {}),
  )
  const [selectorOpen, setSelectorOpen] = useState("")

  // Persist chart view selection per card
  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem("user-dashboard-chart-views")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, ChartView>
        setChartViews((prev) => ({ ...prev, ...parsed }))
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem("user-dashboard-chart-views", JSON.stringify(chartViews))
  }, [chartViews])

  const renderChart = (card: typeof userDashboardCards[number], view: ChartView) => {
    const definition = chartDefinitions[card.chartKey]
    const trend = definition.trend
    const breakdown = definition.breakdown
    const series = definition.series
    const valueKey = definition.valueKey ?? "value"

    const tooltipStyle = {
      backgroundColor: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
      fontSize: "11px",
      boxShadow: "0 2px 8px rgb(15 23 42 / 0.12)",
    }

    switch (view) {
      case "bar": {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 6, right: 10, left: 0, bottom: 6 }} barGap={6} barCategoryGap="18%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}`} />
              <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, paddingBottom: 6, color: "#475569" }} />
              {series
                ? series.map((s, idx) => (
                    <Bar
                      key={s.key}
                      dataKey={s.key}
                      name={s.label}
                      fill={s.color ?? palette[idx % palette.length]}
                      radius={[4, 4, 0, 0]}
                      barSize={16}
                    />
                  ))
                : (
                  <Bar dataKey={valueKey} name={card.title} fill={card.accent} radius={[4, 4, 0, 0]} barSize={18} />
                )}
            </BarChart>
          </ResponsiveContainer>
        )
      }
      case "area": {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 6, right: 10, left: 0, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}`} />
              <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, paddingBottom: 6, color: "#475569" }} />
              {series
                ? series.map((s, idx) => {
                    const gradientId = `${card.id}-${s.key}-gradient`
                    const color = s.color ?? palette[idx % palette.length]
                    return (
                      <defs key={gradientId}>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                          <stop offset="80%" stopColor={color} stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                    )
                  })
                : null}
              {series
                ? series.map((s, idx) => {
                    const gradientId = `${card.id}-${s.key}-gradient`
                    const color = s.color ?? palette[idx % palette.length]
                    return <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} stackId="1" stroke={color} fill={`url(#${gradientId})`} strokeWidth={2} />
                  })
                : (
                  <Area
                    type="monotone"
                    dataKey={valueKey}
                    name={card.title}
                    stroke={card.accent}
                    fill={`url(#${card.id}-area-gradient)`}
                    strokeWidth={2}
                  >
                    <defs>
                      <linearGradient id={`${card.id}-area-gradient`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={card.accent} stopOpacity={0.4} />
                        <stop offset="80%" stopColor={card.accent} stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                  </Area>
                )}
            </AreaChart>
          </ResponsiveContainer>
        )
      }
      case "pie":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={breakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {breakdown.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={palette[index % palette.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}`} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{ fontSize: 10, paddingTop: 8, color: "#475569" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )
      default: {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 6, right: 10, left: 0, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}`} />
              <Legend verticalAlign="top" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, paddingBottom: 6, color: "#475569" }} />
              {series
                ? series.map((s, idx) => (
                    <Line key={s.key} type="monotone" dataKey={s.key} name={s.label} stroke={s.color ?? palette[idx % palette.length]} strokeWidth={2} dot={{ r: 2 }} />
                  ))
                : <Line type="monotone" dataKey={valueKey} name={card.title} stroke={card.accent} strokeWidth={2} dot={{ r: 2 }} />}
            </LineChart>
          </ResponsiveContainer>
        )
      }
    }
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
            <h1 className="text-sm font-semibold text-foreground">User dashboard</h1>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search..." className="w-44 h-8 pl-8 text-xs border-border/40 bg-muted/50" />
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-medium">U</span>
            </div>
          </div>
        </header>

        <section className="p-3.5 lg:p-4 space-y-3.5">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-xs text-slate-600 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Overview</span>
              
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative">
                <select
                  value={activeFilter}
                  onChange={(event) => setActiveFilter(event.target.value)}
                  className="h-10 min-w-[190px] appearance-none rounded-full border border-emerald-400/80 bg-white pl-9 pr-8 text-sm font-semibold text-slate-900 shadow-[0_6px_18px_-8px_rgba(16,185,129,0.5)] outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                >
                  {durationFilters.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
                <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">▼</span>
              </div>
              <button className="inline-flex h-10 items-center gap-2 rounded-full border border-emerald-300 bg-gradient-to-r from-emerald-50 to-white px-4 text-sm font-semibold text-emerald-700 transition hover:border-emerald-400 hover:from-emerald-100 hover:to-white">
                <Download className="h-4 w-4" />
                Download report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            {summaryTiles.map((tile) => (
              <Card key={tile.label} className="border border-border/50 bg-white/90 shadow-sm">
                <CardContent className="space-y-1 p-2.5">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{tile.label}</p>
                  <p className="text-lg font-semibold text-slate-900">{tile.value}</p>
                  <p className="text-xs text-slate-500">{tile.caption}</p>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {tile.type}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <QuickAccess />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {userDashboardCards.map((card) => (
              <Card key={card.id} className="border border-border/40 bg-white/80 shadow-lg shadow-slate-900/5">
                <CardHeader className="relative space-y-1 pb-1">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-sm font-semibold text-slate-900">{card.title}</CardTitle>
                    <div className="flex items-start gap-2">
                      <div className="text-right text-xs text-slate-500">
                        <span className="block text-base font-semibold text-slate-900 leading-tight">{card.metric}</span>
                      </div>
                      <div className="relative">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                          onClick={() => setSelectorOpen((prev) => (prev === card.id ? "" : card.id))}
                        >
                          <Filter className="h-4 w-4" />
                        </button>
                        {selectorOpen === card.id && (
                          <div className="absolute right-0 top-9 z-20 w-40 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                            {chartViewOptions.map((option) => (
                              <button
                                key={option.value}
                                className={`flex w-full items-center justify-between px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-100 ${
                                  chartViews[card.id] === option.value ? "font-semibold text-slate-900" : ""
                                }`}
                                onClick={() => {
                                  setChartViews((prev) => ({ ...prev, [card.id]: option.value }))
                                  setSelectorOpen("")
                                }}
                              >
                                <span>{option.label}</span>
                                {chartViews[card.id] === option.value && <span className="text-emerald-500">●</span>}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="h-[180px] w-full">{renderChart(card, chartViews[card.id])}</div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
              
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
