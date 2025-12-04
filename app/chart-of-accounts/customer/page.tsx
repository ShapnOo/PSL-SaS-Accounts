"use client"

import { useState } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Plus, Search, X } from "lucide-react"

type Customer = {
  id: number
  name: string
  address: string
  phone: string
  vatNo: string
}

const seedCustomers: Customer[] = [
  { id: 1, name: "Bengal Root", address: "", phone: "", vatNo: "" },
  { id: 2, name: "Best Electronics Limited", address: "", phone: "", vatNo: "" },
  { id: 3, name: "Dica Tex Limited", address: "", phone: "", vatNo: "" },
  { id: 4, name: "Edison Footwear Limited", address: "", phone: "", vatNo: "" },
  { id: 5, name: "Edison Real Estate Limited", address: "", phone: "", vatNo: "" },
  { id: 6, name: "Fakir Knitwears Limited", address: "", phone: "", vatNo: "" },
  { id: 7, name: "Scalpers Ladies", address: "", phone: "", vatNo: "" },
  { id: 8, name: "Fortis Garments Limited", address: "", phone: "", vatNo: "" },
  { id: 9, name: "Habitus Fashion Limited", address: "", phone: "", vatNo: "" },
  { id: 10, name: "KA Design Limited", address: "", phone: "", vatNo: "" },
]

export default function CustomerPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [search, setSearch] = useState("")
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    vatNo: "",
    tinNo: "",
    registrationNo: "",
    crmClient: "",
  })

  const filtered = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))

  const handleCreate = () => {
    if (!form.name.trim()) return
    const nextId = Math.max(0, ...customers.map((c) => c.id)) + 1
    setCustomers((prev) => [
      ...prev,
      { id: nextId, name: form.name.trim(), address: form.address, phone: form.phone, vatNo: form.vatNo },
    ])
    setIsModalOpen(false)
    setForm({ name: "", address: "", phone: "", vatNo: "", tinNo: "", registrationNo: "", crmClient: "" })
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
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border/40 bg-card/95 backdrop-blur-sm px-4 lg:px-5">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
              <Plus className="h-5 w-5 rotate-45" />
            </Button>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Chart of Accounts</p>
              <h1 className="text-sm font-semibold text-foreground">Customer</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8 pr-3 text-sm"
              />
            </div>
            <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-slate-200 text-sm shadow-sm">
              <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  <th className="border border-slate-200 px-3 py-2 text-left">Action</th>
                  <th className="border border-slate-200 px-3 py-2 text-left">Name</th>
                  <th className="border border-slate-200 px-3 py-2 text-left">Address</th>
                  <th className="border border-slate-200 px-3 py-2 text-left">Phone</th>
                  <th className="border border-slate-200 px-3 py-2 text-left">VatNo</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer, idx) => (
                  <tr key={customer.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="border border-slate-200 px-3 py-2">
                      <button className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50 inline-flex items-center gap-1">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                    </td>
                    <td className="border border-slate-200 px-3 py-2 font-semibold text-foreground">{customer.name}</td>
                    <td className="border border-slate-200 px-3 py-2 text-muted-foreground">{customer.address || "—"}</td>
                    <td className="border border-slate-200 px-3 py-2 text-muted-foreground">{customer.phone || "—"}</td>
                    <td className="border border-slate-200 px-3 py-2 text-muted-foreground">{customer.vatNo || "—"}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="border border-slate-200 px-3 py-6 text-center text-sm text-muted-foreground">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl ring-1 ring-black/5">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Create Customer Information</p>
                <p className="text-xs text-muted-foreground">Add new customer details</p>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setIsModalOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs font-semibold text-foreground">
                  Name <span className="text-amber-500">*</span>
                </p>
                <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs font-semibold text-foreground">Address</p>
                <Input value={form.address} onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">Phone</p>
                <Input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">Vat No</p>
                <Input value={form.vatNo} onChange={(e) => setForm((prev) => ({ ...prev, vatNo: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">Tin No</p>
                <Input value={form.tinNo} onChange={(e) => setForm((prev) => ({ ...prev, tinNo: e.target.value }))} />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">Registration No</p>
                <Input
                  value={form.registrationNo}
                  onChange={(e) => setForm((prev) => ({ ...prev, registrationNo: e.target.value }))}
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <p className="text-xs font-semibold text-foreground">CRM Client</p>
                <select
                  className="h-10 w-full rounded-md border border-border/80 bg-white px-3 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
                  value={form.crmClient}
                  onChange={(e) => setForm((prev) => ({ ...prev, crmClient: e.target.value }))}
                >
                  <option value="">Select Client</option>
                  <option value="Client A">Client A</option>
                  <option value="Client B">Client B</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
              <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button className="bg-slate-900 text-white hover:bg-slate-800" onClick={handleCreate}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
