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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type ChartView = "line" | "bar" | "area" | "pie"

const durationFilters = ["30 Days", "60 Days", "1 Year", "2 Years", "3 Years"]
const chartViewOptions: { label: string; value: ChartView }[] = [
  { label: "Line Chart", value: "line" },
  { label: "Bar Chart", value: "bar" },
  { label: "Area Chart", value: "area" },
  { label: "Pie Chart", value: "pie" },
]

const managementCards = [
  {
    id: "working-capital",
    title: "Working Capital Position",
    description: "Cash liquidity after short-term liabilities.",
    metric: "BDT 2.6m",
    change: "+12% QoQ",
    accent: "#2563eb",
    chartKey: "workingCapital",
  },
  {
    id: "profit-loss",
    title: "Profit and Loss Status",
    description: "Income vs expense health this year.",
    metric: "BDT 1.4m",
    change: "+9% YoY",
    accent: "#0ea5e9",
    chartKey: "profitLoss",
  },
  {
    id: "asset-liabilities",
    title: "Asset & Liabilities Position",
    description: "Total assets compared to liabilities.",
    metric: "BDT 8.1m",
    change: "Assets 42% > Liabilities",
    accent: "#16a34a",
    chartKey: "assetsLiabilities",
  },
  {
    id: "cash-flow",
    title: "Cash Flow Status",
    description: "Cash inflow vs outflow bridging.",
    metric: "BDT 640k",
    change: "+4% vs Last Cycle",
    accent: "#f97316",
    chartKey: "cashFlow",
  },
  {
    id: "sales-status",
    title: "Sales Status",
    description: "Booked sales orders this quarter.",
    metric: "1,248 orders",
    change: "Lead conversion steady",
    accent: "#c026d3",
    chartKey: "sales",
  },
  {
    id: "received-payment",
    title: "Received Payment Status",
    description: "Payments cleared vs expected.",
    metric: "BDT 1.1m",
    change: "98% on time",
    accent: "#7c3aed",
    chartKey: "receivedPayment",
  },
  {
    id: "receivable-payable",
    title: "Receivable vs Payable",
    description: "Net deferrals between receivable and payable.",
    metric: "54% / 46%",
    change: "Payable gap narrowing",
    accent: "#ea580c",
    chartKey: "receivablePayable",
  },
  {
    id: "aging-status",
    title: "Aging Status",
    description: "Outstanding receivables grouped by days.",
    metric: "72 flagged items",
    change: "+6 items > 90d",
    accent: "#059669",
    chartKey: "agingStatus",
  },
  {
    id: "employee-advance",
    title: "Employee Advance Statement",
    description: "Issued advances vs recovered.",
    metric: "75 advances",
    change: "Recovery 96%",
    accent: "#db2777",
    chartKey: "employeeAdvance",
  },
  {
    id: "net-worth",
    title: "Net Worth Graph",
    description: "Owners’ equity evolution.",
    metric: "BDT 4.9m",
    change: "Up 11% since Jan",
    accent: "#1d4ed8",
    chartKey: "netWorth",
  },
  {
    id: "income-expense",
    title: "Monthly Income vs Expense",
    description: "Comparison across recent months.",
    metric: "Profit 28%",
    change: "Income growing",
    accent: "#14b8a6",
    chartKey: "incomeExpense",
  },
  {
    id: "inventory-valuation",
    title: "Inventory Valuation",
    description: "Stock value split by category.",
    metric: "BDT 930k",
    change: "Holding steady",
    accent: "#ea580c",
    chartKey: "inventory",
  },
  {
    id: "financials",
    title: "Financial Statements",
    description: "P&L, balance sheet, and cash flow briefs.",
    metric: "Ready",
    change: "Last refreshed 2h ago",
    accent: "#0f172a",
    chartKey: "financialStatements",
  },
] as const

const managementChartData: Record<
  typeof managementCards[number]["chartKey"],
  {
    trend: { label: string; value: number }[]
    breakdown: { name: string; value: number }[]
  }
> = {
  workingCapital: {
    trend: [
      { label: "Jan", value: 45 },
      { label: "Feb", value: 62 },
      { label: "Mar", value: 58 },
      { label: "Apr", value: 71 },
      { label: "May", value: 67 },
      { label: "Jun", value: 74 },
      { label: "Jul", value: 78 },
    ],
    breakdown: [
      { name: "Current Assets", value: 58 },
      { name: "Current Liabilities", value: 42 },
    ],
  },
  profitLoss: {
    trend: [
      { label: "Jan", value: 52 },
      { label: "Feb", value: 70 },
      { label: "Mar", value: 62 },
      { label: "Apr", value: 75 },
      { label: "May", value: 80 },
      { label: "Jun", value: 68 },
      { label: "Jul", value: 86 },
    ],
    breakdown: [
      { name: "Revenue", value: 72 },
      { name: "Expenses", value: 28 },
    ],
  },
  assetsLiabilities: {
    trend: [
      { label: "Jan", value: 60 },
      { label: "Feb", value: 62 },
      { label: "Mar", value: 65 },
      { label: "Apr", value: 68 },
      { label: "May", value: 70 },
      { label: "Jun", value: 72 },
      { label: "Jul", value: 74 },
    ],
    breakdown: [
      { name: "Assets", value: 58 },
      { name: "Liabilities", value: 42 },
    ],
  },
  cashFlow: {
    trend: [
      { label: "Jan", value: 48 },
      { label: "Feb", value: 55 },
      { label: "Mar", value: 52 },
      { label: "Apr", value: 65 },
      { label: "May", value: 74 },
      { label: "Jun", value: 69 },
      { label: "Jul", value: 75 },
    ],
    breakdown: [
      { name: "Inflows", value: 66 },
      { name: "Outflows", value: 34 },
    ],
  },
  sales: {
    trend: [
      { label: "Jan", value: 32 },
      { label: "Feb", value: 41 },
      { label: "Mar", value: 45 },
      { label: "Apr", value: 48 },
      { label: "May", value: 53 },
      { label: "Jun", value: 57 },
      { label: "Jul", value: 62 },
    ],
    breakdown: [
      { name: "Orders", value: 68 },
      { name: "Returns", value: 32 },
    ],
  },
  receivedPayment: {
    trend: [
      { label: "Jan", value: 38 },
      { label: "Feb", value: 44 },
      { label: "Mar", value: 50 },
      { label: "Apr", value: 52 },
      { label: "May", value: 60 },
      { label: "Jun", value: 61 },
      { label: "Jul", value: 68 },
    ],
    breakdown: [
      { name: "On Time", value: 72 },
      { name: "Late", value: 28 },
    ],
  },
  receivablePayable: {
    trend: [
      { label: "Jan", value: 47 },
      { label: "Feb", value: 53 },
      { label: "Mar", value: 51 },
      { label: "Apr", value: 56 },
      { label: "May", value: 54 },
      { label: "Jun", value: 59 },
      { label: "Jul", value: 62 },
    ],
    breakdown: [
      { name: "Receivable", value: 54 },
      { name: "Payable", value: 46 },
    ],
  },
  agingStatus: {
    trend: [
      { label: "0-30", value: 36 },
      { label: "31-60", value: 22 },
      { label: "61-90", value: 18 },
      { label: "91+", value: 10 },
    ],
    breakdown: [
      { name: "0-30", value: 62 },
      { name: "30-60", value: 23 },
      { name: "60-90", value: 9 },
      { name: "90+", value: 6 },
    ],
  },
  employeeAdvance: {
    trend: [
      { label: "Jan", value: 16 },
      { label: "Feb", value: 21 },
      { label: "Mar", value: 24 },
      { label: "Apr", value: 19 },
      { label: "May", value: 27 },
      { label: "Jun", value: 23 },
      { label: "Jul", value: 26 },
    ],
    breakdown: [
      { name: "Travel", value: 39 },
      { name: "Housing", value: 33 },
      { name: "Events", value: 18 },
      { name: "Other", value: 10 },
    ],
  },
  netWorth: {
    trend: [
      { label: "Jan", value: 65 },
      { label: "Feb", value: 68 },
      { label: "Mar", value: 71 },
      { label: "Apr", value: 74 },
      { label: "May", value: 76 },
      { label: "Jun", value: 79 },
      { label: "Jul", value: 82 },
    ],
    breakdown: [
      { name: "Equity", value: 64 },
      { name: "Retained Earnings", value: 36 },
    ],
  },
  incomeExpense: {
    trend: [
      { label: "Jan", value: 38 },
      { label: "Feb", value: 45 },
      { label: "Mar", value: 48 },
      { label: "Apr", value: 52 },
      { label: "May", value: 57 },
      { label: "Jun", value: 61 },
      { label: "Jul", value: 65 },
    ],
    breakdown: [
      { name: "Income", value: 67 },
      { name: "Expense", value: 33 },
    ],
  },
  inventory: {
    trend: [
      { label: "Jan", value: 25 },
      { label: "Feb", value: 28 },
      { label: "Mar", value: 32 },
      { label: "Apr", value: 29 },
      { label: "May", value: 35 },
      { label: "Jun", value: 38 },
      { label: "Jul", value: 41 },
    ],
    breakdown: [
      { name: "Finished Goods", value: 46 },
      { name: "Raw Materials", value: 29 },
      { name: "WIP", value: 25 },
    ],
  },
  financialStatements: {
    trend: [
      { label: "Jan", value: 56 },
      { label: "Feb", value: 59 },
      { label: "Mar", value: 61 },
      { label: "Apr", value: 65 },
      { label: "May", value: 60 },
      { label: "Jun", value: 63 },
      { label: "Jul", value: 68 },
    ],
    breakdown: [
      { name: "P&L", value: 40 },
      { name: "Balance Sheet", value: 35 },
      { name: "Cash Flow", value: 25 },
    ],
  },
}

const palette = ["#2563eb", "#10b981", "#f59e0b", "#ec4899", "#22d3ee", "#f97316", "#7c3aed"]

export default function ManagementDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeDuration, setActiveDuration] = useState(durationFilters[0])
  const [managementChartViews, setManagementChartViews] = useState<Record<string, ChartView>>(
    () =>
      managementCards.reduce<Record<string, ChartView>>((acc, card) => {
        acc[card.id] = "line"
        return acc
      }, {}),
  )

  const renderChart = (card: typeof managementCards[number], view: ChartView) => {
    const definition = managementChartData[card.chartKey]
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
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 6, right: 10, left: 0, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}`} />
              <Bar dataKey="value" fill={card.accent} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )
      case "area": {
        const gradientId = `${card.id}-area-gradient`
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 6, right: 10, left: 0, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}`} />
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={card.accent} stopOpacity={0.4} />
                  <stop offset="80%" stopColor={card.accent} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="value" stroke={card.accent} fill={`url(#${gradientId})`} strokeWidth={2} />
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
                wrapperStyle={{ fontSize: 9, paddingTop: 8, color: "#475569" }}
              />
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 6, right: 10, left: 0, bottom: 6 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => `${value}`} />
              <Line type="monotone" dataKey="value" stroke={card.accent} strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        )
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
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border/40 bg-card/95 px-4 lg:px-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-sm font-semibold text-foreground">Management Dashboard</p>
              <p className="text-xs text-slate-500">Consolidated strategic view</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search..." className="w-44 h-8 pl-8 text-xs border-border/40 bg-muted/50" />
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-medium text-white">
              M
            </div>
          </div>
        </header>
        <section className="p-4 lg:p-6 space-y-5">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-900/40 to-slate-800/70 px-4 py-3 text-xs text-white shadow-lg">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-200">Duration filter</span>
            <div className="flex flex-wrap gap-2">
              {durationFilters.map((filter) => {
                const isActive = filter === activeDuration
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveDuration(filter)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${
                      isActive ? "bg-white text-slate-900 shadow-xl" : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {filter}
                  </button>
                )
              })}
            </div>
            <Badge className="ml-auto text-[10px] uppercase tracking-[0.15em]" variant="secondary">
              Viewing {activeDuration}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {managementCards.map((card) => (
              <Card key={card.id} className="border border-border/40 bg-white shadow-lg shadow-slate-900/5">
                <CardHeader className="space-y-3 pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-sm font-semibold text-slate-900">{card.title}</CardTitle>
                      <p className="text-xs text-slate-500">{card.description}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p className="text-base font-semibold text-slate-900">{card.metric}</p>
                      <p className="text-[11px]">{card.change}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <span className="font-medium text-slate-400">Chart view</span>
                    <select
                      value={managementChartViews[card.id]}
                      onChange={(event) =>
                        setManagementChartViews((prev) => ({ ...prev, [card.id]: event.target.value as ChartView }))
                      }
                      className="h-8 rounded border border-slate-200 bg-white px-3 text-[12px] text-slate-600"
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
                      Updated {activeDuration.toLowerCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="h-[200px] w-full">{renderChart(card, managementChartViews[card.id])}</div>
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1">Filter: {activeDuration}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">View: {managementChartViews[card.id]}</span>
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
