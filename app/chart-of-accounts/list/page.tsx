"use client"

import { useMemo, useState } from "react"
import { Check, ChevronsUpDown, Menu } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type CoaRow = {
  id: number
  classId: string
  className: string
  groupId: string
  groupName: string
  subGroupId: string
  subGroupName: string
  controlId: string
  controlName: string
  glName: string
  code: string
  status: "Active" | "Inactive"
}

type ClassOpt = { id: string; label: string }
type GroupOpt = { id: string; label: string; classId: string }
type SubGroupOpt = { id: string; label: string; groupId: string }
type ControlOpt = { id: string; label: string; subGroupId: string }

type GlAccount = { id: string; controlId: string; title: string; manualCode: string; status: "Active" | "Inactive" }

const classes: ClassOpt[] = [
  { id: "cls-1", label: "Assets" },
  { id: "cls-2", label: "Liabilities" },
  { id: "cls-3", label: "Equity" },
  { id: "cls-4", label: "Revenue" },
  { id: "cls-5", label: "Expenses" },
  { id: "cls-6", label: "Other Income" },
  { id: "cls-7", label: "Other Expenses" },
  { id: "cls-8", label: "Fixed Assets" },
  { id: "cls-9", label: "Investments" },
  { id: "cls-10", label: "Deferred Assets" },
  { id: "cls-11", label: "Deferred Liabilities" },
  { id: "cls-12", label: "Long-term Liabilities" },
  { id: "cls-13", label: "Short-term Liabilities" },
  { id: "cls-14", label: "Capital" },
  { id: "cls-15", label: "Reserves" },
  { id: "cls-16", label: "Sales" },
  { id: "cls-17", label: "Service Income" },
  { id: "cls-18", label: "COGS" },
  { id: "cls-19", label: "Operating Expenses" },
  { id: "cls-20", label: "Non-operating Expenses" },
  { id: "cls-21", label: "Payroll" },
  { id: "cls-22", label: "Taxes" },
  { id: "cls-23", label: "Accruals" },
  { id: "cls-24", label: "Prepayments" },
  { id: "cls-25", label: "Loans" },
  { id: "cls-26", label: "Inventory" },
  { id: "cls-27", label: "Receivables" },
  { id: "cls-28", label: "Payables" },
  { id: "cls-29", label: "Accrued Revenue" },
  { id: "cls-30", label: "Accrued Expenses" },
  { id: "cls-31", label: "Deferred Revenue" },
  { id: "cls-32", label: "Deferred Expense" },
]

const groups: GroupOpt[] = [
  { id: "grp-1", classId: "cls-1", label: "Current Assets" },
  { id: "grp-2", classId: "cls-2", label: "Current Liabilities" },
  { id: "grp-3", classId: "cls-3", label: "Member Equity" },
  { id: "grp-4", classId: "cls-4", label: "Product Revenue" },
  { id: "grp-5", classId: "cls-5", label: "Operating Expenses General" },
  { id: "grp-6", classId: "cls-6", label: "Misc Income" },
  { id: "grp-7", classId: "cls-7", label: "Misc Expenses" },
  { id: "grp-8", classId: "cls-8", label: "Property Plant Equipment" },
  { id: "grp-9", classId: "cls-9", label: "Long-term Investments" },
  { id: "grp-10", classId: "cls-10", label: "Deferred Charges" },
  { id: "grp-11", classId: "cls-11", label: "Deferred Tax Liability" },
  { id: "grp-12", classId: "cls-12", label: "Long-term Debt" },
  { id: "grp-13", classId: "cls-13", label: "Accrued Liabilities Short-term" },
  { id: "grp-14", classId: "cls-14", label: "Share Capital" },
  { id: "grp-15", classId: "cls-15", label: "Retained Earnings" },
  { id: "grp-16", classId: "cls-16", label: "Domestic Sales" },
  { id: "grp-17", classId: "cls-17", label: "Service Revenue" },
  { id: "grp-18", classId: "cls-18", label: "Cost of Goods Sold" },
  { id: "grp-19", classId: "cls-19", label: "Admin Expenses" },
  { id: "grp-20", classId: "cls-20", label: "Marketing Expenses" },
  { id: "grp-21", classId: "cls-21", label: "Salaries & Wages" },
  { id: "grp-22", classId: "cls-22", label: "Tax Payable" },
  { id: "grp-23", classId: "cls-23", label: "Accrued Liabilities" },
  { id: "grp-24", classId: "cls-24", label: "Prepaid Expenses" },
  { id: "grp-25", classId: "cls-25", label: "Short-term Loans" },
  { id: "grp-26", classId: "cls-26", label: "Inventory" },
  { id: "grp-27", classId: "cls-27", label: "Accounts Receivable" },
  { id: "grp-28", classId: "cls-28", label: "Trade Payables" },
  { id: "grp-29", classId: "cls-29", label: "Accrued Revenue" },
  { id: "grp-30", classId: "cls-30", label: "Accrued Expenses" },
  { id: "grp-31", classId: "cls-31", label: "Deferred Revenue" },
  { id: "grp-32", classId: "cls-32", label: "Deferred Expense" },
]

const subGroups: SubGroupOpt[] = [
  { id: "sub-1", groupId: "grp-1", label: "Cash & Bank" },
  { id: "sub-2", groupId: "grp-1", label: "Petty Cash" },
  { id: "sub-3", groupId: "grp-8", label: "Buildings" },
  { id: "sub-4", groupId: "grp-8", label: "Equipment" },
  { id: "sub-5", groupId: "grp-26", label: "Finished Goods" },
  { id: "sub-6", groupId: "grp-26", label: "Raw Materials" },
  { id: "sub-7", groupId: "grp-27", label: "Trade Debtors" },
  { id: "sub-8", groupId: "grp-2", label: "Trade Creditors" },
  { id: "sub-9", groupId: "grp-2", label: "Accrued Liabilities" },
  { id: "sub-10", groupId: "grp-12", label: "Bank Loans" },
  { id: "sub-11", groupId: "grp-14", label: "Common Stock" },
  { id: "sub-12", groupId: "grp-15", label: "Retained Earnings" },
  { id: "sub-13", groupId: "grp-16", label: "Local Sales" },
  { id: "sub-14", groupId: "grp-17", label: "Consulting" },
  { id: "sub-15", groupId: "grp-18", label: "COGS - Materials" },
  { id: "sub-16", groupId: "grp-19", label: "Rent Expense" },
  { id: "sub-17", groupId: "grp-20", label: "Ad Spend" },
  { id: "sub-18", groupId: "grp-21", label: "Salaries" },
  { id: "sub-19", groupId: "grp-22", label: "Income Tax" },
  { id: "sub-20", groupId: "grp-23", label: "Accruals" },
  { id: "sub-21", groupId: "grp-24", label: "Prepaid Insurance" },
  { id: "sub-22", groupId: "grp-25", label: "Short Term Loan" },
  { id: "sub-23", groupId: "grp-9", label: "Bonds" },
  { id: "sub-24", groupId: "grp-10", label: "Deferred Charges" },
  { id: "sub-25", groupId: "grp-11", label: "Deferred Tax" },
  { id: "sub-26", groupId: "grp-13", label: "Accrued Expenses" },
  { id: "sub-27", groupId: "grp-6", label: "Misc Income" },
  { id: "sub-28", groupId: "grp-7", label: "Misc Expenses" },
  { id: "sub-29", groupId: "grp-28", label: "Trade Payables" },
  { id: "sub-30", groupId: "grp-31", label: "Deferred Revenue" },
  { id: "sub-31", groupId: "grp-32", label: "Deferred Expense" },
  { id: "sub-32", groupId: "grp-3", label: "Member Equity" },
  { id: "sub-33", groupId: "grp-4", label: "Online Sales" },
  { id: "sub-34", groupId: "grp-5", label: "General Opex" },
  { id: "sub-35", groupId: "grp-30", label: "Accrued Expenses Current" },
]

const controls: ControlOpt[] = [
  { id: "ctl-1", subGroupId: "sub-1", label: "Cash on Hand" },
  { id: "ctl-2", subGroupId: "sub-1", label: "Main Bank Account" },
  { id: "ctl-3", subGroupId: "sub-2", label: "Petty Cash Drawer" },
  { id: "ctl-4", subGroupId: "sub-3", label: "Office Building" },
  { id: "ctl-5", subGroupId: "sub-4", label: "Computer Equipment" },
  { id: "ctl-6", subGroupId: "sub-5", label: "Finished Goods - Shoes" },
  { id: "ctl-7", subGroupId: "sub-6", label: "Raw Materials - Leather" },
  { id: "ctl-8", subGroupId: "sub-7", label: "Receivable - Retail" },
  { id: "ctl-9", subGroupId: "sub-8", label: "Payable - Vendors" },
  { id: "ctl-10", subGroupId: "sub-9", label: "Accrued Utilities" },
  { id: "ctl-11", subGroupId: "sub-10", label: "Bank Loan A" },
  { id: "ctl-12", subGroupId: "sub-11", label: "Common Stock A" },
  { id: "ctl-13", subGroupId: "sub-12", label: "Retained Earnings Prior" },
  { id: "ctl-14", subGroupId: "sub-13", label: "Sales - Online" },
  { id: "ctl-15", subGroupId: "sub-14", label: "Consulting Fees" },
  { id: "ctl-16", subGroupId: "sub-15", label: "COGS - Direct Materials" },
  { id: "ctl-17", subGroupId: "sub-16", label: "Rent - HQ" },
  { id: "ctl-18", subGroupId: "sub-17", label: "Digital Ads" },
  { id: "ctl-19", subGroupId: "sub-18", label: "Salary - Operations" },
  { id: "ctl-20", subGroupId: "sub-19", label: "Income Tax Payable" },
  { id: "ctl-21", subGroupId: "sub-20", label: "Accruals - Bonuses" },
  { id: "ctl-22", subGroupId: "sub-21", label: "Prepaid Insurance" },
  { id: "ctl-23", subGroupId: "sub-22", label: "Short Term Loan A" },
  { id: "ctl-24", subGroupId: "sub-23", label: "Bond Investment" },
  { id: "ctl-25", subGroupId: "sub-24", label: "Deferred Charges - Software" },
  { id: "ctl-26", subGroupId: "sub-25", label: "Deferred Tax" },
  { id: "ctl-27", subGroupId: "sub-26", label: "Accrued Rent" },
  { id: "ctl-28", subGroupId: "sub-27", label: "Misc Income - Other" },
  { id: "ctl-29", subGroupId: "sub-28", label: "Misc Expenses - Other" },
  { id: "ctl-30", subGroupId: "sub-29", label: "Trade Payable - Local" },
  { id: "ctl-31", subGroupId: "sub-30", label: "Deferred Revenue - Annual" },
  { id: "ctl-32", subGroupId: "sub-31", label: "Deferred Expense - Annual" },
  { id: "ctl-33", subGroupId: "sub-32", label: "Member Equity A" },
  { id: "ctl-34", subGroupId: "sub-33", label: "Online Sales - EU" },
  { id: "ctl-35", subGroupId: "sub-34", label: "General Opex - Office" },
  { id: "ctl-36", subGroupId: "sub-35", label: "Accrued Expenses Current" },
]

const initialGlAccounts: GlAccount[] = [
  { id: "gl-1", controlId: "ctl-1", title: "Cash Drawer A", manualCode: "1111001", status: "Active" },
  { id: "gl-2", controlId: "ctl-2", title: "Bank Account Main", manualCode: "1112001", status: "Active" },
  { id: "gl-3", controlId: "ctl-3", title: "Petty Cash Office", manualCode: "1112101", status: "Active" },
  { id: "gl-4", controlId: "ctl-4", title: "Office Building 1", manualCode: "1211001", status: "Active" },
  { id: "gl-5", controlId: "ctl-5", title: "Servers & Hardware", manualCode: "1212001", status: "Active" },
  { id: "gl-6", controlId: "ctl-6", title: "Finished Goods Warehouse A", manualCode: "1511101", status: "Active" },
  { id: "gl-7", controlId: "ctl-7", title: "Leather Inventory Rack 1", manualCode: "1512101", status: "Active" },
  { id: "gl-8", controlId: "ctl-8", title: "Receivable Retail A", manualCode: "1611101", status: "Active" },
  { id: "gl-9", controlId: "ctl-9", title: "Payable Vendor A", manualCode: "2111101", status: "Active" },
  { id: "gl-10", controlId: "ctl-10", title: "Accrued Utilities Oct", manualCode: "2112101", status: "Active" },
  { id: "gl-11", controlId: "ctl-11", title: "Bank Loan A Current Portion", manualCode: "2311101", status: "Active" },
  { id: "gl-12", controlId: "ctl-12", title: "Common Stock Issue 1", manualCode: "3111101", status: "Active" },
  { id: "gl-13", controlId: "ctl-13", title: "Retained Earnings Opening", manualCode: "3211101", status: "Active" },
  { id: "gl-14", controlId: "ctl-14", title: "Online Sales NA", manualCode: "4211101", status: "Active" },
  { id: "gl-15", controlId: "ctl-15", title: "Consulting Fees APAC", manualCode: "4311101", status: "Active" },
  { id: "gl-16", controlId: "ctl-16", title: "COGS Materials Batch 1", manualCode: "5211101", status: "Active" },
  { id: "gl-17", controlId: "ctl-17", title: "Rent HQ Floor 1", manualCode: "5311101", status: "Active" },
  { id: "gl-18", controlId: "ctl-18", title: "Digital Ads Q1", manualCode: "5411101", status: "Active" },
  { id: "gl-19", controlId: "ctl-19", title: "Salary Ops - Team A", manualCode: "5511101", status: "Active" },
  { id: "gl-20", controlId: "ctl-20", title: "Income Tax 2025", manualCode: "5611101", status: "Active" },
  { id: "gl-21", controlId: "ctl-21", title: "Accrued Bonus 2025", manualCode: "5711101", status: "Active" },
  { id: "gl-22", controlId: "ctl-22", title: "Prepaid Insurance Q2", manualCode: "5811101", status: "Active" },
  { id: "gl-23", controlId: "ctl-23", title: "Short Term Loan Facility", manualCode: "5911101", status: "Active" },
  { id: "gl-24", controlId: "ctl-24", title: "Bond Investment Series A", manualCode: "1311101", status: "Active" },
  { id: "gl-25", controlId: "ctl-25", title: "Deferred Charges SaaS", manualCode: "1411101", status: "Active" },
  { id: "gl-26", controlId: "ctl-26", title: "Deferred Tax Liability 2025", manualCode: "2411101", status: "Active" },
  { id: "gl-27", controlId: "ctl-27", title: "Accrued Rent Dec", manualCode: "2121101", status: "Active" },
  { id: "gl-28", controlId: "ctl-28", title: "Misc Income Refunds", manualCode: "4111101", status: "Active" },
  { id: "gl-29", controlId: "ctl-29", title: "Misc Expenses Fees", manualCode: "5111101", status: "Active" },
  { id: "gl-30", controlId: "ctl-30", title: "Trade Payable Local Vendor", manualCode: "2611101", status: "Active" },
  { id: "gl-31", controlId: "ctl-31", title: "Deferred Revenue Annual Plan", manualCode: "1811101", status: "Active" },
  { id: "gl-32", controlId: "ctl-32", title: "Deferred Expense Annual Plan", manualCode: "2811101", status: "Active" },
  { id: "gl-33", controlId: "ctl-33", title: "Member Equity Contribution", manualCode: "3011101", status: "Active" },
  { id: "gl-34", controlId: "ctl-34", title: "Online Sales EU Q1", manualCode: "4011101", status: "Active" },
  { id: "gl-35", controlId: "ctl-35", title: "General Opex - Office Supplies", manualCode: "5011101", status: "Active" },
  { id: "gl-36", controlId: "ctl-36", title: "Accrued Expenses Current Month", manualCode: "2711101", status: "Active" },
]

const seed: CoaRow[] = initialGlAccounts.map((gl, idx) => {
  const ctl = controls.find((c) => c.id === gl.controlId)
  const sub = ctl ? subGroups.find((s) => s.id === ctl.subGroupId) : undefined
  const grp = sub ? groups.find((g) => g.id === sub.groupId) : undefined
  const cls = grp ? classes.find((c) => c.id === grp.classId) : undefined
  const code = [cls?.label, grp?.label, sub?.label, ctl?.label, gl.manualCode].filter(Boolean).join(" - ")

  return {
    id: idx + 1,
    classId: cls?.id ?? "",
    className: cls?.label ?? "-",
    groupId: grp?.id ?? "",
    groupName: grp?.label ?? "-",
    subGroupId: sub?.id ?? "",
    subGroupName: sub?.label ?? "-",
    controlId: ctl?.id ?? "",
    controlName: ctl?.label ?? "-",
    glName: gl.title,
    code: code || gl.manualCode,
    status: gl.status,
  }
})

function FilterSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
}: {
  label: string
  placeholder: string
  options: { id: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-10 min-w-[140px] justify-between rounded-md border border-border/80 bg-white px-3 text-sm text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <span className="truncate text-left">{value ? options.find((o) => o.id === value)?.label ?? placeholder : placeholder}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-64">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="h-9 text-[11px]" />
          <CommandList className="max-h-64">
            <CommandEmpty className="text-xs text-slate-500">No results</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={() => onChange("")} className="cursor-pointer text-[11px]">
                <Check className={`mr-2 h-3 w-3 ${value === "" ? "opacity-100" : "opacity-0"}`} />
                All {label}
              </CommandItem>
              {options.map((opt) => (
                <CommandItem key={opt.id} onSelect={() => onChange(opt.id)} className="cursor-pointer text-[11px]">
                  <Check className={`mr-2 h-3 w-3 ${value === opt.id ? "opacity-100" : "opacity-0"}`} />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function ChartOfAccountsListPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<"All" | CoaRow["status"]>("All")
  const [filterClass, setFilterClass] = useState("")
  const [filterGroup, setFilterGroup] = useState("")
  const [filterSubGroup, setFilterSubGroup] = useState("")
  const [filterControl, setFilterControl] = useState("")

  const filtered = useMemo(
    () =>
      seed.filter((row) => {
        const matchesSearch = [row.className, row.groupName, row.subGroupName, row.controlName, row.glName, row.code]
          .join(" ")
          .toLowerCase()
          .includes(search.toLowerCase())
        const matchesStatus = statusFilter === "All" || row.status === statusFilter
        const matchesClass = !filterClass || row.classId === filterClass
        const matchesGroup = !filterGroup || row.groupId === filterGroup
        const matchesSub = !filterSubGroup || row.subGroupId === filterSubGroup
        const matchesControl = !filterControl || row.controlId === filterControl
        return matchesSearch && matchesStatus && matchesClass && matchesGroup && matchesSub && matchesControl
      }),
    [search, statusFilter, filterClass, filterGroup, filterSubGroup, filterControl],
  )

  const filteredGroups = groups.filter((g) => !filterClass || g.classId === filterClass)
  const filteredSubGroups = subGroups.filter((sg) => !filterGroup || sg.groupId === filterGroup)
  const filteredControls = controls.filter((c) => !filterSubGroup || c.subGroupId === filterSubGroup)

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
            <button className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
              <Menu className="mx-auto" size={18} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Chart of Accounts</p>
              <h1 className="text-sm font-semibold text-foreground">View Accounts</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <Input
              placeholder="Search GL account..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-48 text-[11px]"
            />
            <FilterSelect
              label="Class"
              placeholder="All Class"
              options={classes}
              value={filterClass}
              onChange={(v) => {
                setFilterClass(v)
                setFilterGroup("")
                setFilterSubGroup("")
                setFilterControl("")
              }}
            />
            <FilterSelect
              label="Group"
              placeholder="All Group"
              options={filteredGroups}
              value={filterGroup}
              onChange={(v) => {
                setFilterGroup(v)
                setFilterSubGroup("")
                setFilterControl("")
              }}
            />
            <FilterSelect
              label="Sub Group"
              placeholder="All Sub Group"
              options={filteredSubGroups}
              value={filterSubGroup}
              onChange={(v) => {
                setFilterSubGroup(v)
                setFilterControl("")
              }}
            />
            <FilterSelect
              label="Control"
              placeholder="All Control"
              options={filteredControls}
              value={filterControl}
              onChange={(v) => setFilterControl(v)}
            />
            <select
              className="h-10 w-full max-w-[140px] rounded-md border border-border/80 bg-white px-3 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-[11px]">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Class</th>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Group</th>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Sub Group</th>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Control</th>
                  <th className="px-3 py-2 text-left border-b border-slate-200">GL Account</th>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Code</th>
                  <th className="px-3 py-2 text-left border-b border-slate-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, idx) => (
                  <tr key={row.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="px-3 py-2 text-slate-900">{row.className}</td>
                    <td className="px-3 py-2 text-slate-900">{row.groupName}</td>
                    <td className="px-3 py-2 text-slate-900">{row.subGroupName}</td>
                    <td className="px-3 py-2 text-slate-900">{row.controlName}</td>
                    <td className="px-3 py-2 text-slate-900">{row.glName}</td>
                    <td className="px-3 py-2 text-slate-900">{row.code}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                          row.status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-sm text-slate-500">
                      No accounts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
