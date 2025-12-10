"use client"

import { useState } from "react"
import { Edit3, ToggleLeft, ToggleRight, Menu, Expand, Minimize, ChevronsUpDown, Check } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"

const accent = "#1B254D"

type Status = "Active" | "Inactive"

interface ClassItem {
  id: string
  title: string
  manualCode: string
  status: Status
}

interface GroupItem {
  id: string
  classId: string
  title: string
  manualCode: string
  status: Status
}

interface SubGroupItem {
  id: string
  groupId: string
  title: string
  manualCode: string
  status: Status
}

interface ControlItem {
  id: string
  subGroupId: string
  title: string
  manualCode: string
  status: Status
}

interface GlAccount {
  id: string
  controlId: string
  title: string
  manualCode: string
  status: Status
}

const initialClasses: ClassItem[] = [
  { id: "cls-1", title: "Assets", manualCode: "1000", status: "Active" },
  { id: "cls-2", title: "Liabilities", manualCode: "2000", status: "Active" },
  { id: "cls-3", title: "Equity", manualCode: "3000", status: "Active" },
  { id: "cls-4", title: "Revenue", manualCode: "4000", status: "Active" },
  { id: "cls-5", title: "Expenses", manualCode: "5000", status: "Active" },
  { id: "cls-6", title: "Other Income", manualCode: "4100", status: "Active" },
  { id: "cls-7", title: "Other Expenses", manualCode: "5100", status: "Active" },
  { id: "cls-8", title: "Fixed Assets", manualCode: "1200", status: "Active" },
  { id: "cls-9", title: "Investments", manualCode: "1300", status: "Active" },
  { id: "cls-10", title: "Deferred Assets", manualCode: "1400", status: "Active" },
  { id: "cls-11", title: "Deferred Liabilities", manualCode: "2400", status: "Active" },
  { id: "cls-12", title: "Long-term Liabilities", manualCode: "2300", status: "Active" },
  { id: "cls-13", title: "Short-term Liabilities", manualCode: "2100", status: "Active" },
  { id: "cls-14", title: "Capital", manualCode: "3100", status: "Active" },
  { id: "cls-15", title: "Reserves", manualCode: "3200", status: "Active" },
  { id: "cls-16", title: "Sales", manualCode: "4200", status: "Active" },
  { id: "cls-17", title: "Service Income", manualCode: "4300", status: "Active" },
  { id: "cls-18", title: "COGS", manualCode: "5200", status: "Active" },
  { id: "cls-19", title: "Operating Expenses", manualCode: "5300", status: "Active" },
  { id: "cls-20", title: "Non-operating Expenses", manualCode: "5400", status: "Active" },
  { id: "cls-21", title: "Payroll", manualCode: "5500", status: "Active" },
  { id: "cls-22", title: "Taxes", manualCode: "5600", status: "Active" },
  { id: "cls-23", title: "Accruals", manualCode: "5700", status: "Active" },
  { id: "cls-24", title: "Prepayments", manualCode: "5800", status: "Active" },
  { id: "cls-25", title: "Loans", manualCode: "5900", status: "Active" },
  { id: "cls-26", title: "Inventory", manualCode: "1500", status: "Active" },
  { id: "cls-27", title: "Receivables", manualCode: "1600", status: "Active" },
  { id: "cls-28", title: "Payables", manualCode: "2600", status: "Active" },
  { id: "cls-29", title: "Accrued Revenue", manualCode: "1700", status: "Active" },
  { id: "cls-30", title: "Accrued Expenses", manualCode: "2700", status: "Active" },
  { id: "cls-31", title: "Deferred Revenue", manualCode: "1800", status: "Active" },
  { id: "cls-32", title: "Deferred Expense", manualCode: "2800", status: "Active" },
]

const initialGroups: GroupItem[] = [
  { id: "grp-1", classId: "cls-1", title: "Current Assets", manualCode: "1100", status: "Active" },
  { id: "grp-2", classId: "cls-8", title: "Property Plant Equipment", manualCode: "1210", status: "Active" },
  { id: "grp-3", classId: "cls-26", title: "Inventory", manualCode: "1510", status: "Active" },
  { id: "grp-4", classId: "cls-27", title: "Accounts Receivable", manualCode: "1610", status: "Active" },
  { id: "grp-5", classId: "cls-2", title: "Current Liabilities", manualCode: "2110", status: "Active" },
  { id: "grp-6", classId: "cls-12", title: "Long-term Debt", manualCode: "2310", status: "Active" },
  { id: "grp-7", classId: "cls-14", title: "Share Capital", manualCode: "3110", status: "Active" },
  { id: "grp-8", classId: "cls-15", title: "Retained Earnings", manualCode: "3210", status: "Active" },
  { id: "grp-9", classId: "cls-16", title: "Domestic Sales", manualCode: "4210", status: "Active" },
  { id: "grp-10", classId: "cls-17", title: "Service Revenue", manualCode: "4310", status: "Active" },
  { id: "grp-11", classId: "cls-18", title: "Cost of Goods Sold", manualCode: "5210", status: "Active" },
  { id: "grp-12", classId: "cls-19", title: "Admin Expenses", manualCode: "5310", status: "Active" },
  { id: "grp-13", classId: "cls-20", title: "Marketing Expenses", manualCode: "5410", status: "Active" },
  { id: "grp-14", classId: "cls-21", title: "Salaries & Wages", manualCode: "5510", status: "Active" },
  { id: "grp-15", classId: "cls-22", title: "Tax Payable", manualCode: "5610", status: "Active" },
  { id: "grp-16", classId: "cls-23", title: "Accrued Liabilities", manualCode: "5710", status: "Active" },
  { id: "grp-17", classId: "cls-24", title: "Prepaid Expenses", manualCode: "5810", status: "Active" },
  { id: "grp-18", classId: "cls-25", title: "Short-term Loans", manualCode: "5910", status: "Active" },
  { id: "grp-19", classId: "cls-9", title: "Long-term Investments", manualCode: "1310", status: "Active" },
  { id: "grp-20", classId: "cls-10", title: "Deferred Charges", manualCode: "1410", status: "Active" },
  { id: "grp-21", classId: "cls-11", title: "Deferred Tax Liability", manualCode: "2410", status: "Active" },
  { id: "grp-22", classId: "cls-13", title: "Accrued Liabilities Short-term", manualCode: "2120", status: "Active" },
  { id: "grp-23", classId: "cls-6", title: "Misc Income", manualCode: "4110", status: "Active" },
  { id: "grp-24", classId: "cls-7", title: "Misc Expenses", manualCode: "5110", status: "Active" },
  { id: "grp-25", classId: "cls-28", title: "Trade Payables", manualCode: "2610", status: "Active" },
  { id: "grp-26", classId: "cls-31", title: "Deferred Revenue", manualCode: "1810", status: "Active" },
  { id: "grp-27", classId: "cls-32", title: "Deferred Expense", manualCode: "2810", status: "Active" },
  { id: "grp-28", classId: "cls-3", title: "Member Equity", manualCode: "3010", status: "Active" },
  { id: "grp-29", classId: "cls-4", title: "Product Revenue", manualCode: "4010", status: "Active" },
  { id: "grp-30", classId: "cls-5", title: "Operating Expenses General", manualCode: "5010", status: "Active" },
  { id: "grp-31", classId: "cls-30", title: "Accrued Expenses Current", manualCode: "2710", status: "Active" },
]

const initialSubGroups: SubGroupItem[] = [
  { id: "sub-1", groupId: "grp-1", title: "Cash & Bank", manualCode: "1110", status: "Active" },
  { id: "sub-2", groupId: "grp-1", title: "Petty Cash", manualCode: "1111", status: "Active" },
  { id: "sub-3", groupId: "grp-2", title: "Buildings", manualCode: "1211", status: "Active" },
  { id: "sub-4", groupId: "grp-2", title: "Equipment", manualCode: "1212", status: "Active" },
  { id: "sub-5", groupId: "grp-3", title: "Finished Goods", manualCode: "1511", status: "Active" },
  { id: "sub-6", groupId: "grp-3", title: "Raw Materials", manualCode: "1512", status: "Active" },
  { id: "sub-7", groupId: "grp-4", title: "Trade Debtors", manualCode: "1611", status: "Active" },
  { id: "sub-8", groupId: "grp-5", title: "Trade Creditors", manualCode: "2111", status: "Active" },
  { id: "sub-9", groupId: "grp-5", title: "Accrued Liabilities", manualCode: "2112", status: "Active" },
  { id: "sub-10", groupId: "grp-6", title: "Bank Loans", manualCode: "2311", status: "Active" },
  { id: "sub-11", groupId: "grp-7", title: "Common Stock", manualCode: "3111", status: "Active" },
  { id: "sub-12", groupId: "grp-8", title: "Retained Earnings", manualCode: "3211", status: "Active" },
  { id: "sub-13", groupId: "grp-9", title: "Local Sales", manualCode: "4211", status: "Active" },
  { id: "sub-14", groupId: "grp-10", title: "Consulting", manualCode: "4311", status: "Active" },
  { id: "sub-15", groupId: "grp-11", title: "COGS - Materials", manualCode: "5211", status: "Active" },
  { id: "sub-16", groupId: "grp-12", title: "Rent Expense", manualCode: "5311", status: "Active" },
  { id: "sub-17", groupId: "grp-13", title: "Ad Spend", manualCode: "5411", status: "Active" },
  { id: "sub-18", groupId: "grp-14", title: "Salaries", manualCode: "5511", status: "Active" },
  { id: "sub-19", groupId: "grp-15", title: "Income Tax", manualCode: "5611", status: "Active" },
  { id: "sub-20", groupId: "grp-16", title: "Accruals", manualCode: "5711", status: "Active" },
  { id: "sub-21", groupId: "grp-17", title: "Prepaid Insurance", manualCode: "5811", status: "Active" },
  { id: "sub-22", groupId: "grp-18", title: "Short Term Loan", manualCode: "5911", status: "Active" },
  { id: "sub-23", groupId: "grp-19", title: "Bonds", manualCode: "1311", status: "Active" },
  { id: "sub-24", groupId: "grp-20", title: "Deferred Charges", manualCode: "1411", status: "Active" },
  { id: "sub-25", groupId: "grp-21", title: "Deferred Tax", manualCode: "2411", status: "Active" },
  { id: "sub-26", groupId: "grp-22", title: "Accrued Expenses", manualCode: "2121", status: "Active" },
  { id: "sub-27", groupId: "grp-23", title: "Misc Income", manualCode: "4111", status: "Active" },
  { id: "sub-28", groupId: "grp-24", title: "Misc Expenses", manualCode: "5111", status: "Active" },
  { id: "sub-29", groupId: "grp-25", title: "Trade Payables", manualCode: "2611", status: "Active" },
  { id: "sub-30", groupId: "grp-26", title: "Deferred Revenue", manualCode: "1811", status: "Active" },
  { id: "sub-31", groupId: "grp-27", title: "Deferred Expense", manualCode: "2811", status: "Active" },
  { id: "sub-32", groupId: "grp-28", title: "Member Equity", manualCode: "3011", status: "Active" },
  { id: "sub-33", groupId: "grp-29", title: "Online Sales", manualCode: "4011", status: "Active" },
  { id: "sub-34", groupId: "grp-30", title: "General Opex", manualCode: "5011", status: "Active" },
  { id: "sub-35", groupId: "grp-31", title: "Accrued Expenses Current", manualCode: "2711", status: "Active" },
]

const initialControls: ControlItem[] = [
  { id: "ctl-1", subGroupId: "sub-1", title: "Cash on Hand", manualCode: "11110", status: "Active" },
  { id: "ctl-2", subGroupId: "sub-1", title: "Main Bank Account", manualCode: "11120", status: "Active" },
  { id: "ctl-3", subGroupId: "sub-2", title: "Petty Cash Drawer", manualCode: "11121", status: "Active" },
  { id: "ctl-4", subGroupId: "sub-3", title: "Office Building", manualCode: "12110", status: "Active" },
  { id: "ctl-5", subGroupId: "sub-4", title: "Computer Equipment", manualCode: "12120", status: "Active" },
  { id: "ctl-6", subGroupId: "sub-5", title: "Finished Goods - Shoes", manualCode: "15111", status: "Active" },
  { id: "ctl-7", subGroupId: "sub-6", title: "Raw Materials - Leather", manualCode: "15121", status: "Active" },
  { id: "ctl-8", subGroupId: "sub-7", title: "Receivable - Retail", manualCode: "16111", status: "Active" },
  { id: "ctl-9", subGroupId: "sub-8", title: "Payable - Vendors", manualCode: "21111", status: "Active" },
  { id: "ctl-10", subGroupId: "sub-9", title: "Accrued Utilities", manualCode: "21121", status: "Active" },
  { id: "ctl-11", subGroupId: "sub-10", title: "Bank Loan A", manualCode: "23111", status: "Active" },
  { id: "ctl-12", subGroupId: "sub-11", title: "Common Stock A", manualCode: "31111", status: "Active" },
  { id: "ctl-13", subGroupId: "sub-12", title: "Retained Earnings Prior", manualCode: "32111", status: "Active" },
  { id: "ctl-14", subGroupId: "sub-13", title: "Sales - Online", manualCode: "42111", status: "Active" },
  { id: "ctl-15", subGroupId: "sub-14", title: "Consulting Fees", manualCode: "43111", status: "Active" },
  { id: "ctl-16", subGroupId: "sub-15", title: "COGS - Direct Materials", manualCode: "52111", status: "Active" },
  { id: "ctl-17", subGroupId: "sub-16", title: "Rent - HQ", manualCode: "53111", status: "Active" },
  { id: "ctl-18", subGroupId: "sub-17", title: "Digital Ads", manualCode: "54111", status: "Active" },
  { id: "ctl-19", subGroupId: "sub-18", title: "Salary - Operations", manualCode: "55111", status: "Active" },
  { id: "ctl-20", subGroupId: "sub-19", title: "Income Tax Payable", manualCode: "56111", status: "Active" },
  { id: "ctl-21", subGroupId: "sub-20", title: "Accruals - Bonuses", manualCode: "57111", status: "Active" },
  { id: "ctl-22", subGroupId: "sub-21", title: "Prepaid Insurance", manualCode: "58111", status: "Active" },
  { id: "ctl-23", subGroupId: "sub-22", title: "Short Term Loan A", manualCode: "59111", status: "Active" },
  { id: "ctl-24", subGroupId: "sub-23", title: "Bond Investment", manualCode: "13111", status: "Active" },
  { id: "ctl-25", subGroupId: "sub-24", title: "Deferred Charges - Software", manualCode: "14111", status: "Active" },
  { id: "ctl-26", subGroupId: "sub-25", title: "Deferred Tax", manualCode: "24111", status: "Active" },
  { id: "ctl-27", subGroupId: "sub-26", title: "Accrued Rent", manualCode: "21211", status: "Active" },
  { id: "ctl-28", subGroupId: "sub-27", title: "Misc Income - Other", manualCode: "41111", status: "Active" },
  { id: "ctl-29", subGroupId: "sub-28", title: "Misc Expenses - Other", manualCode: "51111", status: "Active" },
  { id: "ctl-30", subGroupId: "sub-29", title: "Trade Payable - Local", manualCode: "26111", status: "Active" },
  { id: "ctl-31", subGroupId: "sub-30", title: "Deferred Revenue - Annual", manualCode: "18111", status: "Active" },
  { id: "ctl-32", subGroupId: "sub-31", title: "Deferred Expense - Annual", manualCode: "28111", status: "Active" },
  { id: "ctl-33", subGroupId: "sub-32", title: "Member Equity A", manualCode: "30111", status: "Active" },
  { id: "ctl-34", subGroupId: "sub-33", title: "Online Sales - EU", manualCode: "40111", status: "Active" },
  { id: "ctl-35", subGroupId: "sub-34", title: "General Opex - Office", manualCode: "50111", status: "Active" },
  { id: "ctl-36", subGroupId: "sub-35", title: "Accrued Expenses Current", manualCode: "27111", status: "Active" },
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

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

function composeCode(...parts: Array<{ manualCode: string } | undefined>) {
  return parts
    .filter((p) => p && p.manualCode)
    .map((p) => p!.manualCode)
    .join("-")
}

export default function ChartOfAccountsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [classes, setClasses] = useState<ClassItem[]>(initialClasses)
  const [groups, setGroups] = useState<GroupItem[]>(initialGroups)
  const [subGroups, setSubGroups] = useState<SubGroupItem[]>(initialSubGroups)
  const [controls, setControls] = useState<ControlItem[]>(initialControls)
  const [glAccounts, setGlAccounts] = useState<GlAccount[]>(initialGlAccounts)

  const [classForm, setClassForm] = useState({ title: "", manualCode: "", status: "Active" as Status, editing: "" })
  const [groupForm, setGroupForm] = useState({
    classId: initialClasses[0]?.id ?? "",
    title: "",
    manualCode: "",
    status: "Active" as Status,
    editing: "",
  })
  const [subGroupForm, setSubGroupForm] = useState({
    groupId: initialGroups[0]?.id ?? "",
    title: "",
    manualCode: "",
    status: "Active" as Status,
    editing: "",
  })
  const [controlForm, setControlForm] = useState({
    subGroupId: initialSubGroups[0]?.id ?? "",
    title: "",
    manualCode: "",
    status: "Active" as Status,
    editing: "",
  })
  const [glForm, setGlForm] = useState({
    controlId: initialControls[0]?.id ?? "",
    title: "",
    manualCode: "",
    status: "Active" as Status,
    editing: "",
  })
  const [classDialogOpen, setClassDialogOpen] = useState(false)
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [subGroupDialogOpen, setSubGroupDialogOpen] = useState(false)
  const [controlDialogOpen, setControlDialogOpen] = useState(false)
  const [glDialogOpen, setGlDialogOpen] = useState(false)
  const [searchClass, setSearchClass] = useState("")
  const [searchGroup, setSearchGroup] = useState("")
  const [searchSubGroup, setSearchSubGroup] = useState("")
  const [searchControl, setSearchControl] = useState("")
  const [searchGl, setSearchGl] = useState("")
  const [openClass, setOpenClass] = useState(false)
  const [openGroup, setOpenGroup] = useState(false)
  const [openSubGroup, setOpenSubGroup] = useState(false)
  const [openControl, setOpenControl] = useState(false)
  const [openGl, setOpenGl] = useState(false)
  const [filterGroupClass, setFilterGroupClass] = useState("")
  const [filterSubClass, setFilterSubClass] = useState("")
  const [filterSubGroupGroup, setFilterSubGroupGroup] = useState("")
  const [filterControlClass, setFilterControlClass] = useState("")
  const [filterControlGroup, setFilterControlGroup] = useState("")
  const [filterControlSubGroup, setFilterControlSubGroup] = useState("")
  const [glFilterClass, setGlFilterClass] = useState("")
  const [glFilterGroup, setGlFilterGroup] = useState("")
  const [glFilterSubGroup, setGlFilterSubGroup] = useState("")
  const [glFilterControl, setGlFilterControl] = useState("")

  const classOptions = classes
  const resetForms = () => {
    setClassForm({ title: "", manualCode: "", status: "Active", editing: "" })
    setGroupForm({ classId: classes[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
    setSubGroupForm({ groupId: groups[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
    setControlForm({ subGroupId: subGroups[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
    setGlForm({ controlId: controls[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
  }

  const handleSaveClass = () => {
    if (!classForm.title.trim()) return
    if (classForm.editing) {
      setClasses((prev) => prev.map((c) => (c.id === classForm.editing ? { ...c, title: classForm.title, manualCode: classForm.manualCode, status: classForm.status } : c)))
    } else {
      setClasses((prev) => [...prev, { id: uid("cls"), title: classForm.title, manualCode: classForm.manualCode, status: classForm.status }])
    }
    setClassForm({ title: "", manualCode: "", status: "Active", editing: "" })
  }

  const handleSaveGroup = () => {
    if (!groupForm.title.trim() || !groupForm.classId) return
    if (groupForm.editing) {
      setGroups((prev) =>
        prev.map((g) => (g.id === groupForm.editing ? { ...g, classId: groupForm.classId, title: groupForm.title, manualCode: groupForm.manualCode, status: groupForm.status } : g)),
      )
    } else {
      setGroups((prev) => [...prev, { id: uid("grp"), classId: groupForm.classId, title: groupForm.title, manualCode: groupForm.manualCode, status: groupForm.status }])
    }
    setGroupForm({ classId: classes[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
  }

  const handleSaveSubGroup = () => {
    if (!subGroupForm.title.trim() || !subGroupForm.groupId) return
    if (subGroupForm.editing) {
      setSubGroups((prev) =>
        prev.map((sg) =>
          sg.id === subGroupForm.editing
            ? { ...sg, groupId: subGroupForm.groupId, title: subGroupForm.title, manualCode: subGroupForm.manualCode, status: subGroupForm.status }
            : sg,
        ),
      )
    } else {
      setSubGroups((prev) => [...prev, { id: uid("sub"), groupId: subGroupForm.groupId, title: subGroupForm.title, manualCode: subGroupForm.manualCode, status: subGroupForm.status }])
    }
    setSubGroupForm({ groupId: groups[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
  }

  const handleSaveControl = () => {
    if (!controlForm.title.trim() || !controlForm.subGroupId) return
    if (controlForm.editing) {
      setControls((prev) =>
        prev.map((c) =>
          c.id === controlForm.editing
            ? { ...c, subGroupId: controlForm.subGroupId, title: controlForm.title, manualCode: controlForm.manualCode, status: controlForm.status }
            : c,
        ),
      )
    } else {
      setControls((prev) => [...prev, { id: uid("ctl"), subGroupId: controlForm.subGroupId, title: controlForm.title, manualCode: controlForm.manualCode, status: controlForm.status }])
    }
    setControlForm({ subGroupId: subGroups[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
  }

  const handleSaveGl = () => {
    if (!glForm.title.trim() || !glForm.controlId) return
    if (glForm.editing) {
      setGlAccounts((prev) =>
        prev.map((g) =>
          g.id === glForm.editing
            ? { ...g, controlId: glForm.controlId, title: glForm.title, manualCode: glForm.manualCode, status: glForm.status }
            : g,
        ),
      )
    } else {
      setGlAccounts((prev) => [
        ...prev,
        { id: uid("gl"), controlId: glForm.controlId, title: glForm.title, manualCode: glForm.manualCode, status: glForm.status },
      ])
    }
    setGlForm({ controlId: controls[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
  }

  const toggleStatus = (id: string, list: "class" | "group" | "sub" | "control" | "gl") => {
    const flip = (s: Status) => (s === "Active" ? "Inactive" : "Active")
    if (list === "class") setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, status: flip(c.status) } : c)))
    if (list === "group") setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, status: flip(g.status) } : g)))
    if (list === "sub") setSubGroups((prev) => prev.map((sg) => (sg.id === id ? { ...sg, status: flip(sg.status) } : sg)))
    if (list === "control") setControls((prev) => prev.map((c) => (c.id === id ? { ...c, status: flip(c.status) } : c)))
    if (list === "gl") setGlAccounts((prev) => prev.map((g) => (g.id === id ? { ...g, status: flip(g.status) } : g)))
  }

  const classList = classes.filter((c) => `${c.title} ${c.manualCode}`.toLowerCase().includes(searchClass.toLowerCase()))
  const groupList = groups.filter((g) => {
    const parent = classes.find((c) => c.id === g.classId)?.title ?? ""
    const cls = classes.find((c) => c.id === g.classId)
    const code = composeCode(cls, g)
    const matchesClassFilter = !filterGroupClass || g.classId === filterGroupClass
    return `${g.title} ${g.manualCode} ${parent} ${code}`.toLowerCase().includes(searchGroup.toLowerCase()) && matchesClassFilter
  })
  const subGroupList = subGroups.filter((sg) => {
    const parent = groups.find((g) => g.id === sg.groupId)?.title ?? ""
    const grp = groups.find((g) => g.id === sg.groupId)
    const cls = grp ? classes.find((c) => c.id === grp.classId) : undefined
    const code = composeCode(cls, grp, sg)
    const matchesClassFilter = !filterSubClass || cls?.id === filterSubClass
    const matchesGroupFilter = !filterSubGroupGroup || grp?.id === filterSubGroupGroup
    return `${sg.title} ${sg.manualCode} ${parent} ${code}`.toLowerCase().includes(searchSubGroup.toLowerCase()) && matchesClassFilter && matchesGroupFilter
  })
  const controlList = controls.filter((c) => {
    const sub = subGroups.find((sg) => sg.id === c.subGroupId)
    const grp = sub ? groups.find((g) => g.id === sub.groupId) : undefined
    const cls = grp ? classes.find((cl) => cl.id === grp.classId) : undefined
    const code = composeCode(cls, grp, sub, c)
    const parent = sub?.title ?? ""
    const matchesClassFilter = !filterControlClass || cls?.id === filterControlClass
    const matchesGroupFilter = !filterControlGroup || grp?.id === filterControlGroup
    const matchesSubFilter = !filterControlSubGroup || sub?.id === filterControlSubGroup
    return (
      `${c.title} ${c.manualCode} ${parent} ${code}`.toLowerCase().includes(searchControl.toLowerCase()) &&
      matchesClassFilter &&
      matchesGroupFilter &&
      matchesSubFilter
    )
  })
  const glList = glAccounts.filter((g) => {
    const parent = controls.find((c) => c.id === g.controlId)?.title ?? ""
    const control = controls.find((c) => c.id === g.controlId)
    const sub = control ? subGroups.find((sg) => sg.id === control.subGroupId) : undefined
    const group = sub ? groups.find((gr) => gr.id === sub.groupId) : undefined
    const cls = group ? classes.find((cl) => cl.id === group.classId) : undefined
    const code = composeCode(cls, group, sub, control, g)
    const matchesSearch = `${g.title} ${g.manualCode} ${parent} ${code}`.toLowerCase().includes(searchGl.toLowerCase())
    const matchesClass = !glFilterClass || cls?.id === glFilterClass
    const matchesGroup = !glFilterGroup || group?.id === glFilterGroup
    const matchesSub = !glFilterSubGroup || sub?.id === glFilterSubGroup
    const matchesControl = !glFilterControl || control?.id === glFilterControl
    return matchesSearch && matchesClass && matchesGroup && matchesSub && matchesControl
  })

  const filteredGlClasses = classes
  const filteredGlGroups = groups.filter((g) => !glFilterClass || g.classId === glFilterClass)
  const filteredGlSubGroups = subGroups.filter((sg) => !glFilterGroup || sg.groupId === glFilterGroup)
  const filteredGlControls = controls.filter((c) => !glFilterSubGroup || c.subGroupId === glFilterSubGroup)

  const renderStatus = (status: Status) => (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
        status === "Active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {status === "Active" ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
      {status}
    </span>
  )

  const FilterSelect = ({
    label,
    placeholder,
    options,
    value,
    onChange,
    disabled,
  }: {
    label: string
    placeholder: string
    options: { id: string; label: string }[]
    value: string
    onChange: (v: string) => void
    disabled?: boolean
  }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 min-w-[140px] justify-between rounded-md border border-slate-300 bg-white px-3 text-[11px] text-slate-700 shadow-sm hover:bg-slate-50"
          disabled={disabled}
        >
          <span className="truncate">{value ? options.find((o) => o.id === value)?.label ?? placeholder : placeholder}</span>
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-64">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase()}...`} className="h-9 text-[11px]" />
          <CommandList className="max-h-64">
            <CommandEmpty className="text-xs text-slate-500">No results</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => onChange("")}
                className="cursor-pointer text-[11px]"
              >
                <Check className={`mr-2 h-3 w-3 ${value === "" ? "opacity-100" : "opacity-0"}`} />
                All {label}
              </CommandItem>
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  onSelect={() => onChange(opt.id)}
                  className="cursor-pointer text-[11px]"
                >
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

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        collapsed={sidebarCollapsed}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className={`flex-1 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-[18rem]"}`}>
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur-sm lg:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden h-9 w-9 rounded-md border border-slate-200" onClick={() => setSidebarOpen(true)}>
              <Menu className="mx-auto" size={18} />
            </button>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Configuration</p>
              <h1 className="text-lg font-semibold text-slate-900">Chart of Accounts</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Button variant="outline" onClick={resetForms} className="h-8 border-slate-200 text-slate-600">
              Reset forms
            </Button>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm text-slate-900">Class List</CardTitle>
                <p className="text-xs text-slate-500">Manage class names and statuses.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="Search class..."
                  value={searchClass}
                  onChange={(e) => setSearchClass(e.target.value)}
                  className="h-9 w-40"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-10 rounded-md border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 text-[11px]"
                  onClick={() => setOpenClass((prev) => !prev)}
                >
                  {openClass ? <Minimize size={16} /> : <Expand size={16} />}
                </Button>
                <Button
                  style={{ backgroundColor: accent }}
                  className="h-9 rounded-md px-4 text-white shadow-sm hover:brightness-110 text-[11px]"
                  onClick={() => setClassDialogOpen(true)}
                >
                  Add
                </Button>
              </div>
            </CardHeader>
            {openClass && (
              <CardContent className="overflow-x-auto">
                <table className="min-w-full text-[11px]">
                  <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Class</th>
                      <th className="px-3 py-2 text-left">Manual Code</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classList.map((item, idx) => (
                      <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/80"}>
                        <td className="px-3 py-2 text-slate-900">{item.title}</td>
                        <td className="px-3 py-2 text-slate-700">{item.manualCode || "-"}</td>
                        <td className="px-3 py-2">{renderStatus(item.status)}</td>
                        <td className="px-3 py-2 text-right space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 border-slate-200 text-[11px]"
                            onClick={() => {
                              setClassForm({ ...item, editing: item.id })
                              setClassDialogOpen(true)
                            }}
                          >
                            <Edit3 size={14} className="mr-1" /> Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-slate-600 text-[11px]"
                            onClick={() => toggleStatus(item.id, "class")}
                          >
                            Toggle
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {classList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
                          No class defined
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            )}
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm text-slate-900">Group List</CardTitle>
                <p className="text-xs text-slate-500">Groups under classes.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="Search group..."
                  value={searchGroup}
                  onChange={(e) => setSearchGroup(e.target.value)}
                  className="h-9 w-40 text-[11px]"
                />
                <FilterSelect
                  label="Class"
                  placeholder="All Class"
                  options={classes.map((c) => ({ id: c.id, label: c.title }))}
                  value={filterGroupClass}
                  onChange={(v) => setFilterGroupClass(v)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-10 rounded-md border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 text-[11px]"
                  onClick={() => setOpenGroup((prev) => !prev)}
                >
                  {openGroup ? <Minimize size={16} /> : <Expand size={16} />}
                </Button>
                <Button
                  style={{ backgroundColor: accent }}
                  className="h-9 rounded-md px-4 text-white shadow-sm hover:brightness-110 text-[11px]"
                  onClick={() => setGroupDialogOpen(true)}
                >
                  Add
                </Button>
              </div>
            </CardHeader>
            {openGroup && (
              <CardContent className="overflow-x-auto">
                <table className="min-w-full text-[11px]">
                  <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Class</th>
                      <th className="px-3 py-2 text-left">Group</th>
                      <th className="px-3 py-2 text-left">Manual Code</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupList.map((item, idx) => {
                      const cls = classes.find((c) => c.id === item.classId)
                      return (
                        <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/80"}>
                          <td className="px-3 py-2 text-slate-700">{cls?.title ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-900">{item.title}</td>
                        <td className="px-3 py-2 text-slate-700">
                          {composeCode(cls, item) || "-"}
                        </td>
                          <td className="px-3 py-2">{renderStatus(item.status)}</td>
                          <td className="px-3 py-2 text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                            className="h-8 border-slate-200 text-[11px]"
                              onClick={() => {
                                setGroupForm({ ...item, editing: item.id })
                                setGroupDialogOpen(true)
                              }}
                            >
                              <Edit3 size={14} className="mr-1" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                            className="h-8 text-slate-600 text-[11px]"
                              onClick={() => toggleStatus(item.id, "group")}
                            >
                              Toggle
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                    {groupList.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-3 py-4 text-center text-slate-500">
                          No group defined
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            )}
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm text-slate-900">Sub Group List</CardTitle>
                <p className="text-xs text-slate-500">Sub groups under groups.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="Search sub group..."
                  value={searchSubGroup}
                  onChange={(e) => setSearchSubGroup(e.target.value)}
                  className="h-9 w-40 text-[11px]"
                />
                <FilterSelect
                  label="Class"
                  placeholder="All Class"
                  options={classes.map((c) => ({ id: c.id, label: c.title }))}
                  value={filterSubClass}
                  onChange={(v) => {
                    setFilterSubClass(v)
                    setFilterSubGroupGroup("")
                  }}
                />
                <FilterSelect
                  label="Group"
                  placeholder="All Group"
                  options={groups.filter((g) => !filterSubClass || g.classId === filterSubClass).map((g) => ({ id: g.id, label: g.title }))}
                  value={filterSubGroupGroup}
                  onChange={(v) => setFilterSubGroupGroup(v)}
                  disabled={!filterSubClass && groups.length === 0}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-10 rounded-md border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 text-[11px]"
                  onClick={() => setOpenSubGroup((prev) => !prev)}
                >
                  {openSubGroup ? <Minimize size={16} /> : <Expand size={16} />}
                </Button>
                <Button
                  style={{ backgroundColor: accent }}
                  className="h-9 rounded-md px-4 text-white shadow-sm hover:brightness-110 text-[11px]"
                  onClick={() => setSubGroupDialogOpen(true)}
                >
                  Add
                </Button>
              </div>
            </CardHeader>
            {openSubGroup && (
              <CardContent className="overflow-x-auto">
                <table className="min-w-full text-[11px]">
                  <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Class</th>
                      <th className="px-3 py-2 text-left">Group</th>
                      <th className="px-3 py-2 text-left">Sub Group</th>
                      <th className="px-3 py-2 text-left">Manual Code</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subGroupList.map((item, idx) => {
                      const grp = groups.find((g) => g.id === item.groupId)
                      const cls = grp ? classes.find((c) => c.id === grp.classId) : undefined
                      return (
                        <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/80"}>
                          <td className="px-3 py-2 text-slate-700">{cls?.title ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{grp?.title ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-900">{item.title}</td>
                        <td className="px-3 py-2 text-slate-700">
                          {composeCode(cls, grp, item) || "-"}
                        </td>
                          <td className="px-3 py-2">{renderStatus(item.status)}</td>
                          <td className="px-3 py-2 text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                            className="h-8 border-slate-200 text-[11px]"
                              onClick={() => {
                                setSubGroupForm({ ...item, editing: item.id })
                                setSubGroupDialogOpen(true)
                              }}
                            >
                              <Edit3 size={14} className="mr-1" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                            className="h-8 text-slate-600 text-[11px]"
                              onClick={() => toggleStatus(item.id, "sub")}
                            >
                              Toggle
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                    {subGroupList.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-3 py-4 text-center text-slate-500">
                          No sub group defined
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            )}
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm text-slate-900">Control List</CardTitle>
                <p className="text-xs text-slate-500">Controls under sub groups.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="Search control..."
                  value={searchControl}
                  onChange={(e) => setSearchControl(e.target.value)}
                  className="h-9 w-40 text-[11px]"
                />
                <FilterSelect
                  label="Class"
                  placeholder="All Class"
                  options={classes.map((c) => ({ id: c.id, label: c.title }))}
                  value={filterControlClass}
                  onChange={(v) => {
                    setFilterControlClass(v)
                    setFilterControlGroup("")
                    setFilterControlSubGroup("")
                  }}
                />
                <FilterSelect
                  label="Group"
                  placeholder="All Group"
                  options={groups.filter((g) => !filterControlClass || g.classId === filterControlClass).map((g) => ({ id: g.id, label: g.title }))}
                  value={filterControlGroup}
                  onChange={(v) => {
                    setFilterControlGroup(v)
                    setFilterControlSubGroup("")
                  }}
                  disabled={!filterControlClass && groups.length === 0}
                />
                <FilterSelect
                  label="Sub Group"
                  placeholder="All Sub Group"
                  options={subGroups.filter((sg) => !filterControlGroup || sg.groupId === filterControlGroup).map((sg) => ({ id: sg.id, label: sg.title }))}
                  value={filterControlSubGroup}
                  onChange={(v) => setFilterControlSubGroup(v)}
                  disabled={!filterControlGroup && subGroups.length === 0}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-10 rounded-md border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 text-[11px]"
                  onClick={() => setOpenControl((prev) => !prev)}
                >
                  {openControl ? <Minimize size={16} /> : <Expand size={16} />}
                </Button>
                <Button
                  style={{ backgroundColor: accent }}
                  className="h-9 rounded-md px-4 text-white shadow-sm hover:brightness-110 text-[11px]"
                  onClick={() => setControlDialogOpen(true)}
                >
                  Add
                </Button>
              </div>
            </CardHeader>
            {openControl && (
              <CardContent className="overflow-x-auto">
                <table className="min-w-full text-[11px]">
                  <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Class</th>
                      <th className="px-3 py-2 text-left">Group</th>
                      <th className="px-3 py-2 text-left">Sub Group</th>
                      <th className="px-3 py-2 text-left">Control</th>
                      <th className="px-3 py-2 text-left">Manual Code</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {controlList.map((item, idx) => {
                      const sub = subGroups.find((sg) => sg.id === item.subGroupId)
                      const group = sub ? groups.find((g) => g.id === sub.groupId) : undefined
                      const cls = group ? classes.find((c) => c.id === group.classId) : undefined
                      return (
                        <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/80"}>
                          <td className="px-3 py-2 text-slate-700">{cls?.title ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{group?.title ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{sub?.title ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-900">{item.title}</td>
                        <td className="px-3 py-2 text-slate-700">
                          {composeCode(cls, group, sub, item) || "-"}
                        </td>
                          <td className="px-3 py-2">{renderStatus(item.status)}</td>
                          <td className="px-3 py-2 text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                            className="h-8 border-slate-200 text-[11px]"
                              onClick={() => {
                                setControlForm({ ...item, editing: item.id })
                                setControlDialogOpen(true)
                              }}
                            >
                              <Edit3 size={14} className="mr-1" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                            className="h-8 text-slate-600 text-[11px]"
                              onClick={() => toggleStatus(item.id, "control")}
                            >
                              Toggle
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                    {controlList.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-3 py-4 text-center text-slate-500">
                          No control defined
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            )}
          </Card>

          <Card className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-sm text-slate-900">GL Account List</CardTitle>
                  <p className="text-xs text-slate-500">GL accounts under control names.</p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-2 sm:flex-1 sm:justify-end">
                  <Input
                    placeholder="Search GL account..."
                    value={searchGl}
                    onChange={(e) => setSearchGl(e.target.value)}
                    className="h-9 w-48 text-[11px]"
                  />
                  <FilterSelect
                    label="Class"
                    placeholder="All Class"
                  options={filteredGlClasses.map((c) => ({ id: c.id, label: c.title }))}
                  value={glFilterClass}
                  onChange={(v) => {
                    setGlFilterClass(v)
                    setGlFilterGroup("")
                    setGlFilterSubGroup("")
                    setGlFilterControl("")
                  }}
                />
                <FilterSelect
                  label="Group"
                  placeholder="All Group"
                  options={filteredGlGroups.map((g) => ({ id: g.id, label: g.title }))}
                  value={glFilterGroup}
                  onChange={(v) => {
                    setGlFilterGroup(v)
                    setGlFilterSubGroup("")
                    setGlFilterControl("")
                  }}
                  disabled={!glFilterClass && filteredGlGroups.length === 0}
                />
                <FilterSelect
                  label="Sub Group"
                  placeholder="All Sub Group"
                  options={filteredGlSubGroups.map((sg) => ({ id: sg.id, label: sg.title }))}
                  value={glFilterSubGroup}
                  onChange={(v) => {
                    setGlFilterSubGroup(v)
                    setGlFilterControl("")
                  }}
                  disabled={!glFilterGroup && filteredGlSubGroups.length === 0}
                />
                <FilterSelect
                  label="Control"
                  placeholder="All Control"
                    options={filteredGlControls.map((c) => ({ id: c.id, label: c.title }))}
                    value={glFilterControl}
                    onChange={(v) => setGlFilterControl(v)}
                    disabled={!glFilterSubGroup && filteredGlControls.length === 0}
                  />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-10 rounded-md border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50 text-[11px]"
                  onClick={() => setOpenGl((prev) => !prev)}
                >
                  {openGl ? <Minimize size={16} /> : <Expand size={16} />}
                </Button>
                <Button
                  style={{ backgroundColor: accent }}
                  className="h-9 rounded-md px-4 text-white shadow-sm hover:brightness-110 text-[11px]"
                  onClick={() => setGlDialogOpen(true)}
                >
                  Add
                </Button>
              </div>
            </CardHeader>
            {openGl && (
              <CardContent className="overflow-x-auto">
                <table className="min-w-full text-[11px]">
                  <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Class</th>
                      <th className="px-3 py-2 text-left">Group</th>
                      <th className="px-3 py-2 text-left">Sub Group</th>
                      <th className="px-3 py-2 text-left">Control</th>
                      <th className="px-3 py-2 text-left">GL Account</th>
                      <th className="px-3 py-2 text-left">Manual Code</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {glList.map((item, idx) => {
                      const control = controls.find((c) => c.id === item.controlId)
                      const sub = control ? subGroups.find((sg) => sg.id === control.subGroupId) : undefined
                      const group = sub ? groups.find((g) => g.id === sub.groupId) : undefined
                      const cls = group ? classes.find((c) => c.id === group.classId) : undefined
                      return (
                        <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/80"}>
                          <td className="px-3 py-2 text-slate-700">{cls?.title ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{group?.title ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{sub?.title ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-700">{control?.title ?? "-"}</td>
                          <td className="px-3 py-2 text-slate-900">{item.title}</td>
                          <td className="px-3 py-2 text-slate-700">
                            {composeCode(cls, group, sub, control, item) || "-"}
                          </td>
                          <td className="px-3 py-2">{renderStatus(item.status)}</td>
                          <td className="px-3 py-2 text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                            className="h-8 border-slate-200 text-[11px]"
                              onClick={() => {
                                setGlForm({ ...item, editing: item.id })
                                setGlDialogOpen(true)
                              }}
                            >
                              <Edit3 size={14} className="mr-1" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                            className="h-8 text-slate-600 text-[11px]"
                              onClick={() => toggleStatus(item.id, "gl")}
                            >
                              Toggle
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                    {glList.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-3 py-4 text-center text-slate-500">
                          No GL account defined
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            )}
          </Card>
        </div>

        {/* Dialogs */}
        <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle style={{ color: accent }}>{classForm.editing ? "Edit Class" : "Add Class"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Account Title/Head *</Label>
                <Input
                  placeholder="e.g. Assets"
                  value={classForm.title}
                  onChange={(e) => setClassForm((p) => ({ ...p, title: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Manual Code</Label>
                <Input
                  placeholder="1000"
                  value={classForm.manualCode}
                  onChange={(e) => setClassForm((p) => ({ ...p, manualCode: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Activation</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={classForm.status}
                  onChange={(e) => setClassForm((p) => ({ ...p, status: e.target.value as Status }))}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setClassDialogOpen(false)} className="h-10">
                Close
              </Button>
              <Button
                className="text-white"
                style={{ backgroundColor: accent }}
                onClick={() => {
                  handleSaveClass()
                  setClassDialogOpen(false)
                }}
              >
                {classForm.editing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle style={{ color: accent }}>{groupForm.editing ? "Edit Group" : "Add Group"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Class *</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={groupForm.classId}
                  onChange={(e) => setGroupForm((p) => ({ ...p, classId: e.target.value }))}
                >
                  <option value="">Select class</option>
                  {classOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Account Title/Head *</Label>
                <Input
                  placeholder="e.g. Current Assets"
                  value={groupForm.title}
                  onChange={(e) => setGroupForm((p) => ({ ...p, title: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Manual Code</Label>
                <Input
                  placeholder="1100"
                  value={groupForm.manualCode}
                  onChange={(e) => setGroupForm((p) => ({ ...p, manualCode: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Activation</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={groupForm.status}
                  onChange={(e) => setGroupForm((p) => ({ ...p, status: e.target.value as Status }))}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setGroupDialogOpen(false)} className="h-10">
                Close
              </Button>
              <Button
                className="text-white"
                style={{ backgroundColor: accent }}
                onClick={() => {
                  handleSaveGroup()
                  setGroupDialogOpen(false)
                }}
              >
                {groupForm.editing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={subGroupDialogOpen} onOpenChange={setSubGroupDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle style={{ color: accent }}>{subGroupForm.editing ? "Edit Sub Group" : "Add Sub Group"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Group *</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={subGroupForm.groupId}
                  onChange={(e) => setSubGroupForm((p) => ({ ...p, groupId: e.target.value }))}
                >
                  <option value="">Select group</option>
                  {groupList.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Account Title/Head *</Label>
                <Input
                  placeholder="e.g. Cash & Bank"
                  value={subGroupForm.title}
                  onChange={(e) => setSubGroupForm((p) => ({ ...p, title: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Manual Code</Label>
                <Input
                  placeholder="1110"
                  value={subGroupForm.manualCode}
                  onChange={(e) => setSubGroupForm((p) => ({ ...p, manualCode: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Activation</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={subGroupForm.status}
                  onChange={(e) => setSubGroupForm((p) => ({ ...p, status: e.target.value as Status }))}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setSubGroupDialogOpen(false)} className="h-10">
                Close
              </Button>
              <Button
                className="text-white"
                style={{ backgroundColor: accent }}
                onClick={() => {
                  handleSaveSubGroup()
                  setSubGroupDialogOpen(false)
                }}
              >
                {subGroupForm.editing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={controlDialogOpen} onOpenChange={setControlDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle style={{ color: accent }}>{controlForm.editing ? "Edit Control" : "Add Control"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Sub Group *</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={controlForm.subGroupId}
                  onChange={(e) => setControlForm((p) => ({ ...p, subGroupId: e.target.value }))}
                >
                  <option value="">Select sub group</option>
                  {subGroupList.map((sg) => (
                    <option key={sg.id} value={sg.id}>
                      {sg.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Account Title/Head *</Label>
                <Input
                  placeholder="e.g. Cash on Hand"
                  value={controlForm.title}
                  onChange={(e) => setControlForm((p) => ({ ...p, title: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Manual Code</Label>
                <Input
                  placeholder="1111"
                  value={controlForm.manualCode}
                  onChange={(e) => setControlForm((p) => ({ ...p, manualCode: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Activation</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={controlForm.status}
                  onChange={(e) => setControlForm((p) => ({ ...p, status: e.target.value as Status }))}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setControlDialogOpen(false)} className="h-10">
                Close
              </Button>
              <Button
                className="text-white"
                style={{ backgroundColor: accent }}
                onClick={() => {
                  handleSaveControl()
                  setControlDialogOpen(false)
                }}
              >
                {controlForm.editing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={glDialogOpen} onOpenChange={setGlDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle style={{ color: accent }}>{glForm.editing ? "Edit GL Account" : "Add GL Account"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Control *</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={glForm.controlId}
                  onChange={(e) => setGlForm((p) => ({ ...p, controlId: e.target.value }))}
                >
                  <option value="">Select control</option>
                  {controls.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">GL Account Title/Head *</Label>
                <Input
                  placeholder="e.g. Cash Drawer A"
                  value={glForm.title}
                  onChange={(e) => setGlForm((p) => ({ ...p, title: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Manual Code</Label>
                <Input
                  placeholder="1111001"
                  value={glForm.manualCode}
                  onChange={(e) => setGlForm((p) => ({ ...p, manualCode: e.target.value }))}
                  className="h-10"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Activation</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={glForm.status}
                  onChange={(e) => setGlForm((p) => ({ ...p, status: e.target.value as Status }))}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setGlDialogOpen(false)} className="h-10">
                Close
              </Button>
              <Button
                className="text-white"
                style={{ backgroundColor: accent }}
                onClick={() => {
                  handleSaveGl()
                  setGlDialogOpen(false)
                }}
              >
                {glForm.editing ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
