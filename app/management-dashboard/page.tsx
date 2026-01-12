"use client"

import { useEffect, useRef, useState } from "react"
import { BarChart3, Bell, Calendar, Check, ChevronDown, Download, Menu, Search } from "lucide-react"
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

type ChartView = "line" | "bar" | "area" | "pie"
type ChartSeries = { key: string; label: string; color?: string }

const durationFilters = ["30 Days", "60 Days", "1 Year", "2 Years", "3 Years"]
const chartViewOptions: { label: string; value: ChartView }[] = [
  { label: "Line Chart", value: "line" },
  { label: "Bar Chart", value: "bar" },
  { label: "Area Chart", value: "area" },
  { label: "Pie Chart", value: "pie" },
]

const summaryTiles = [
  {
    label: "Total Income",
    value: "BDT 325,450",
    caption: "This month's inflow",
    type: "Income",
  },
  {
    label: "Total Expense",
    value: "BDT 214,980",
    caption: "This month's outflow",
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

const managementCards = [
  {
    id: "total-voucher",
    title: "Total Voucher",
    metric: "BDT 1,248",
    change: "+8.3% vs last 30d",
    accent: "#2563eb",
    chartKey: "totalVoucher",
  },
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
    title: "Receivable vs Payable Aging Status",
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
    description: "Owners' equity evolution.",
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
    title: "Financial Statements Analysis",
    description: "P&L, balance sheet, and cash flow briefs.",
    metric: "Ready",
    change: "Last refreshed 2h ago",
    accent: "#0f172a",
    chartKey: "financialStatements",
  },
] as const

type ChartDefinition = {
  trend: Array<{ label: string; [key: string]: number | string }>
  breakdown: { name: string; value: number }[]
  series?: ChartSeries[]
  valueKey?: string
}

const managementChartData: Record<typeof managementCards[number]["chartKey"], ChartDefinition> = {
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
  workingCapital: {
    series: [
      { key: "assets", label: "Assets", color: "#2563eb" },
      { key: "liabilities", label: "Liabilities", color: "#ea580c" },
    ],
    trend: [
      { label: "Jan", assets: 62, liabilities: 38 },
      { label: "Feb", assets: 68, liabilities: 40 },
      { label: "Mar", assets: 71, liabilities: 43 },
      { label: "Apr", assets: 76, liabilities: 45 },
      { label: "May", assets: 79, liabilities: 46 },
      { label: "Jun", assets: 83, liabilities: 49 },
      { label: "Jul", assets: 85, liabilities: 50 },
      { label: "Aug", assets: 88, liabilities: 52 },
      { label: "Sep", assets: 92, liabilities: 54 },
      { label: "Oct", assets: 95, liabilities: 55 },
      { label: "Nov", assets: 98, liabilities: 56 },
      { label: "Dec", assets: 102, liabilities: 58 },
      { label: "Jan-2", assets: 104, liabilities: 59 },
      { label: "Feb-2", assets: 107, liabilities: 60 },
      { label: "Mar-2", assets: 110, liabilities: 62 },
    ],
    breakdown: [
      { name: "Current Assets", value: 58 },
      { name: "Current Liabilities", value: 42 },
    ],
  },
  profitLoss: {
    series: [
      { key: "revenue", label: "Revenue", color: "#0ea5e9" },
      { key: "expense", label: "Expense", color: "#ef4444" },
    ],
    trend: [
      { label: "Jan", revenue: 82, expense: 48 },
      { label: "Feb", revenue: 96, expense: 52 },
      { label: "Mar", revenue: 88, expense: 50 },
      { label: "Apr", revenue: 102, expense: 55 },
      { label: "May", revenue: 110, expense: 60 },
      { label: "Jun", revenue: 94, expense: 58 },
      { label: "Jul", revenue: 118, expense: 62 },
      { label: "Aug", revenue: 105, expense: 59 },
      { label: "Sep", revenue: 122, expense: 64 },
      { label: "Oct", revenue: 128, expense: 68 },
      { label: "Nov", revenue: 135, expense: 70 },
      { label: "Dec", revenue: 142, expense: 73 },
      { label: "Jan-2", revenue: 148, expense: 75 },
      { label: "Feb-2", revenue: 152, expense: 78 },
      { label: "Mar-2", revenue: 158, expense: 80 },
    ],
    breakdown: [
      { name: "Revenue", value: 72 },
      { name: "Expenses", value: 28 },
    ],
  },
  assetsLiabilities: {
    series: [
      { key: "assets", label: "Assets", color: "#16a34a" },
      { key: "liabilities", label: "Liabilities", color: "#ef4444" },
    ],
    trend: [
      { label: "Jan", assets: 78, liabilities: 42 },
      { label: "Feb", assets: 82, liabilities: 44 },
      { label: "Mar", assets: 86, liabilities: 47 },
      { label: "Apr", assets: 89, liabilities: 48 },
      { label: "May", assets: 91, liabilities: 49 },
      { label: "Jun", assets: 94, liabilities: 50 },
      { label: "Jul", assets: 97, liabilities: 53 },
      { label: "Aug", assets: 100, liabilities: 54 },
      { label: "Sep", assets: 104, liabilities: 56 },
      { label: "Oct", assets: 107, liabilities: 57 },
      { label: "Nov", assets: 110, liabilities: 58 },
      { label: "Dec", assets: 114, liabilities: 59 },
      { label: "Jan-2", assets: 118, liabilities: 60 },
      { label: "Feb-2", assets: 121, liabilities: 62 },
      { label: "Mar-2", assets: 124, liabilities: 63 },
    ],
    breakdown: [
      { name: "Assets", value: 58 },
      { name: "Liabilities", value: 42 },
    ],
  },
  cashFlow: {
    series: [
      { key: "inflow", label: "Inflows", color: "#22c55e" },
      { key: "outflow", label: "Outflows", color: "#f97316" },
    ],
    trend: [
      { label: "Jan", inflow: 52, outflow: 28 },
      { label: "Feb", inflow: 60, outflow: 32 },
      { label: "Mar", inflow: 58, outflow: 29 },
      { label: "Apr", inflow: 70, outflow: 35 },
      { label: "May", inflow: 77, outflow: 38 },
      { label: "Jun", inflow: 73, outflow: 34 },
      { label: "Jul", inflow: 80, outflow: 37 },
      { label: "Aug", inflow: 78, outflow: 36 },
      { label: "Sep", inflow: 84, outflow: 40 },
      { label: "Oct", inflow: 88, outflow: 42 },
      { label: "Nov", inflow: 90, outflow: 43 },
      { label: "Dec", inflow: 94, outflow: 45 },
      { label: "Jan-2", inflow: 96, outflow: 46 },
      { label: "Feb-2", inflow: 100, outflow: 48 },
      { label: "Mar-2", inflow: 104, outflow: 50 },
    ],
    breakdown: [
      { name: "Inflows", value: 66 },
      { name: "Outflows", value: 34 },
    ],
  },
  sales: {
    series: [
      { key: "orders", label: "Orders", color: "#c026d3" },
      { key: "returns", label: "Returns", color: "#f97316" },
    ],
    trend: [
      { label: "Jan", orders: 32, returns: 6 },
      { label: "Feb", orders: 41, returns: 8 },
      { label: "Mar", orders: 45, returns: 7 },
      { label: "Apr", orders: 48, returns: 9 },
      { label: "May", orders: 53, returns: 10 },
      { label: "Jun", orders: 57, returns: 12 },
      { label: "Jul", orders: 62, returns: 11 },
      { label: "Aug", orders: 65, returns: 12 },
      { label: "Sep", orders: 68, returns: 13 },
      { label: "Oct", orders: 70, returns: 13 },
      { label: "Nov", orders: 74, returns: 14 },
      { label: "Dec", orders: 78, returns: 15 },
      { label: "Jan-2", orders: 82, returns: 16 },
      { label: "Feb-2", orders: 84, returns: 17 },
      { label: "Mar-2", orders: 88, returns: 18 },
    ],
    breakdown: [
      { name: "Orders", value: 68 },
      { name: "Returns", value: 32 },
    ],
  },
  receivedPayment: {
    series: [
      { key: "onTime", label: "On Time", color: "#22c55e" },
      { key: "late", label: "Late", color: "#f97316" },
    ],
    trend: [
      { label: "Jan", onTime: 38, late: 8 },
      { label: "Feb", onTime: 44, late: 9 },
      { label: "Mar", onTime: 50, late: 10 },
      { label: "Apr", onTime: 52, late: 11 },
      { label: "May", onTime: 60, late: 12 },
      { label: "Jun", onTime: 61, late: 13 },
      { label: "Jul", onTime: 68, late: 14 },
      { label: "Aug", onTime: 66, late: 13 },
      { label: "Sep", onTime: 70, late: 15 },
      { label: "Oct", onTime: 74, late: 16 },
      { label: "Nov", onTime: 76, late: 17 },
      { label: "Dec", onTime: 80, late: 18 },
      { label: "Jan-2", onTime: 82, late: 19 },
      { label: "Feb-2", onTime: 84, late: 20 },
      { label: "Mar-2", onTime: 86, late: 21 },
    ],
    breakdown: [
      { name: "On Time", value: 72 },
      { name: "Late", value: 28 },
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
    ],
    breakdown: [
      { name: "Receivable", value: 54 },
      { name: "Payable", value: 46 },
    ],
  },
  agingStatus: {
    series: [
      { key: "current", label: "0-30", color: "#22c55e" },
      { key: "mid", label: "30-60", color: "#eab308" },
      { key: "late", label: "60-90", color: "#f97316" },
      { key: "critical", label: "90+", color: "#ef4444" },
    ],
    trend: [
      { label: "Bucket", current: 62, mid: 23, late: 9, critical: 6 },
      { label: "Bucket-2", current: 64, mid: 24, late: 10, critical: 6 },
    ],
    breakdown: [
      { name: "0-30", value: 62 },
      { name: "30-60", value: 23 },
      { name: "60-90", value: 9 },
      { name: "90+", value: 6 },
    ],
  },
  employeeAdvance: {
    series: [
      { key: "travel", label: "Travel", color: "#0ea5e9" },
      { key: "housing", label: "Housing", color: "#8b5cf6" },
      { key: "events", label: "Events", color: "#22c55e" },
      { key: "other", label: "Other", color: "#f97316" },
    ],
    trend: [
      { label: "Jan", travel: 7, housing: 4, events: 3, other: 2 },
      { label: "Feb", travel: 9, housing: 4, events: 5, other: 3 },
      { label: "Mar", travel: 10, housing: 5, events: 6, other: 3 },
      { label: "Apr", travel: 8, housing: 5, events: 4, other: 2 },
      { label: "May", travel: 12, housing: 6, events: 5, other: 4 },
      { label: "Jun", travel: 11, housing: 5, events: 4, other: 3 },
      { label: "Jul", travel: 13, housing: 6, events: 5, other: 4 },
      { label: "Aug", travel: 12, housing: 6, events: 5, other: 3 },
      { label: "Sep", travel: 14, housing: 7, events: 6, other: 4 },
      { label: "Oct", travel: 15, housing: 7, events: 6, other: 4 },
      { label: "Nov", travel: 16, housing: 8, events: 7, other: 4 },
      { label: "Dec", travel: 17, housing: 8, events: 7, other: 5 },
      { label: "Jan-2", travel: 18, housing: 9, events: 8, other: 5 },
      { label: "Feb-2", travel: 19, housing: 9, events: 8, other: 5 },
      { label: "Mar-2", travel: 20, housing: 10, events: 9, other: 6 },
    ],
    breakdown: [
      { name: "Travel", value: 39 },
      { name: "Housing", value: 33 },
      { name: "Events", value: 18 },
      { name: "Other", value: 10 },
    ],
  },
  netWorth: {
    series: [
      { key: "equity", label: "Equity", color: "#2563eb" },
      { key: "retained", label: "Retained Earnings", color: "#14b8a6" },
    ],
    trend: [
      { label: "Jan", equity: 52, retained: 13 },
      { label: "Feb", equity: 54, retained: 14 },
      { label: "Mar", equity: 56, retained: 15 },
      { label: "Apr", equity: 58, retained: 16 },
      { label: "May", equity: 60, retained: 16 },
      { label: "Jun", equity: 63, retained: 16 },
      { label: "Jul", equity: 66, retained: 16 },
      { label: "Aug", equity: 68, retained: 17 },
      { label: "Sep", equity: 70, retained: 18 },
      { label: "Oct", equity: 72, retained: 18 },
      { label: "Nov", equity: 74, retained: 19 },
      { label: "Dec", equity: 76, retained: 19 },
      { label: "Jan-2", equity: 78, retained: 20 },
      { label: "Feb-2", equity: 80, retained: 21 },
      { label: "Mar-2", equity: 82, retained: 21 },
    ],
    breakdown: [
      { name: "Equity", value: 64 },
      { name: "Retained Earnings", value: 36 },
    ],
  },
  incomeExpense: {
    series: [
      { key: "income", label: "Income", color: "#22c55e" },
      { key: "expense", label: "Expense", color: "#ef4444" },
    ],
    trend: [
      { label: "Jan", income: 58, expense: 32 },
      { label: "Feb", income: 62, expense: 35 },
      { label: "Mar", income: 66, expense: 38 },
      { label: "Apr", income: 69, expense: 41 },
      { label: "May", income: 72, expense: 43 },
      { label: "Jun", income: 76, expense: 45 },
      { label: "Jul", income: 80, expense: 47 },
      { label: "Aug", income: 82, expense: 48 },
      { label: "Sep", income: 85, expense: 50 },
      { label: "Oct", income: 88, expense: 52 },
      { label: "Nov", income: 90, expense: 53 },
      { label: "Dec", income: 93, expense: 55 },
      { label: "Jan-2", income: 95, expense: 56 },
      { label: "Feb-2", income: 98, expense: 58 },
      { label: "Mar-2", income: 101, expense: 59 },
    ],
    breakdown: [
      { name: "Income", value: 67 },
      { name: "Expense", value: 33 },
    ],
  },
  inventory: {
    series: [
      { key: "finished", label: "Finished Goods", color: "#2563eb" },
      { key: "raw", label: "Raw Materials", color: "#f97316" },
      { key: "wip", label: "WIP", color: "#8b5cf6" },
    ],
    trend: [
      { label: "Jan", finished: 18, raw: 9, wip: 6 },
      { label: "Feb", finished: 20, raw: 10, wip: 7 },
      { label: "Mar", finished: 22, raw: 11, wip: 8 },
      { label: "Apr", finished: 21, raw: 10, wip: 7 },
      { label: "May", finished: 24, raw: 11, wip: 8 },
      { label: "Jun", finished: 26, raw: 12, wip: 9 },
      { label: "Jul", finished: 28, raw: 12, wip: 10 },
      { label: "Aug", finished: 27, raw: 13, wip: 10 },
      { label: "Sep", finished: 29, raw: 13, wip: 11 },
      { label: "Oct", finished: 30, raw: 14, wip: 11 },
      { label: "Nov", finished: 31, raw: 15, wip: 12 },
      { label: "Dec", finished: 33, raw: 16, wip: 12 },
      { label: "Jan-2", finished: 34, raw: 16, wip: 13 },
      { label: "Feb-2", finished: 35, raw: 17, wip: 13 },
      { label: "Mar-2", finished: 36, raw: 17, wip: 14 },
    ],
    breakdown: [
      { name: "Finished Goods", value: 46 },
      { name: "Raw Materials", value: 29 },
      { name: "WIP", value: 25 },
    ],
  },
  financialStatements: {
    series: [
      { key: "pl", label: "P&L", color: "#2563eb" },
      { key: "balanceSheet", label: "Balance Sheet", color: "#14b8a6" },
      { key: "cashFlow", label: "Cash Flow", color: "#f97316" },
    ],
    trend: [
      { label: "Jan", pl: 28, balanceSheet: 18, cashFlow: 10 },
      { label: "Feb", pl: 30, balanceSheet: 19, cashFlow: 10 },
      { label: "Mar", pl: 31, balanceSheet: 19, cashFlow: 11 },
      { label: "Apr", pl: 33, balanceSheet: 20, cashFlow: 12 },
      { label: "May", pl: 31, balanceSheet: 18, cashFlow: 11 },
      { label: "Jun", pl: 34, balanceSheet: 19, cashFlow: 12 },
      { label: "Jul", pl: 36, balanceSheet: 20, cashFlow: 12 },
      { label: "Aug", pl: 35, balanceSheet: 21, cashFlow: 12 },
      { label: "Sep", pl: 37, balanceSheet: 22, cashFlow: 13 },
      { label: "Oct", pl: 39, balanceSheet: 23, cashFlow: 13 },
      { label: "Nov", pl: 40, balanceSheet: 24, cashFlow: 14 },
      { label: "Dec", pl: 41, balanceSheet: 25, cashFlow: 14 },
      { label: "Jan-2", pl: 42, balanceSheet: 26, cashFlow: 15 },
      { label: "Feb-2", pl: 43, balanceSheet: 27, cashFlow: 15 },
      { label: "Mar-2", pl: 44, balanceSheet: 28, cashFlow: 16 },
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
  const [durationOpen, setDurationOpen] = useState(false)
  const [managementChartViews, setManagementChartViews] = useState<Record<string, ChartView>>(
    () =>
      managementCards.reduce<Record<string, ChartView>>((acc, card) => {
        acc[card.id] = "line"
        return acc
      }, {}),
  )
  const [selectorOpen, setSelectorOpen] = useState("")
  const durationRef = useRef<HTMLDivElement | null>(null)

  // Persist chart view selection per card
  useEffect(() => {
    if (typeof window === "undefined") return
    const stored = window.localStorage.getItem("management-dashboard-chart-views")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<string, ChartView>
        setManagementChartViews((prev) => ({ ...prev, ...parsed }))
      } catch {
        // ignore parse errors
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem("management-dashboard-chart-views", JSON.stringify(managementChartViews))
  }, [managementChartViews])

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (durationRef.current && !durationRef.current.contains(event.target as Node)) {
        setDurationOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const renderChart = (card: typeof managementCards[number], view: ChartView) => {
    const definition = managementChartData[card.chartKey]
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
      case "bar":
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trend} margin={{ top: 6, right: 10, left: 0, bottom: 6 }} barGap={8} barCategoryGap="20%">
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
                : <Bar dataKey={valueKey} name={card.title} fill={card.accent} radius={[4, 4, 0, 0]} barSize={18} />}
            </BarChart>
          </ResponsiveContainer>
        )
      case "area":
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
        <section className="p-3.5 lg:p-4 space-y-3.5">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50 px-4 py-3 text-xs text-slate-600 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500">Overview</span>
              <p className="text-sm font-semibold text-slate-900">Key performance metrics</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative" ref={durationRef}>
                <button
                  type="button"
                  onClick={() => setDurationOpen((prev) => !prev)}
                  className="flex h-10 min-w-[188px] items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 text-sm font-semibold text-slate-900 shadow-[0_12px_28px_-16px_rgba(16,185,129,0.55)] transition hover:border-emerald-300 focus:border-emerald-400 focus:outline-none"
                >
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  <span className="flex-1 text-left">{activeDuration}</span>
                  <ChevronDown className={`h-4 w-4 text-slate-500 transition ${durationOpen ? "rotate-180" : ""}`} />
                </button>
                {durationOpen && (
                  <div className="absolute right-0 top-11 z-20 w-48 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl">
                    {durationFilters.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        className={`flex w-full items-center justify-between px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 ${
                          activeDuration === filter ? "bg-emerald-50 font-semibold text-emerald-700" : ""
                        }`}
                        onClick={() => {
                          setActiveDuration(filter)
                          setDurationOpen(false)
                        }}
                      >
                        <span>{filter}</span>
                        {activeDuration === filter && <Check className="h-4 w-4 text-emerald-600" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white px-4 text-sm font-semibold text-emerald-700 shadow-[0_12px_28px_-16px_rgba(16,185,129,0.45)] transition hover:border-emerald-300 hover:from-emerald-100 hover:to-white">
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

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {managementCards.map((card) => (
              <Card key={card.id} className="border border-border/40 bg-white shadow-lg shadow-slate-900/5">
                <CardHeader className="relative space-y-1 pb-1">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-sm font-semibold text-slate-900">{card.title}</CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs text-slate-500">
                        <p className="text-base font-semibold text-slate-900 leading-tight">{card.metric}</p>
                      </div>
                      <div className="relative">
                        <button
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                          onClick={() => setSelectorOpen((prev) => (prev === card.id ? "" : card.id))}
                        >
                          <BarChart3 className="h-4 w-4" />
                        </button>
                        {selectorOpen === card.id && (
                          <div className="absolute right-0 top-9 z-20 w-44 rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                            {chartViewOptions.map((option) => (
                              <button
                                key={option.value}
                                className={`flex w-full items-center justify-between px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-100 ${
                                  managementChartViews[card.id] === option.value ? "font-semibold text-slate-900" : ""
                                }`}
                              onClick={() => {
                                setManagementChartViews((prev) => ({ ...prev, [card.id]: option.value as ChartView }))
                                setSelectorOpen("")
                              }}
                            >
                              <span>{option.label}</span>
                                {managementChartViews[card.id] === option.value && <Check className="h-4 w-4 text-emerald-600" />}
                            </button>
                          ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="h-[180px] w-full">{renderChart(card, managementChartViews[card.id])}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
