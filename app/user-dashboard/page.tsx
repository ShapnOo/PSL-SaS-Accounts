"use client"

import { useState } from "react"
import { Bell, Menu, Search } from "lucide-react"
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
    title: "Aging Status",
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

const chartDefinitions: Record<
  typeof userDashboardCards[number]["chartKey"],
  {
    trend: { label: string; value: number }[]
    breakdown: { name: string; value: number }[]
  }
> = {
  totalVoucher: {
    trend: [
      { label: "Jan", value: 102 },
      { label: "Feb", value: 134 },
      { label: "Mar", value: 138 },
      { label: "Apr", value: 160 },
      { label: "May", value: 152 },
      { label: "Jun", value: 172 },
      { label: "Jul", value: 165 },
      { label: "Aug", value: 178 },
      { label: "Sep", value: 189 },
      { label: "Oct", value: 204 },
      { label: "Nov", value: 198 },
      { label: "Dec", value: 212 },
    ],
    breakdown: [
      { name: "Sales", value: 640 },
      { name: "Purchases", value: 270 },
      { name: "Journal", value: 165 },
      { name: "Cash", value: 173 },
    ],
  },
  expenseTrend: {
    trend: [
      { label: "Jan", value: 70 },
      { label: "Feb", value: 120 },
      { label: "Mar", value: 150 },
      { label: "Apr", value: 133 },
      { label: "May", value: 145 },
      { label: "Jun", value: 121 },
      { label: "Jul", value: 138 },
      { label: "Aug", value: 142 },
      { label: "Sep", value: 158 },
      { label: "Oct", value: 151 },
      { label: "Nov", value: 164 },
      { label: "Dec", value: 178 },
    ],
    breakdown: [
      { name: "Payroll", value: 210 },
      { name: "Utilities", value: 80 },
      { name: "Travel", value: 35 },
      { name: "Supplies", value: 15 },
    ],
  },
  receivablePayable: {
    trend: [
      { label: "Jan", value: 42 },
      { label: "Feb", value: 48 },
      { label: "Mar", value: 40 },
      { label: "Apr", value: 55 },
      { label: "May", value: 51 },
      { label: "Jun", value: 61 },
      { label: "Jul", value: 57 },
      { label: "Aug", value: 63 },
      { label: "Sep", value: 58 },
      { label: "Oct", value: 65 },
      { label: "Nov", value: 62 },
      { label: "Dec", value: 68 },
    ],
    breakdown: [
      { name: "Receivable", value: 68 },
      { name: "Payable", value: 82 },
    ],
  },
  agingStatus: {
    trend: [
      { label: "0-30", value: 38 },
      { label: "31-60", value: 22 },
      { label: "61-90", value: 12 },
      { label: "90+", value: 8 },
    ],
    breakdown: [
      { name: "0-30", value: 68 },
      { name: "31-60", value: 21 },
      { name: "61-90", value: 9 },
      { name: "90+", value: 4 },
    ],
  },
  employeeAdvance: {
    trend: [
      { label: "Jan", value: 12 },
      { label: "Feb", value: 18 },
      { label: "Mar", value: 20 },
      { label: "Apr", value: 25 },
      { label: "May", value: 15 },
      { label: "Jun", value: 22 },
      { label: "Jul", value: 18 },
      { label: "Aug", value: 26 },
      { label: "Sep", value: 23 },
      { label: "Oct", value: 30 },
      { label: "Nov", value: 28 },
      { label: "Dec", value: 32 },
    ],
    breakdown: [
      { name: "Travel", value: 14 },
      { name: "Housing", value: 10 },
      { name: "Events", value: 18 },
      { name: "Petty", value: 12 },
    ],
  },
  intercompany: {
    trend: [
      { label: "Jan", value: 35 },
      { label: "Feb", value: 42 },
      { label: "Mar", value: 37 },
      { label: "Apr", value: 29 },
      { label: "May", value: 45 },
      { label: "Jun", value: 53 },
      { label: "Jul", value: 50 },
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

  const renderChart = (card: typeof userDashboardCards[number], view: ChartView) => {
    const definition = chartDefinitions[card.chartKey]
    const trend = definition.trend
    const breakdown = definition.breakdown

    const tooltipStyle = {
      backgroundColor: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "6px",
      fontSize: "11px",
      boxShadow: "0 2px 8px rgb(15 23 42 / 0.12)",
    }

    switch (view) {
      case "bar": {
        const color = card.accent
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 6, right: 10, left: 0, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}`} />
              <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      }
      case "area": {
        const gradientId = `${card.id}-area-gradient`
        const color = card.accent
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 6, right: 10, left: 0, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}`} />
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="80%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke={color} fill={`url(#${gradientId})`} strokeWidth={2} />
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
        const color = card.accent
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 6, right: 10, left: 0, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}`} />
              <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={{ r: 2 }} />
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

        <section className="p-4 lg:p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-xs text-slate-600 shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">Duration</span>
            <div className="relative min-w-[200px]">
              <select
                value={activeFilter}
                onChange={(event) => setActiveFilter(event.target.value)}
                className="w-full appearance-none rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-slate-400 focus:ring-2 focus:ring-emerald-200"
              >
                {durationFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                ▼
              </span>
            </div>
            <span className="ml-auto rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500">
              Viewing {activeFilter}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {summaryTiles.map((tile) => (
              <Card key={tile.label} className="border border-border/50 bg-white/90 shadow-sm">
                <CardContent className="space-y-1 p-4">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">{tile.label}</p>
                  <p className="text-2xl font-semibold text-slate-900">{tile.value}</p>
                  <p className="text-xs text-slate-500">{tile.caption}</p>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {tile.type}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <QuickAccess />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {userDashboardCards.map((card) => (
              <Card key={card.id} className="border border-border/40 bg-white/80 shadow-lg shadow-slate-900/5">
                <CardHeader className="space-y-2 pb-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-900">{card.title}</CardTitle>
                      <p className="text-xs text-slate-500">{card.description}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <span className="block text-base font-semibold text-slate-900">{card.metric}</span>
                      <span className="text-[11px] text-slate-500">{card.change}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <span className="font-medium text-slate-400">Chart view</span>
                    <select
                      value={chartViews[card.id]}
                      onChange={(event) => setChartViews((prev) => ({ ...prev, [card.id]: event.target.value as ChartView }))}
                      className="h-8 rounded border border-slate-200 bg-white px-2 text-[11px] text-slate-600"
                    >
                      {chartViewOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <span
                      className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{ backgroundColor: `${card.accent}1a`, color: card.accent }}
                    >
                      Updated {activeFilter.toLowerCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="h-[220px] w-full">{renderChart(card, chartViews[card.id])}</div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1">Filter: {activeFilter}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">View: {chartViews[card.id]}</span>
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
