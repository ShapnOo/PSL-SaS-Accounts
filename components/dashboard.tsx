"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { StatsGrid } from "@/components/stats-grid"
import { QuickAccess } from "@/components/quick-access"
import { ProfitLossChart } from "@/components/profit-loss-chart"
import { VoucherChart } from "@/components/voucher-chart"
import { Menu, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
            <h1 className="text-sm font-semibold text-foreground">Dashboard</h1>
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
              <span className="text-white text-xs font-medium">A</span>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-5 space-y-4">
          <StatsGrid />
          <QuickAccess />
          <div className="grid gap-4 lg:grid-cols-2">
            <ProfitLossChart />
            <VoucherChart />
          </div>
        </div>
      </main>
    </div>
  )
}
