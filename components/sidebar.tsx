"use client"

import type { ComponentType } from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BookOpen, ChevronRight, FileText, Landmark, LayoutDashboard, Receipt, Settings, X } from "lucide-react"

interface SidebarProps {
  open: boolean
  collapsed: boolean
  onClose: () => void
  onToggleCollapse: () => void
}

type MenuChild = { label: string; href?: string }
type MenuItem = { icon: ComponentType<{ className?: string }>; label: string; href?: string; children?: MenuChild[] }

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  {
    icon: Settings,
    label: "Configuration",
    children: [
      { label: "Financial Period", href: "/financial-period" },
      { label: "Sector Name", href: "/sector-name" },
      { label: "Cost Center", href: "/cost-center" },
      { label: "New Voucher", href: "/new-voucher" },
      { label: "Month Lock", href: "/month-lock" },
    ],
  },
  {
    icon: BookOpen,
    label: "Chart of Accounts",
    children: [
      { label: "Chart of Accounts" },
      { label: "View Chart of Accounts" },
      { label: "Opening Balance" },
      { label: "Modulewise COA" },
      { label: "Module wise COA List" },
      { label: "Customer", href: "/chart-of-accounts/customer" },
    ],
  },
  {
    icon: Receipt,
    label: "Transaction",
    children: [
      { label: "Voucher List", href: "/voucher-list" },
      { label: "Journal Voucher", href: "/journal-voucher" },
      { label: "Bank Voucher", href: "/bank-voucher" },
      { label: "Cash Voucher", href: "/cash-voucher" },
      { label: "Contra Voucher", href: "/contra-voucher" },
      { label: "Bank Payment Voucher", href: "/bank-payment-voucher" },
      { label: "Bank Received Voucher", href: "/bank-received-voucher" },
      { label: "Cash Payment Voucher", href: "/cash-payment-voucher" },
      { label: "Cash Received Voucher", href: "/cash-received-voucher" },
    ],
  },
  {
    icon: Landmark,
    label: "Bank Reconciliation",
    children: [
      { label: "Bank Voucher", href: "/bank-reconciliation/bank-voucher" },
      { label: "Bank Reconciliation", href: "/bank-reconciliation" },
    ],
  },
  { icon: FileText, label: "Reports" },
]

export function Sidebar({ open, collapsed, onClose, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname()

  const [openItems, setOpenItems] = useState<Record<string, boolean>>(() => {
    const defaults: Record<string, boolean> = {}
    menuItems.forEach((item) => {
      if (item.children) {
        defaults[item.label] = true
      }
    })
    return defaults
  })

  const toggleItem = (label: string) => {
    setOpenItems((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={onClose} />}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-full w-64 max-w-[18rem] flex-col bg-white text-slate-800 shadow-xl ring-1 ring-slate-200 transition-transform duration-300 lg:translate-x-0",
          collapsed && "lg:w-16 lg:max-w-16",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-semibold text-sm">
              P
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight">PakizaAccounts</span>
                <span className="text-[11px] text-slate-500">Account Management</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 hidden lg:inline-flex hover:bg-slate-100 h-8 w-8"
              onClick={onToggleCollapse}
            >
              <ChevronRight className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-500 lg:hidden hover:bg-slate-100 h-8 w-8"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <nav className={cn("flex-1 overflow-y-auto p-4 space-y-2", collapsed && "px-2")}>
          {!collapsed && (
            <div className="px-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Navigation</div>
          )}
          {menuItems.map((item) => {
            const hasChildren = !!item.children?.length
            const childActive = !!item.children?.some((child) => child.href && pathname === child.href)
            const isActive = (item.href && pathname === item.href) || childActive
            const isOpen = hasChildren ? openItems[item.label] : false

            const baseButtonClasses = cn(
              "group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all border border-transparent",
              isActive
                ? "bg-slate-900 text-white shadow-sm border-slate-900"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
            )

            const content = (
              <>
                <item.icon
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700",
                  )}
                />
                {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
                {!collapsed && hasChildren && (
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 opacity-60 transition-transform",
                      isOpen && "rotate-90",
                      isActive ? "text-white" : "text-slate-500",
                    )}
                  />
                )}
              </>
            )

            return (
              <div key={item.label} className="space-y-1">
                {item.href && !hasChildren ? (
                  <Link href={item.href} className={baseButtonClasses} onClick={open ? onClose : undefined}>
                    {content}
                  </Link>
                ) : (
                  <button className={baseButtonClasses} onClick={hasChildren ? () => toggleItem(item.label) : undefined}>
                    {content}
                  </button>
                )}

                {!collapsed && hasChildren && isOpen && (
                  <div className="ml-3 mt-0.5 space-y-0.5 rounded-lg bg-slate-50 px-2 py-2 ring-1 ring-slate-100">
                    {item.children?.map((child) => {
                      const childIsActive = child.href && pathname === child.href
                      return child.href ? (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={cn(
                            "flex w-full items-center gap-2 rounded-md px-7 py-1.5 text-xs transition-all",
                            childIsActive
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-600 hover:bg-white hover:text-slate-900 hover:translate-x-[2px]",
                          )}
                          onClick={open ? onClose : undefined}
                        >
                          <span className="block h-1.5 w-1.5 rounded-full bg-slate-300" aria-hidden />
                          <span className="flex-1 text-left">{child.label}</span>
                        </Link>
                      ) : (
                        <div
                          key={child.label}
                          className="flex w-full items-center gap-2 rounded-md px-7 py-1.5 text-xs text-slate-500 opacity-70"
                        >
                          <span className="block h-1.5 w-1.5 rounded-full bg-slate-200" aria-hidden />
                          <span className="flex-1 text-left">{child.label}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        <div className="border-t border-slate-200 bg-white p-4">
          {!collapsed && (
            <>
              <p className="text-xs text-slate-500">
                Powered by <span className="text-slate-900 font-semibold">PakizaAccounts</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Version: 1.0.0</p>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
