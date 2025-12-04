"use client"

import { useMemo, useState } from "react"
import { Menu, Package } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Item = {
  id: number
  sku: string
  name: string
  category: string
  warehouse: string
  unitCost: number
  qtyOnHand: number
  reorderLevel: number
  status: "Active" | "Inactive"
}

const accent = "#1B254D"

const seedItems: Item[] = [
  { id: 1, sku: "SKU-1001", name: "Leather Upper - Brown", category: "Materials", warehouse: "Dhaka Main", unitCost: 3.2, qtyOnHand: 1200, reorderLevel: 300, status: "Active" },
  { id: 2, sku: "SKU-1002", name: "Foam Insole", category: "Materials", warehouse: "Dhaka Main", unitCost: 1.1, qtyOnHand: 850, reorderLevel: 200, status: "Active" },
  { id: 3, sku: "SKU-2001", name: "Finished Shoe Model A", category: "Finished Goods", warehouse: "Warehouse A", unitCost: 18.5, qtyOnHand: 430, reorderLevel: 150, status: "Active" },
  { id: 4, sku: "SKU-3001", name: "Shipping Box - Medium", category: "Packaging", warehouse: "Warehouse B", unitCost: 0.35, qtyOnHand: 2600, reorderLevel: 800, status: "Active" },
  { id: 5, sku: "SKU-4001", name: "Retail Display Stand", category: "Accessories", warehouse: "Warehouse B", unitCost: 12.0, qtyOnHand: 45, reorderLevel: 20, status: "Inactive" },
]

export default function InventoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [items, setItems] = useState<Item[]>(seedItems)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<Item["status"] | "All">("All")
  const [categoryFilter, setCategoryFilter] = useState<string>("All")
  const [warehouseFilter, setWarehouseFilter] = useState<string>("All")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<Omit<Item, "id">>({
    sku: "",
    name: "",
    category: "",
    warehouse: "",
    unitCost: 0,
    qtyOnHand: 0,
    reorderLevel: 0,
    status: "Active",
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  const filtered = useMemo(
    () =>
      items.filter((itm) => {
        const matchesSearch = `${itm.sku} ${itm.name} ${itm.category}`.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === "All" || itm.status === statusFilter
        const matchesCategory = categoryFilter === "All" || itm.category === categoryFilter
        const matchesWarehouse = warehouseFilter === "All" || itm.warehouse === warehouseFilter
        return matchesSearch && matchesStatus && matchesCategory && matchesWarehouse
      }),
    [items, search, statusFilter, categoryFilter, warehouseFilter],
  )

  const handleSave = () => {
    if (!form.sku || !form.name || !form.category) return
    if (editingId) {
      setItems((prev) => prev.map((i) => (i.id === editingId ? { ...i, ...form } : i)))
    } else {
      const next: Item = {
        id: items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1,
        ...form,
      }
      setItems((prev) => [next, ...prev])
    }
    setEditingId(null)
    setDialogOpen(false)
    setForm({ sku: "", name: "", category: "", warehouse: "", unitCost: 0, qtyOnHand: 0, reorderLevel: 0, status: "Active" })
  }

  const statusBadge = (status: Item["status"]) => {
    const map: Record<Item["status"], string> = {
      Active: "bg-emerald-50 text-emerald-700",
      Inactive: "bg-slate-100 text-slate-700",
    }
    return <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${map[status]}`}>{status}</span>
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
            <button className="lg:hidden h-8 w-8" onClick={() => setSidebarOpen(true)}>
              <Menu className="mx-auto" size={18} />
            </button>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Inventory</p>
              <h1 className="text-sm font-semibold text-foreground">Items</h1>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search SKU or item..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-64 text-[11px]"
            />
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="h-9 w-40 text-[11px]">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v)}>
              <SelectTrigger className="h-9 w-44 text-[11px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {[...new Set(items.map((i) => i.category))].map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={warehouseFilter} onValueChange={(v) => setWarehouseFilter(v)}>
              <SelectTrigger className="h-9 w-44 text-[11px]">
                <SelectValue placeholder="Warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Warehouses</SelectItem>
                {[...new Set(items.map((i) => i.warehouse))].map((wh) => (
                  <SelectItem key={wh} value={wh}>
                    {wh}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              style={{ backgroundColor: accent }}
              className="h-9 rounded-md px-4 text-[11px] text-white shadow-sm hover:brightness-110"
              onClick={() => setDialogOpen(true)}
            >
              Add Item
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-[11px]">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                <tr>
                  <th className="px-3 py-2 text-left">SKU</th>
                  <th className="px-3 py-2 text-left">Item</th>
                  <th className="px-3 py-2 text-left">Category</th>
                  <th className="px-3 py-2 text-left">Warehouse</th>
                  <th className="px-3 py-2 text-left">On Hand</th>
                  <th className="px-3 py-2 text-left">Reorder Level</th>
                  <th className="px-3 py-2 text-left">Unit Cost</th>
                  <th className="px-3 py-2 text-left">Stock Value</th>
                  <th className="px-3 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((itm, idx) => (
                  <tr key={itm.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="px-3 py-2 text-slate-900">{itm.sku}</td>
                    <td className="px-3 py-2 text-slate-900">{itm.name}</td>
                    <td className="px-3 py-2 text-slate-900">{itm.category}</td>
                    <td className="px-3 py-2 text-slate-900">{itm.warehouse}</td>
                    <td className="px-3 py-2 text-slate-900">{itm.qtyOnHand}</td>
                    <td className="px-3 py-2 text-slate-900">
                      {itm.reorderLevel}{" "}
                      {itm.qtyOnHand <= itm.reorderLevel ? (
                        <span className="ml-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700">Low</span>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-slate-900">${itm.unitCost.toFixed(2)}</td>
                    <td className="px-3 py-2 text-slate-900">${(itm.unitCost * itm.qtyOnHand).toFixed(2)}</td>
                    <td className="px-3 py-2">{statusBadge(itm.status)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-sm text-slate-500">
                      No inventory items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle style={{ color: accent }}>{editingId ? "Edit Item" : "Add Item"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">SKU *</Label>
                <Input
                  value={form.sku}
                  onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                  className="h-9 text-[11px]"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Item Name *</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="h-9 text-[11px]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Category *</Label>
                <Input
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                  className="h-9 text-[11px]"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Warehouse *</Label>
                <Input
                  value={form.warehouse}
                  onChange={(e) => setForm((p) => ({ ...p, warehouse: e.target.value }))}
                  className="h-9 text-[11px]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Unit Cost</Label>
                <Input
                  type="number"
                  value={form.unitCost || ""}
                  onChange={(e) => setForm((p) => ({ ...p, unitCost: Number(e.target.value) || 0 }))}
                  className="h-9 text-[11px]"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v as Item["status"] }))}>
                  <SelectTrigger className="h-9 text-[11px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-600">Qty On Hand</Label>
                <Input
                  type="number"
                  value={form.qtyOnHand || ""}
                  onChange={(e) => setForm((p) => ({ ...p, qtyOnHand: Number(e.target.value) || 0 }))}
                  className="h-9 text-[11px]"
                />
              </div>
              <div>
                <Label className="text-xs text-slate-600">Reorder Level</Label>
                <Input
                  type="number"
                  value={form.reorderLevel || ""}
                  onChange={(e) => setForm((p) => ({ ...p, reorderLevel: Number(e.target.value) || 0 }))}
                  className="h-9 text-[11px]"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="text-[11px]" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button style={{ backgroundColor: accent }} className="text-white text-[11px]" onClick={handleSave}>
              Save Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
