"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { month: "Jan", revenue: 50000000, costOfRevenue: 30000000, grossProfit: 20000000, netProfit: 15000000 },
  { month: "Feb", revenue: 200000000, costOfRevenue: 120000000, grossProfit: 80000000, netProfit: 60000000 },
  { month: "Mar", revenue: 80000000, costOfRevenue: 50000000, grossProfit: 30000000, netProfit: 20000000 },
  { month: "Apr", revenue: 20000000, costOfRevenue: 15000000, grossProfit: 5000000, netProfit: 2000000 },
  { month: "May", revenue: 10000000, costOfRevenue: 8000000, grossProfit: 2000000, netProfit: 1000000 },
  { month: "Jun", revenue: 5000000, costOfRevenue: 4000000, grossProfit: 1000000, netProfit: 500000 },
  { month: "Jul", revenue: 3000000, costOfRevenue: 2500000, grossProfit: 500000, netProfit: 200000 },
  { month: "Aug", revenue: 2000000, costOfRevenue: 1800000, grossProfit: 200000, netProfit: 100000 },
  { month: "Sep", revenue: 30000000, costOfRevenue: 20000000, grossProfit: 10000000, netProfit: 5000000 },
  { month: "Oct", revenue: 5000000, costOfRevenue: 4000000, grossProfit: 1000000, netProfit: 500000 },
  { month: "Nov", revenue: 10000000, costOfRevenue: 8000000, grossProfit: 2000000, netProfit: 1000000 },
  { month: "Dec", revenue: 20000000, costOfRevenue: 15000000, grossProfit: 5000000, netProfit: 2500000 },
]

const COLORS = {
  revenue: "#3b82f6",
  costOfRevenue: "#64748b",
  grossProfit: "#0ea5e9",
  netProfit: "#10b981",
}

const formatBDT = (value: number) => {
  if (value >= 10000000) return `৳${(value / 10000000).toFixed(1)} Cr`
  if (value >= 100000) return `৳${(value / 100000).toFixed(1)} Lac`
  return `৳${value.toLocaleString("en-BD")}`
}

export function ProfitLossChart() {
  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Profit Or Loss</CardTitle>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="h-7 w-[110px] text-xs border-border/40">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branch</SelectItem>
              <SelectItem value="dhaka">Dhaka</SelectItem>
              <SelectItem value="chittagong">Chittagong</SelectItem>
              <SelectItem value="sylhet">Sylhet</SelectItem>
              <SelectItem value="rajshahi">Rajshahi</SelectItem>
              <SelectItem value="khulna">Khulna</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="2025">
            <SelectTrigger className="h-7 w-[70px] text-xs border-border/40">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tick={{ fontSize: 9, fill: "#6b7280" }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                tickFormatter={(value) => `${(value / 10000000).toFixed(0)}Cr`}
                width={35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "11px",
                  boxShadow: "0 2px 8px rgb(0 0 0 / 0.08)",
                }}
                formatter={(value: number) => [formatBDT(value), ""]}
              />
              <Legend wrapperStyle={{ fontSize: "9px", paddingTop: "8px" }} iconType="circle" iconSize={6} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={COLORS.revenue}
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="costOfRevenue"
                stroke={COLORS.costOfRevenue}
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Cost Of Revenue"
              />
              <Line
                type="monotone"
                dataKey="grossProfit"
                stroke={COLORS.grossProfit}
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Gross Profit"
              />
              <Line
                type="monotone"
                dataKey="netProfit"
                stroke={COLORS.netProfit}
                strokeWidth={2}
                dot={{ r: 2 }}
                name="Net Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
