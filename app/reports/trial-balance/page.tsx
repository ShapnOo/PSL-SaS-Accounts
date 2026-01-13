"use client"

import { useMemo, useState } from "react"
import { Menu, Printer, Search } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type GroupRow = {
  className: string
  groupName: string
  opening: string
  debit: number
  credit: number
  closing: string
}

type MainHeadRow = GroupRow & { subGroupName: string }

type GlRow = MainHeadRow & { subSubGroupName: string; accountHead: string; glCode: string }

const groupWiseRows: GroupRow[] = [
  { className: "Current Assets", groupName: "Current Assets", opening: "119,623,785 (Cr)", debit: 3314475, credit: 3777494, closing: "(12,00,59,804.16) (Cr)" },
  { className: "Current Liabilities", groupName: "Current Liabilities", opening: "9,635,860 (Cr)", debit: 153292, credit: 129114, closing: "9,611,682 (Cr)" },
  { className: "Direct Expenses", groupName: "Cost of Goods Sold", opening: "66,604 (Dr)", debit: 98359, credit: 0, closing: "164,963 (Dr)" },
  { className: "Indirect Expenses", groupName: "Operating Expenses", opening: "16,357,429 (Dr)", debit: 1204948, credit: 2500, closing: "17,559,877 (Dr)" },
  { className: "Indirect Expenses", groupName: "Non-Operating Expenses", opening: "95,000 (Dr)", debit: 0, credit: 0, closing: "95,000 (Dr)" },
  { className: "Indirect Expenses", groupName: "Tax Expenses", opening: "214,000 (Dr)", debit: 0, credit: 0, closing: "214,000 (Dr)" },
  { className: "Non Current Assets", groupName: "Non Current Assets", opening: "10,116,777 (Dr)", debit: 0, credit: 0, closing: "10,116,777 (Dr)" },
  { className: "Operating Income", groupName: "Operating Income", opening: "3,198,748 (Cr)", debit: 0, credit: 888966, closing: "4,087,714 (Cr)" },
  { className: "Shareholder Equity", groupName: "Shareholder Equity", opening: "105,608,584 (Dr)", debit: 0, credit: 0, closing: "(10,56,08,583.94) (Dr)" },
]

const mainHeadRows: MainHeadRow[] = [
  { className: "Current Assets", groupName: "Current Assets", subGroupName: "Advance & Pre-Payments", opening: "2,467,250 (Dr)", debit: 448500, credit: 347430, closing: "2,748,320 (Dr)" },
  { className: "Current Assets", groupName: "Current Assets", subGroupName: "Inventory", opening: "37,272,161 (Dr)", debit: 0, credit: 0, closing: "37,272,161 (Dr)" },
  { className: "Current Assets", groupName: "Current Assets", subGroupName: "Other Receivables", opening: "3,271,407 (Dr)", debit: 808966, credit: 472500, closing: "3,687,873 (Dr)" },
  { className: "Current Assets", groupName: "Current Assets", subGroupName: "Inter Company Current Account", opening: "162,759,731 (Cr)", debit: 284078, credit: 1430694, closing: "(169,386,346.92) (Cr)" },
  { className: "Current Assets", groupName: "Current Assets", subGroupName: "Cash & Cash Equivalent", opening: "54,873 (Cr)", debit: 179931, credit: 152687, closing: "218,189 (Dr)" },
  { className: "Current Liabilities", groupName: "Current Liabilities", subGroupName: "Accounts Payable - Expenses", opening: "9,433,868 (Cr)", debit: 1010650, credit: 1174840, closing: "9,450,058 (Cr)" },
  { className: "Current Liabilities", groupName: "Current Liabilities", subGroupName: "Accounts Payable - Capital Expenditure", opening: "50,000 (Cr)", debit: 0, credit: 0, closing: "50,000 (Cr)" },
  { className: "Current Liabilities", groupName: "Current Liabilities", subGroupName: "Payable for Statutory", opening: "105,324 (Cr)", debit: 50967, credit: 810, closing: "55,167 (Cr)" },
  { className: "Direct Expenses", groupName: "Cost of Goods Sold", subGroupName: "Cost of Goods Manufactured", opening: "66,604 (Dr)", debit: 98359, credit: 0, closing: "164,963 (Dr)" },
  { className: "Indirect Expenses", groupName: "Operating Expenses", subGroupName: "Administrative Expenses", opening: "14,682,017 (Dr)", debit: 11926266, credit: 250000, closing: "15,872,143 (Dr)" },
  { className: "Indirect Expenses", groupName: "Operating Expenses", subGroupName: "Legal & Professional Expenses", opening: "76,050 (Dr)", debit: 0, credit: 0, closing: "76,050 (Dr)" },
  { className: "Indirect Expenses", groupName: "Operating Expenses", subGroupName: "Marketing, Selling, Distribution and Collection Expenses", opening: "538,736 (Dr)", debit: 123220, credit: 0, closing: "551,958 (Dr)" },
  { className: "Indirect Expenses", groupName: "Operating Expenses", subGroupName: "Depreciation & Amortization Expenses on Office Assets", opening: "1,060,626 (Dr)", debit: 0, credit: 0, closing: "1,060,626 (Dr)" },
  { className: "Indirect Expenses", groupName: "Non-Operating Expenses", subGroupName: "Non-Business Expenses", opening: "95,000 (Dr)", debit: 0, credit: 0, closing: "95,000 (Dr)" },
  { className: "Indirect Expenses", groupName: "Tax Expenses", subGroupName: "Income Tax Expenses", opening: "214,000 (Dr)", debit: 0, credit: 0, closing: "214,000 (Dr)" },
  { className: "Non Current Assets", groupName: "Non Current Assets", subGroupName: "Properties, Plant & Equipment", opening: "13,506,000 (Dr)", debit: 0, credit: 0, closing: "13,506,000 (Dr)" },
  { className: "Non Current Assets", groupName: "Non Current Assets", subGroupName: "Furniture, Fixtures & Fittings", opening: "8,195,863 (Dr)", debit: 0, credit: 0, closing: "8,195,863 (Dr)" },
  { className: "Non Current Assets", groupName: "Non Current Assets", subGroupName: "Accumulated Depreciations & Amortizations", opening: "11,858,087 (Cr)", debit: 0, credit: 0, closing: "(11,158,086.50) (Cr)" },
  { className: "Operating Income", groupName: "Operating Income", subGroupName: "Share Capital", opening: "10,000,000 (Cr)", debit: 0, credit: 0, closing: "10,000,000 (Cr)" },
  { className: "Shareholder Equity", groupName: "Shareholder Equity", subGroupName: "Profit and Loss AC", opening: "115,608,167 (Dr)", debit: 0, credit: 0, closing: "(115,608,166.94) (Dr)" },
  { className: "Shareholder Equity", groupName: "Shareholder Equity", subGroupName: "Surplus", opening: "417 (Dr)", debit: 0, credit: 0, closing: "(417.00) (Dr)" },
]

const glCodeRows: GlRow[] = [
  { className: "Current Assets", groupName: "Current Assets", subGroupName: "Inter Company Current Account", subSubGroupName: "Inter Company Current Account", accountHead: "Seashell Attire", glCode: "1101001", opening: "2,000 (Dr)", debit: 2000, credit: 0, closing: "4,000 (Dr)" },
  { className: "Current Assets", groupName: "Current Assets", subGroupName: "Cash & Cash Equivalent", subSubGroupName: "Cash Equivalents", accountHead: "Cheque in Hand (Petty Cash)", glCode: "1101002", opening: "0 (Dr)", debit: 630000, credit: 730000, closing: "(100,000.00) (Cr)" },
  { className: "Current Assets", groupName: "Current Assets", subGroupName: "Other Receivables", subSubGroupName: "IT Receivable", accountHead: "AR Cricton Web & Apps", glCode: "1101003", opening: "100,000 (Dr)", debit: 0, credit: 5250000, closing: "(5,200,000.00) (Cr)" },
  { className: "Current Assets", groupName: "Current Assets", subGroupName: "Inter Company Current Account", subSubGroupName: "Inter Company Current Account", accountHead: "Pakiza Knit Composite Ltd.-PKCL", glCode: "1101004", opening: "141,246,816 (Cr)", debit: 606662, credit: 18188929, closing: "(158,929,085.84) (Cr)" },
  { className: "Current Assets", groupName: "Current Assets", subGroupName: "Inventory", subSubGroupName: "General Item Stock", accountHead: "Printing, Stationaries & Office Supplies Stock", glCode: "1201002", opening: "11,113 (Dr)", debit: 11113, credit: 0, closing: "22,226 (Dr)" },
  { className: "Current Assets", groupName: "Current Assets", subGroupName: "Inventory", subSubGroupName: "Finished Goods & Raw Material Stock", accountHead: "Cricton ERP", glCode: "1201003", opening: "36,452,049 (Dr)", debit: 7678042, credit: 100000, closing: "44,129,091 (Dr)" },
  { className: "Current Liabilities", groupName: "Current Liabilities", subGroupName: "Accounts Payable - Expenses", subSubGroupName: "Payable for General Items", accountHead: "Stationary Bills Payable", glCode: "2102004", opening: "7,331 (Cr)", debit: 0, credit: 0, closing: "7,331 (Cr)" },
  { className: "Current Liabilities", groupName: "Current Liabilities", subGroupName: "Accounts Payable - Common", subSubGroupName: "Accounts Payable Common", accountHead: "Accounts Payable Common", glCode: "2103001", opening: "27,502 (Cr)", debit: 198805, credit: 236, closing: "64,793 (Cr)" },
  { className: "Indirect Expenses", groupName: "Operating Expenses", subGroupName: "Administrative Expenses", subSubGroupName: "Printing, Stationaries & Office Supplies Stock", accountHead: "Printing Supplies", glCode: "6101001", opening: "11,113 (Dr)", debit: 11113, credit: 0, closing: "22,226 (Dr)" },
  { className: "Indirect Expenses", groupName: "Operating Expenses", subGroupName: "Administrative Expenses", subSubGroupName: "Advance to Employee", accountHead: "Advance Against Vehicle Fuel", glCode: "6101003", opening: "12,431 (Dr)", debit: 412000, credit: 492310, closing: "(92,810.00) (Cr)" },
  { className: "Indirect Expenses", groupName: "Operating Expenses", subGroupName: "Administrative Expenses", subSubGroupName: "Advance to Employee", accountHead: "Salary Advance (Advance Against Salary)", glCode: "6101004", opening: "210,832 (Cr)", debit: 3840000, credit: 483833, closing: "(3,106,666.00) (Cr)" },
  { className: "Indirect Expenses", groupName: "Operating Expenses", subGroupName: "Administrative Expenses", subSubGroupName: "Inter Company Current Account", accountHead: "Finpaymart", glCode: "6101005", opening: "772,637 (Cr)", debit: 4100, credit: 117873, closing: "(1,942,410.00) (Cr)" },
  { className: "Indirect Expenses", groupName: "Operating Expenses", subGroupName: "Administrative Expenses", subSubGroupName: "Inter Company Current Account", accountHead: "Pakiza Apparels Ltd-PAL", glCode: "6101006", opening: "251,800 (Cr)", debit: 0, credit: 2555000, closing: "(5,606,850.00) (Cr)" },
  { className: "Indirect Expenses", groupName: "Operating Expenses", subGroupName: "Administrative Expenses", subSubGroupName: "Inter Company Current Account", accountHead: "Pakiza Technovation Ltd-PTVL", glCode: "6101007", opening: "18,454,676 (Cr)", debit: 8522108, credit: 21345859, closing: "(19,828,117.00) (Cr)" },
  { className: "Indirect Expenses", groupName: "Operating Expenses", subGroupName: "Administrative Expenses", subSubGroupName: "Other Receivables", accountHead: "AR Cricton ERP", glCode: "6101008", opening: "3,004,675 (Cr)", debit: 3372140, credit: 1415141, closing: "8,356,380 (Cr)" },
]

const reportTypes = ["GroupWise", "Main Head Wise", "GL Code Wise"]
const financialYears = ["2024-2025", "2025-2026", "2026-2027"]
const statuses = ["All", "Active", "Inactive"]

export default function TrialBalancePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [filters, setFilters] = useState({
    reportType: "GroupWise",
    financialYear: "2024-2025",
    from: "2025-12-01",
    to: "2026-06-30",
    status: "All",
    search: "",
  })

  const [showResults, setShowResults] = useState(false)

  const { rows, totals, showSubGroup, showSubSubGroup, showAccountHead } = useMemo(() => {
    const term = filters.search.toLowerCase()

    const baseRows =
      filters.reportType === "GL Code Wise"
        ? glCodeRows
        : filters.reportType === "Main Head Wise"
          ? mainHeadRows
          : groupWiseRows

    const filteredRows = baseRows.filter((row) => {
      const term = filters.search.toLowerCase()
      if (!term) return true

      if ("glCode" in row) {
        const r = row as GlRow
        return (
          r.className.toLowerCase().includes(term) ||
          r.groupName.toLowerCase().includes(term) ||
          r.subGroupName.toLowerCase().includes(term) ||
          r.subSubGroupName.toLowerCase().includes(term) ||
          r.accountHead.toLowerCase().includes(term) ||
          r.glCode.toLowerCase().includes(term)
        )
      }

      if ("subGroupName" in row) {
        const r = row as MainHeadRow
        return (
          r.className.toLowerCase().includes(term) ||
          r.groupName.toLowerCase().includes(term) ||
          r.subGroupName.toLowerCase().includes(term)
        )
      }

      return row.className.toLowerCase().includes(term) || row.groupName.toLowerCase().includes(term)
    })

    const totals = filteredRows.reduce(
      (acc, row) => {
        acc.debit += row.debit
        acc.credit += row.credit
        return acc
      },
      { debit: 0, credit: 0 },
    )

    return {
      rows: filteredRows,
      totals,
      showSubGroup: filters.reportType !== "GroupWise",
      showSubSubGroup: filters.reportType === "GL Code Wise",
      showAccountHead: filters.reportType === "GL Code Wise",
    }
  }, [filters.reportType, filters.search])

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} collapsed={sidebarCollapsed} onClose={() => setSidebarOpen(false)} onToggleCollapse={() => setSidebarCollapsed((p) => !p)} />
      <main className={`flex-1 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-[18rem]"}`}>
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border/40 bg-card/95 backdrop-blur-sm px-4 lg:px-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Reports</p>
              <h1 className="text-sm font-semibold text-foreground">Trial Balance</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => window.print()}>
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <Card className="border border-border/70 bg-white">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Report Type</Label>
                  <Select value={filters.reportType} onValueChange={(v) => setFilters((p) => ({ ...p, reportType: v }))}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((v) => (
                        <SelectItem key={v} value={v}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Financial Year</Label>
                  <Select value={filters.financialYear} onValueChange={(v) => setFilters((p) => ({ ...p, financialYear: v }))}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {financialYears.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Date From</Label>
                  <Input
                    type="date"
                    value={filters.from}
                    onChange={(e) => setFilters((p) => ({ ...p, from: e.target.value }))}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Date To</Label>
                  <Input
                    type="date"
                    value={filters.to}
                    onChange={(e) => setFilters((p) => ({ ...p, to: e.target.value }))}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-slate-600">Status</Label>
                  <Select value={filters.status} onValueChange={(v) => setFilters((p) => ({ ...p, status: v }))}>
                    <SelectTrigger className="h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" className="h-9 px-4 text-sm" onClick={() => setShowResults(true)}>Search</Button>
                <Button variant="outline" size="sm" className="h-9 px-4 text-sm">Print</Button>
                <div className="ml-auto relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={filters.search}
                    onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                    placeholder="Search..."
                    className="h-9 w-56 pl-8 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-white">
            <CardHeader className="pb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-sm">Trial Balance</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs">Excel</Button>
                <Button variant="outline" size="sm" className="h-8 text-xs">Print</Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {!showResults ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">Click search to load report</div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 text-left">Class Name</th>
                          <th className="px-3 py-2 text-left">Group Name</th>
                          {showSubGroup && <th className="px-3 py-2 text-left">Sub Group Name</th>}
                          {showSubSubGroup && <th className="px-3 py-2 text-left">Sub Sub Group Name</th>}
                          {showAccountHead && <th className="px-3 py-2 text-left">Account Head</th>}
                          {showAccountHead && <th className="px-3 py-2 text-left">GL Code</th>}
                          <th className="px-3 py-2 text-left">Opening</th>
                          <th className="px-3 py-2 text-right">Debit</th>
                          <th className="px-3 py-2 text-right">Credit</th>
                          <th className="px-3 py-2 text-left">Closing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, idx) => (
                          <tr key={("glCode" in row && row.glCode) || row.groupName + idx} className="border-t">
                            <td className="px-3 py-2 text-slate-700">{row.className}</td>
                            <td className="px-3 py-2 text-blue-700 font-semibold underline underline-offset-2">{row.groupName}</td>
                            {showSubGroup && (
                              <td className="px-3 py-2 text-blue-700 font-semibold underline underline-offset-2">
                                {"subGroupName" in row ? row.subGroupName : ""}
                              </td>
                            )}
                            {showSubSubGroup && (
                              <td className="px-3 py-2 text-slate-700">{(row as GlRow).subSubGroupName}</td>
                            )}
                            {showAccountHead && (
                              <>
                                <td className="px-3 py-2 text-blue-700 font-semibold underline underline-offset-2">
                                  {(row as GlRow).accountHead}
                                </td>
                                <td className="px-3 py-2 text-slate-700">{(row as GlRow).glCode}</td>
                              </>
                            )}
                            <td className="px-3 py-2 text-slate-700">{row.opening}</td>
                            <td className="px-3 py-2 text-right text-slate-900">{row.debit.toLocaleString()}</td>
                            <td className="px-3 py-2 text-right text-slate-900">{row.credit.toLocaleString()}</td>
                            <td className="px-3 py-2 text-slate-700">{row.closing}</td>
                          </tr>
                        ))}
                        {rows.length === 0 && (
                          <tr>
                            <td
                              colSpan={showAccountHead ? 10 : showSubSubGroup ? 8 : showSubGroup ? 7 : 6}
                              className="px-3 py-4 text-center text-slate-500"
                            >
                              No entries found
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-slate-50 text-slate-900 font-semibold">
                        <tr className="border-t">
                          <td
                            colSpan={
                              2 + // class, group
                              (showSubGroup ? 1 : 0) +
                              (showSubSubGroup ? 1 : 0) +
                              (showAccountHead ? 2 : 0) +
                              1 // opening
                            }
                            className="px-3 py-2 text-right"
                          >
                            Total:
                          </td>
                          <td className="px-3 py-2 text-right">{totals.debit.toLocaleString()}</td>
                          <td className="px-3 py-2 text-right">{totals.credit.toLocaleString()}</td>
                          <td />
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    <span>Showing {rows.length} entries</span>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">Previous</Button>
                      <span className="px-2">1</span>
                      <Button variant="outline" size="sm" className="h-7 px-2 text-[11px]">Next</Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
