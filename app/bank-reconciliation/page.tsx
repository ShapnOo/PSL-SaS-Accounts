"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Banknote, Calendar, CheckCircle2, ChevronDown, FileUp, Menu, RefreshCw, Search } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type RecoRow = {
  id: string
  ref: string
  date: string
  particulars: string
  cheque?: string
  amount: number
  status: "pending" | "cleared"
  type: "debit" | "credit"
}

const formatCurrency = (value: number) => `BDT ${value.toLocaleString("en-US", { minimumFractionDigits: 0 })}`

const initialAdds: RecoRow[] = [
  { id: "add-1", ref: "RCV-1024", date: "2025-01-06", particulars: "POS collections (weekend)", amount: 185000, status: "pending", type: "credit" },
  { id: "add-2", ref: "RCV-1041", date: "2025-01-08", particulars: "Customer deposit - INV-4431", amount: 92000, status: "pending", type: "credit" },
  { id: "add-3", ref: "RCV-1050", date: "2025-01-10", particulars: "Inter-branch transfer", amount: 64000, status: "cleared", type: "credit" },
]

const initialLess: RecoRow[] = [
  { id: "less-1", ref: "CHQ-8801", date: "2025-01-05", particulars: "Supplier: Horizon Textiles", cheque: "554322", amount: 78000, status: "pending", type: "debit" },
  { id: "less-2", ref: "CHQ-8802", date: "2025-01-07", particulars: "Rent - Corporate office", cheque: "998210", amount: 120000, status: "pending", type: "debit" },
  { id: "less-3", ref: "CHQ-8814", date: "2025-01-09", particulars: "Logistics partner fees", cheque: "781244", amount: 46000, status: "cleared", type: "debit" },
]

const initialBookAdds: RecoRow[] = [
  { id: "book-add-1", ref: "ADJ-3001", date: "2025-01-04", particulars: "Bank interest earned", amount: 9500, status: "pending", type: "credit" },
  { id: "book-add-2", ref: "ADJ-3004", date: "2025-01-09", particulars: "FX gain adjustment", amount: 4200, status: "pending", type: "credit" },
]

const initialBookLess: RecoRow[] = [
  { id: "book-less-1", ref: "CHG-1201", date: "2025-01-03", particulars: "Bank charges", amount: 1850, status: "cleared", type: "debit" },
  { id: "book-less-2", ref: "CHG-1202", date: "2025-01-11", particulars: "Cheque return fee", amount: 2200, status: "pending", type: "debit" },
]

const glOptions = [
  { code: "1010-0001", label: "City Bank Current Account" },
  { code: "1010-0002", label: "Brac Bank Current Account" },
  { code: "1010-0003", label: "DBBL Operating Account" },
  { code: "1010-0101", label: "Cash in Transit" },
  { code: "2010-0001", label: "Bank Charges" },
] as const

export default function BankReconciliationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [bankAdds, setBankAdds] = useState<RecoRow[]>([])
  const [bankLess, setBankLess] = useState<RecoRow[]>([])
  const [bookAdds, setBookAdds] = useState<RecoRow[]>([])
  const [bookLess, setBookLess] = useState<RecoRow[]>([])

  const [filters, setFilters] = useState({
    account: "City Bank - 110029993",
    statementDate: "2025-01-15",
    valueDate: "2025-01-15",
    search: "",
    glCode: "",
  })
  const accountOptions = [
    { value: "City Bank - 110029993", label: "City Bank - 110029993", description: "Primary operating account" },
    { value: "Brac Bank - 220145678", label: "Brac Bank - 220145678", description: "Payroll and vendor settlements" },
    { value: "DBBL - 901122334", label: "DBBL - 901122334", description: "Online collections" },
  ]

  const statementBalance = 2145000
  const ledgerBalance = 2091000

  const totals = useMemo(() => {
    const addSum = bankAdds.reduce((sum, row) => sum + row.amount, 0)
    const lessSum = bankLess.reduce((sum, row) => sum + row.amount, 0)
    const bookAddSum = bookAdds.reduce((sum, row) => sum + row.amount, 0)
    const bookLessSum = bookLess.reduce((sum, row) => sum + row.amount, 0)
    const adjustedBank = statementBalance + addSum - lessSum
    const adjustedBook = ledgerBalance + bookAddSum - bookLessSum
    const difference = adjustedBank - adjustedBook
    return { addSum, lessSum, bookAddSum, bookLessSum, adjustedBank, adjustedBook, difference }
  }, [bankAdds, bankLess, bookAdds, bookLess])

  const loadRecords = () => {
    setBankAdds(initialAdds)
    setBankLess(initialLess)
    setBookAdds(initialBookAdds)
    setBookLess(initialBookLess)
    setFilters((prev) => ({
      ...prev,
      glCode: glOptions[0].code,
    }))
  }

  const toggleById = (id: string) => {
    if (bankAdds.some((r) => r.id === id)) return setBankAdds((list) => list.map((row) => (row.id === id ? { ...row, status: row.status === "cleared" ? "pending" : "cleared" } : row)))
    if (bankLess.some((r) => r.id === id)) return setBankLess((list) => list.map((row) => (row.id === id ? { ...row, status: row.status === "cleared" ? "pending" : "cleared" } : row)))
    if (bookAdds.some((r) => r.id === id)) return setBookAdds((list) => list.map((row) => (row.id === id ? { ...row, status: row.status === "cleared" ? "pending" : "cleared" } : row)))
    if (bookLess.some((r) => r.id === id)) return setBookLess((list) => list.map((row) => (row.id === id ? { ...row, status: row.status === "cleared" ? "pending" : "cleared" } : row)))
  }

  const filtered = useMemo(() => {
    if (!filters.search.trim()) {
      return { bankAdds, bankLess, bookAdds, bookLess }
    }
    const term = filters.search.toLowerCase()
    const matches = (row: RecoRow) =>
      row.ref.toLowerCase().includes(term) ||
      row.particulars.toLowerCase().includes(term) ||
      (row.cheque ?? "").toLowerCase().includes(term)
    return {
      bankAdds: bankAdds.filter(matches),
      bankLess: bankLess.filter(matches),
      bookAdds: bookAdds.filter(matches),
      bookLess: bookLess.filter(matches),
    }
  }, [bankAdds, bankLess, bookAdds, bookLess, filters.search])

  const combinedRows = useMemo(() => {
    const annotate = (rows: RecoRow[], bucket: string) => rows.map((row) => ({ ...row, bucket }))
    return [
      ...annotate(filtered.bankAdds, "Add: Amount received but not yet credited by bank"),
      ...annotate(filtered.bankLess, "Less: Un-presented cheques"),
      ...annotate(filtered.bookAdds, "Add: Book-side receipts not posted"),
      ...annotate(filtered.bookLess, "Less: Book-side charges/payments"),
    ]
  }, [filtered])

  const SearchableSelect = ({
    label,
    value,
    options,
    placeholder,
    onSelect,
  }: {
    label: string
    value: string
    options: { value: string; label: string; description?: string }[]
    placeholder?: string
    onSelect: (val: string) => void
  }) => {
    const [open, setOpen] = useState(false)
    const [query, setQuery] = useState("")
    const filteredOptions = options.filter(
      (opt) => opt.label.toLowerCase().includes(query.toLowerCase()) || opt.value.toLowerCase().includes(query.toLowerCase()),
    )
    return (
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{label}</p>
        <div className="relative">
          <Input
            placeholder={placeholder ?? "Search"}
            className="h-10 pl-3 pr-8 text-sm"
            value={query || value}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 120)}
          />
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          {open && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
              {filteredOptions.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                    value === opt.value ? "bg-emerald-50 font-semibold text-emerald-700" : "text-slate-800"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    onSelect(opt.value)
                    setQuery(opt.value)
                    setOpen(false)
                  }}
                >
                  <span>{opt.label}</span>
                  {opt.description ? <span className="text-[12px] text-slate-500">{opt.description}</span> : null}
                </button>
              ))}
              {filteredOptions.length === 0 && (
                <div className="px-3 py-2 text-sm text-slate-500">No matches</div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const toggleStatus = (list: RecoRow[], setter: (rows: RecoRow[]) => void, id: string) => {
    setter(
      list.map((row) => (row.id === id ? { ...row, status: row.status === "cleared" ? "pending" : "cleared" } : row)),
    )
  }

  const SectionTable = ({
    title,
    rows,
    onToggle,
    showCheque = false,
  }: {
    title: string
    rows: (RecoRow & { bucket: string })[]
    onToggle: (id: string) => void
    showCheque?: boolean
  }) => (
    <Card className="border border-border/60 bg-white/95 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-slate-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-2 text-left">Bucket</th>
                <th className="px-3 py-2 text-left">Ref</th>
                <th className="px-3 py-2 text-left">Date</th>
                <th className="px-3 py-2 text-left">Particulars</th>
                {showCheque && <th className="px-3 py-2 text-left">Cheque</th>}
                <th className="px-3 py-2 text-right">Debit</th>
                <th className="px-3 py-2 text-right">Credit</th>
                <th className="px-3 py-2 text-center">Cleared</th>
                <th className="px-3 py-2 text-center">GL Entry</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr className="border-t border-slate-100">
                  <td colSpan={showCheque ? 9 : 8} className="px-3 py-3 text-center text-slate-500">
                    No records yet. Click Load records to populate demo data.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-700">{row.bucket}</td>
                    <td className="px-3 py-2 font-semibold text-slate-900">{row.ref}</td>
                    <td className="px-3 py-2 text-slate-700">{row.date}</td>
                    <td className="px-3 py-2 text-slate-700">{row.particulars}</td>
                    {showCheque && <td className="px-3 py-2 text-slate-700">{row.cheque ?? "-"}</td>}
                    <td className="px-3 py-2 text-right font-semibold text-amber-700">
                      {row.type === "debit" ? formatCurrency(row.amount) : "-"}
                    </td>
                    <td className="px-3 py-2 text-right font-semibold text-emerald-700">
                      {row.type === "credit" ? formatCurrency(row.amount) : "-"}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Checkbox
                          checked={row.status === "cleared"}
                          onCheckedChange={() => onToggle(row.id)}
                          className="h-4 w-4 border-slate-300 data-[state=checked]:bg-emerald-500"
                        />
                        <Badge variant={row.status === "cleared" ? "outline" : "secondary"} className="text-[11px]">
                          {row.status === "cleared" ? "Cleared" : "Pending"}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <Link
                        href={`/new-voucher?ref=${encodeURIComponent(row.ref)}`}
                        target="_blank"
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 underline-offset-2 hover:underline"
                      >
                        Edit entry
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-slate-50 text-slate-900">
              <tr>
                <td colSpan={showCheque ? 5 : 4} className="px-3 py-2 text-right font-semibold">
                  Total
                </td>
                <td className="px-3 py-2 text-right font-semibold text-amber-700">
                  {formatCurrency(rows.filter((r) => r.type === "debit").reduce((sum, r) => sum + r.amount, 0))}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-emerald-700">
                  {formatCurrency(rows.filter((r) => r.type === "credit").reduce((sum, r) => sum + r.amount, 0))}
                </td>
                <td />
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  )

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
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Bank reconciliation</p>
              <h1 className="text-sm font-semibold text-foreground">Statement vs Ledger</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={loadRecords}>
              <RefreshCw className="h-3.5 w-3.5" />
              Load records
            </Button>
            <Button size="sm" className="gap-2">
              <FileUp className="h-3.5 w-3.5" />
              Import bank file
            </Button>
          </div>
        </header>

        <section className="p-3.5 lg:p-4 space-y-4">
          <Card className="border border-border/70 bg-white/95 shadow-sm">
            <CardContent className="p-4">
              <div className="grid gap-3 md:grid-cols-5 lg:grid-cols-6">
                <SearchableSelect
                  label="Bank account"
                  value={filters.account}
                  options={accountOptions}
                  placeholder="Search bank account"
                  onSelect={(val) => setFilters({ ...filters, account: val })}
                />
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Statement date</p>
                  <div className="relative">
                    <Input
                      type="date"
                      value={filters.statementDate}
                      onChange={(e) => setFilters({ ...filters, statementDate: e.target.value })}
                      className="h-10 text-sm pr-9"
                    />
                    <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Value date</p>
                  <div className="relative">
                    <Input
                      type="date"
                      value={filters.valueDate}
                      onChange={(e) => setFilters({ ...filters, valueDate: e.target.value })}
                      className="h-10 text-sm pr-9"
                    />
                    <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>
                <div className="space-y-1">
                  <SearchableSelect
                    label="GL code"
                    value={filters.glCode}
                    options={glOptions.map((g) => ({ value: g.code, label: g.code, description: g.label }))}
                    placeholder="Search GL code"
                    onSelect={(val) => setFilters({ ...filters, glCode: val })}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Search</p>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Ref / particulars / cheque"
                      className="h-10 pl-9 text-sm"
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Card className="border border-border/60 bg-white/95 shadow-sm">
              <CardContent className="flex items-center justify-between gap-3 p-3.5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Bank statement</p>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(statementBalance)}</p>
                  <p className="text-[11px] text-slate-500">As of {filters.statementDate}</p>
                </div>
                <Banknote className="h-8 w-8 text-emerald-500" />
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-white/95 shadow-sm">
              <CardContent className="flex items-center justify-between gap-3 p-3.5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Ledger balance</p>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(ledgerBalance)}</p>
                  <p className="text-[11px] text-slate-500">Trial balance</p>
                </div>
                <Banknote className="h-8 w-8 text-blue-500" />
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-white/95 shadow-sm">
              <CardContent className="flex items-center justify-between gap-3 p-3.5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Adjusted bank</p>
                  <p className="text-lg font-bold text-slate-900">{formatCurrency(totals.adjustedBank)}</p>
                  <p className="text-[11px] text-slate-500">Bank + adds - less</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-indigo-500" />
              </CardContent>
            </Card>
            <Card className="border border-border/60 bg-white/95 shadow-sm">
              <CardContent className="flex items-center justify-between gap-3 p-3.5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Difference</p>
                  <p className={`text-lg font-bold ${totals.difference === 0 ? "text-emerald-600" : "text-amber-600"}`}>
                    {formatCurrency(totals.difference)}
                  </p>
                  <p className="text-[11px] text-slate-500">Target: 0 to reconcile</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </CardContent>
            </Card>
          </div>

          <Card className="border border-border/70 bg-white/95 shadow-sm">
            <CardContent className="flex flex-wrap gap-4 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Account</span>
                <span className="font-semibold text-slate-900">{filters.account}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">GL</span>
                <span className="font-semibold text-slate-900">{filters.glCode || "Not selected"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Statement date</span>
                <span className="font-semibold text-slate-900">{filters.statementDate}</span>
              </div>
            </CardContent>
          </Card>

          <SectionTable title="Reconciliation items" rows={combinedRows} onToggle={toggleById} showCheque />

          <Card className="border border-border/70 bg-white/95 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">Reconciliation summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Bank adds</p>
                <p className="text-lg font-semibold text-slate-900">{formatCurrency(totals.addSum)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Bank deductions</p>
                <p className="text-lg font-semibold text-slate-900">{formatCurrency(totals.lessSum)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Book adds</p>
                <p className="text-lg font-semibold text-slate-900">{formatCurrency(totals.bookAddSum)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-slate-500">Book deductions</p>
                <p className="text-lg font-semibold text-slate-900">{formatCurrency(totals.bookLessSum)}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-white/95 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">Finalize</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2">
              <Button size="sm" className="h-10 px-4">
                Save reconciliation
              </Button>
              <Button size="sm" variant="outline" className="h-10 px-4">
                Export PDF
              </Button>
              <Button size="sm" variant="outline" className="h-10 px-4">
                New session
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}
