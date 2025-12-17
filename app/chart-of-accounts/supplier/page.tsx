"use client"

import { useState, type FormEvent } from "react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Plus, Search, X } from "lucide-react"

type Supplier = {
  id: number
  name: string
  shortName: string
  contactPerson: string
  address: string
  contactNo: string
  supplierType: string
  brand: string
  sortOrder: string
}

type SupplierForm = Omit<Supplier, "id">

const seedSuppliers: Supplier[] = [
  {
    id: 1,
    name: "M.B. Trade Corporation",
    shortName: "MB Trade",
    contactPerson: "Demo Person",
    address: "House 57 (1st floor), Road 14, Sector 13, Uttara, Dhaka 1230",
    contactNo: "+880258952974 / 09611464646",
    supplierType: "Local",
    brand: "General",
    sortOrder: "1",
  },
  {
    id: 2,
    name: "Madona Enterprise",
    shortName: "Madona",
    contactPerson: "Customer Care",
    address: "Hasan Holding 52/1, New Eskaton Road, Dhaka",
    contactNo: "+880-2-48322470",
    supplierType: "Retail",
    brand: "Electronics",
    sortOrder: "2",
  },
  {
    id: 3,
    name: "Mayer Doya Enterprise",
    shortName: "Mayer Doya",
    contactPerson: "Hadis",
    address: "37/ko, Rayer Bazar, Mohammadpur, Dhaka",
    contactNo: "01677757465",
    supplierType: "Raw Material",
    brand: "Leather",
    sortOrder: "3",
  },
  {
    id: 4,
    name: "Ohyoung INS",
    shortName: "Ohyoung",
    contactPerson: "Accounts",
    address: "Zirabo, Ashulia, Savar, Dhaka",
    contactNo: "+88027911766",
    supplierType: "Import",
    brand: "Industrial",
    sortOrder: "4",
  },
  {
    id: 5,
    name: "Silver Apparels Ltd.",
    shortName: "Silver",
    contactPerson: "Merchandising",
    address: "Holding-57, Road 01, Ashulia, Savar, Dhaka",
    contactNo: "01799-527248",
    supplierType: "Garments",
    brand: "Apparel",
    sortOrder: "5",
  },
  {
    id: 6,
    name: "Ma Motors",
    shortName: "Ma Motors",
    contactPerson: "Sales",
    address: "Jelkhan Road, Notun Bazar, Konabari, Gazipur",
    contactNo: "01957-672981",
    supplierType: "Automotive",
    brand: "Parts",
    sortOrder: "6",
  },
  {
    id: 7,
    name: "1 to 100 Plus Market",
    shortName: "1 to 100",
    contactPerson: "Store Manager",
    address: "32/18 Tajmahol Road, Block C, Mohammadpur",
    contactNo: "01740615989",
    supplierType: "Retail",
    brand: "General",
    sortOrder: "7",
  },
  {
    id: 8,
    name: "3NS Technology BD",
    shortName: "3NS Tech",
    contactPerson: "Support",
    address: "Mohammadpur, Dhaka",
    contactNo: "01715-812128",
    supplierType: "Electronics",
    brand: "IT",
    sortOrder: "8",
  },
]

const emptyForm: SupplierForm = {
  name: "",
  shortName: "",
  contactPerson: "",
  address: "",
  contactNo: "",
  supplierType: "",
  brand: "",
  sortOrder: "",
}

export default function SupplierPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const [search, setSearch] = useState("")
  const [suppliers, setSuppliers] = useState<Supplier[]>(seedSuppliers)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState<SupplierForm>(emptyForm)
  const [editingId, setEditingId] = useState<number | null>(null)

  const filteredSuppliers = suppliers.filter((supplier) => {
    if (!search.trim()) return true
    const term = search.trim().toLowerCase()
    return [supplier.name, supplier.shortName, supplier.contactPerson, supplier.brand, supplier.supplierType, supplier.contactNo]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(term))
  })

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    resetForm()
  }

  const openCreate = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEdit = (supplier: Supplier) => {
    const { id, ...rest } = supplier
    setEditingId(id)
    setForm(rest)
    setIsModalOpen(true)
  }

  const handleSubmit = (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    if (!form.name.trim() || !form.contactPerson.trim() || !form.address.trim()) {
      return
    }

    if (editingId) {
      setSuppliers((prev) => prev.map((supplier) => (supplier.id === editingId ? { ...supplier, ...form } : supplier)))
    } else {
      const nextId = Math.max(0, ...suppliers.map((s) => s.id)) + 1
      setSuppliers((prev) => [...prev, { id: nextId, ...form }])
    }

    closeModal()
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
              <h1 className="text-sm font-semibold text-foreground">Supplier</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-8 pr-3 text-sm"
              />
            </div>
            <Button className="gap-2" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>
        </header>

        <div className="p-4 lg:p-6">
          <div className="overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">Name</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">Short</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">Contact Person</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">Address</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">Contact No</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">Type</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">Brand</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-left">Sort</th>
                  <th className="border-b border-slate-200 px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.map((supplier, idx) => (
                  <tr key={supplier.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="px-3 py-2 font-semibold text-foreground">{supplier.name}</td>
                    <td className="px-3 py-2 text-muted-foreground">{supplier.shortName || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{supplier.contactPerson || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{supplier.address || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{supplier.contactNo || "—"}</td>
                    <td className="px-3 py-2">
                      {supplier.supplierType ? (
                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
                          {supplier.supplierType}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{supplier.brand || "—"}</td>
                    <td className="px-3 py-2 text-muted-foreground">{supplier.sortOrder || "—"}</td>
                    <td className="px-3 py-2 text-right">
                      <button
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                        onClick={() => openEdit(supplier)}
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredSuppliers.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-3 py-6 text-center text-sm text-muted-foreground">
                      No suppliers found
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
                <p className="text-sm font-semibold text-foreground">
                  {editingId ? "Update Supplier Information" : "Create Supplier Information"}
                </p>
                <p className="text-xs text-muted-foreground">Add or edit supplier details</p>
              </div>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-xs font-semibold text-foreground">
                    Supplier Name <span className="text-amber-500">*</span>
                  </p>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. M.B. Trade Corporation"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">Short Name</p>
                  <Input
                    value={form.shortName}
                    onChange={(e) => setForm((prev) => ({ ...prev, shortName: e.target.value }))}
                    placeholder="Short label"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">
                    Contact Person <span className="text-amber-500">*</span>
                  </p>
                  <Input
                    value={form.contactPerson}
                    onChange={(e) => setForm((prev) => ({ ...prev, contactPerson: e.target.value }))}
                    placeholder="Name to contact"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-xs font-semibold text-foreground">
                    Address <span className="text-amber-500">*</span>
                  </p>
                  <Input
                    value={form.address}
                    onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                    placeholder="Street address"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">Contact No</p>
                  <Input
                    value={form.contactNo}
                    onChange={(e) => setForm((prev) => ({ ...prev, contactNo: e.target.value }))}
                    placeholder="+8801..."
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">Supplier Type</p>
                  <Input
                    value={form.supplierType}
                    onChange={(e) => setForm((prev) => ({ ...prev, supplierType: e.target.value }))}
                    placeholder="e.g. Local, Import"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">Brand</p>
                  <Input
                    value={form.brand}
                    onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
                    placeholder="Brand name"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-foreground">Sort Order</p>
                  <Input
                    value={form.sortOrder}
                    onChange={(e) => setForm((prev) => ({ ...prev, sortOrder: e.target.value }))}
                    placeholder="Display order"
                    type="number"
                    min={0}
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Close
                </Button>
                <Button type="submit" className="bg-slate-900 text-white hover:bg-slate-800">
                  {editingId ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
