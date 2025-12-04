"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { month: "Jan", drVoucher: 8, crVoucher: 12, cntVoucher: 5, jnlVoucher: 3 },
  { month: "Feb", drVoucher: 10, crVoucher: 15, cntVoucher: 7, jnlVoucher: 4 },
  { month: "Mar", drVoucher: 12, crVoucher: 14, cntVoucher: 8, jnlVoucher: 5 },
  { month: "Apr", drVoucher: 6, crVoucher: 10, cntVoucher: 4, jnlVoucher: 2 },
  { month: "May", drVoucher: 4, crVoucher: 8, cntVoucher: 3, jnlVoucher: 2 },
  { month: "Jun", drVoucher: 3, crVoucher: 6, cntVoucher: 2, jnlVoucher: 1 },
  { month: "Jul", drVoucher: 2, crVoucher: 4, cntVoucher: 1, jnlVoucher: 1 },
  { month: "Aug", drVoucher: 2, crVoucher: 3, cntVoucher: 1, jnlVoucher: 1 },
  { month: "Sep", drVoucher: 5, crVoucher: 8, cntVoucher: 3, jnlVoucher: 2 },
  { month: "Oct", drVoucher: 3, crVoucher: 5, cntVoucher: 2, jnlVoucher: 1 },
  { month: "Nov", drVoucher: 4, crVoucher: 6, cntVoucher: 2, jnlVoucher: 2 },
  { month: "Dec", drVoucher: 6, crVoucher: 9, cntVoucher: 4, jnlVoucher: 3 },
]

const COLORS = {
  drVoucher: "#f59e0b",
  crVoucher: "#10b981",
  cntVoucher: "#3b82f6",
  jnlVoucher: "#8b5cf6",
}

export function VoucherChart() {
  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold text-foreground">Total Voucher</CardTitle>
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
            <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#6b7280" }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "6px",
                  fontSize: "11px",
                  boxShadow: "0 2px 8px rgb(0 0 0 / 0.08)",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "9px", paddingTop: "8px" }} iconType="square" iconSize={8} />
              <Bar dataKey="drVoucher" fill={COLORS.drVoucher} name="Dr Voucher" radius={[2, 2, 0, 0]} />
              <Bar dataKey="crVoucher" fill={COLORS.crVoucher} name="Cr Voucher" radius={[2, 2, 0, 0]} />
              <Bar dataKey="cntVoucher" fill={COLORS.cntVoucher} name="Cnt Voucher" radius={[2, 2, 0, 0]} />
              <Bar dataKey="jnlVoucher" fill={COLORS.jnlVoucher} name="Jnl Voucher" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
