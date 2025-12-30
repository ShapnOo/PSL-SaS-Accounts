"use client"

import { useState } from "react"
import { ToggleLeft, ToggleRight, Menu, ChevronRight, ChevronDown, Plus, Edit3 } from "lucide-react"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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

type TreeNodeItem = {
  id: string
  title: string
  manualCode: string
  status: Status
  code: string
  type: "class" | "group" | "subGroup" | "control" | "gl"
  classId?: string
  groupId?: string
  subGroupId?: string
  controlId?: string
  children?: TreeNodeItem[]
}

const initialClasses: ClassItem[] = [
  { id: "cls-1", title: "Assets", manualCode: "1000", status: "Active" },
  { id: "cls-2", title: "Liabilities", manualCode: "2000", status: "Active" },
  { id: "cls-3", title: "Equity", manualCode: "3000", status: "Active" },
  { id: "cls-4", title: "Revenue", manualCode: "4000", status: "Active" },
  { id: "cls-5", title: "Expenses", manualCode: "5000", status: "Active" },
  { id: "cls-6", title: "Other Income", manualCode: "4100", status: "Active" },
  { id: "cls-7", title: "Other Expense", manualCode: "5100", status: "Active" },
  { id: "cls-8", title: "Inventory", manualCode: "1500", status: "Active" },
  { id: "cls-9", title: "Fixed Assets", manualCode: "1200", status: "Active" },
  { id: "cls-10", title: "Payroll", manualCode: "5500", status: "Active" },
]

const initialGroups: GroupItem[] = [
  { id: "grp-1", classId: "cls-1", title: "Current Assets", manualCode: "1100", status: "Active" },
  { id: "grp-2", classId: "cls-1", title: "Cash & Bank", manualCode: "1110", status: "Active" },
  { id: "grp-3", classId: "cls-1", title: "Accounts Receivable", manualCode: "1120", status: "Active" },
  { id: "grp-4", classId: "cls-1", title: "Inventory", manualCode: "1130", status: "Active" },
  { id: "grp-5", classId: "cls-1", title: "Prepayments", manualCode: "1140", status: "Active" },
  { id: "grp-6", classId: "cls-1", title: "Property & Equipment", manualCode: "1150", status: "Active" },
  { id: "grp-7", classId: "cls-1", title: "Short-term Investments", manualCode: "1160", status: "Active" },
  { id: "grp-8", classId: "cls-1", title: "Long-term Investments", manualCode: "1170", status: "Active" },
  { id: "grp-9", classId: "cls-1", title: "Deferred Assets", manualCode: "1180", status: "Active" },
  { id: "grp-10", classId: "cls-1", title: "Other Assets", manualCode: "1190", status: "Active" },
]

const initialSubGroups: SubGroupItem[] = [
  { id: "sub-1", groupId: "grp-1", title: "Operating Cash", manualCode: "1101", status: "Active" },
  { id: "sub-2", groupId: "grp-2", title: "Bank Accounts", manualCode: "1111", status: "Active" },
  { id: "sub-3", groupId: "grp-3", title: "Trade Debtors", manualCode: "1121", status: "Active" },
  { id: "sub-4", groupId: "grp-4", title: "Finished Goods", manualCode: "1131", status: "Active" },
  { id: "sub-5", groupId: "grp-5", title: "Prepaid Expenses", manualCode: "1141", status: "Active" },
  { id: "sub-6", groupId: "grp-6", title: "Office Equipment", manualCode: "1151", status: "Active" },
  { id: "sub-7", groupId: "grp-7", title: "Short-term Investments", manualCode: "1161", status: "Active" },
  { id: "sub-8", groupId: "grp-8", title: "Long-term Investments", manualCode: "1171", status: "Active" },
  { id: "sub-9", groupId: "grp-9", title: "Deferred Charges", manualCode: "1181", status: "Active" },
  { id: "sub-10", groupId: "grp-10", title: "Misc Assets", manualCode: "1191", status: "Active" },
]

const initialControls: ControlItem[] = [
  { id: "ctl-1", subGroupId: "sub-1", title: "Main Cash", manualCode: "110101", status: "Active" },
  { id: "ctl-2", subGroupId: "sub-2", title: "Operating Bank", manualCode: "111101", status: "Active" },
  { id: "ctl-3", subGroupId: "sub-3", title: "Receivable Client A", manualCode: "112101", status: "Active" },
  { id: "ctl-4", subGroupId: "sub-4", title: "Inventory Warehouse A", manualCode: "113101", status: "Active" },
  { id: "ctl-5", subGroupId: "sub-5", title: "Prepaid Insurance", manualCode: "114101", status: "Active" },
  { id: "ctl-6", subGroupId: "sub-6", title: "Laptops & IT", manualCode: "115101", status: "Active" },
  { id: "ctl-7", subGroupId: "sub-7", title: "T-Bills Short Term", manualCode: "116101", status: "Active" },
  { id: "ctl-8", subGroupId: "sub-8", title: "Equity Investment", manualCode: "117101", status: "Active" },
  { id: "ctl-9", subGroupId: "sub-9", title: "Deferred Software Costs", manualCode: "118101", status: "Active" },
  { id: "ctl-10", subGroupId: "sub-10", title: "Other Asset Control", manualCode: "119101", status: "Active" },
]

const initialGlAccounts: GlAccount[] = [
  { id: "gl-1", controlId: "ctl-1", title: "Cash Drawer", manualCode: "11010101", status: "Active" },
  { id: "gl-2", controlId: "ctl-2", title: "Bank Checking 1", manualCode: "11110101", status: "Active" },
  { id: "gl-3", controlId: "ctl-3", title: "Receivable Customer X", manualCode: "11210101", status: "Active" },
  { id: "gl-4", controlId: "ctl-4", title: "Inventory Item A", manualCode: "11310101", status: "Active" },
  { id: "gl-5", controlId: "ctl-5", title: "Prepaid Insurance 2025", manualCode: "11410101", status: "Active" },
  { id: "gl-6", controlId: "ctl-6", title: "Laptop Pool", manualCode: "11510101", status: "Active" },
  { id: "gl-7", controlId: "ctl-7", title: "T-Bill 90 Day", manualCode: "11610101", status: "Active" },
  { id: "gl-8", controlId: "ctl-8", title: "Equity Stake ABC", manualCode: "11710101", status: "Active" },
  { id: "gl-9", controlId: "ctl-9", title: "Deferred Software Q1", manualCode: "11810101", status: "Active" },
  { id: "gl-10", controlId: "ctl-10", title: "Misc Asset Holding", manualCode: "11910101", status: "Active" },
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
  const defaultGlClassId = initialClasses[0]?.id ?? ""
  const defaultGlGroupId = initialGroups.find((g) => g.classId === defaultGlClassId)?.id ?? initialGroups[0]?.id ?? ""
  const defaultGlSubGroupId = initialSubGroups.find((sg) => sg.groupId === defaultGlGroupId)?.id ?? initialSubGroups[0]?.id ?? ""
  const defaultGlControlId = initialControls.find((c) => c.subGroupId === defaultGlSubGroupId)?.id ?? initialControls[0]?.id ?? ""

  const [glForm, setGlForm] = useState({
    classId: defaultGlClassId,
    groupId: defaultGlGroupId,
    subGroupId: defaultGlSubGroupId,
    controlId: defaultGlControlId,
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
  const [treeSearch, setTreeSearch] = useState("")
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initialClasses.map((cls) => [cls.id, true])) as Record<string, boolean>,
  )

  const classOptions = classes
  const resetForms = () => {
    setClassForm({ title: "", manualCode: "", status: "Active", editing: "" })
    setGroupForm({ classId: classes[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
    setSubGroupForm({ groupId: groups[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
    setControlForm({ subGroupId: subGroups[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
    const def = getDefaultGlForm()
    setGlForm(def)
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
    setGlForm(getDefaultGlForm())
  }

  const groupList = groups
  const subGroupList = subGroups

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

  const sortByManualCode = (a: { manualCode: string; title: string }, b: { manualCode: string; title: string }) =>
    (a.manualCode || "").localeCompare(b.manualCode || "", undefined, { numeric: true }) || a.title.localeCompare(b.title)

  const sortedClasses = [...classes].sort(sortByManualCode)
  const sortedGroups = [...groups].sort(sortByManualCode)
  const sortedSubGroups = [...subGroups].sort(sortByManualCode)
  const sortedControls = [...controls].sort(sortByManualCode)
  const sortedGlAccounts = [...glAccounts].sort(sortByManualCode)
  const totals = {
    classes: classes.length,
    groups: groups.length,
    subGroups: subGroups.length,
    controls: controls.length,
    gls: glAccounts.length,
  }

  const treeData: TreeNodeItem[] = sortedClasses.map((cls) => ({
    id: cls.id,
    title: cls.title,
    manualCode: cls.manualCode,
    status: cls.status,
    code: composeCode(cls),
    type: "class",
    classId: cls.id,
    children: sortedGroups
      .filter((g) => g.classId === cls.id)
      .map((group) => ({
        id: group.id,
        title: group.title,
        manualCode: group.manualCode,
        status: group.status,
        code: composeCode(cls, group),
        type: "group",
        classId: cls.id,
        groupId: group.id,
        children: sortedSubGroups
          .filter((sg) => sg.groupId === group.id)
          .map((sub) => ({
            id: sub.id,
            title: sub.title,
            manualCode: sub.manualCode,
            status: sub.status,
            code: composeCode(cls, group, sub),
            type: "subGroup",
            classId: cls.id,
            groupId: group.id,
            subGroupId: sub.id,
            children: sortedControls
              .filter((ctl) => ctl.subGroupId === sub.id)
              .map((ctl) => ({
                id: ctl.id,
                title: ctl.title,
                manualCode: ctl.manualCode,
                status: ctl.status,
                code: composeCode(cls, group, sub, ctl),
                type: "control",
                classId: cls.id,
                groupId: group.id,
                subGroupId: sub.id,
                controlId: ctl.id,
                children: sortedGlAccounts
                  .filter((gl) => gl.controlId === ctl.id)
                  .map((gl) => ({
                    id: gl.id,
                    title: gl.title,
                    manualCode: gl.manualCode,
                    status: gl.status,
                    code: composeCode(cls, group, sub, ctl, gl),
                    type: "gl",
                    classId: cls.id,
                    groupId: group.id,
                    subGroupId: sub.id,
                    controlId: ctl.id,
                  })),
              })),
          })),
      })),
  }))

  const filteredTree: TreeNodeItem[] = treeSearch.trim()
    ? (() => {
        const query = treeSearch.toLowerCase()
        const walk = (node: TreeNodeItem): TreeNodeItem | null => {
          const childMatches = node.children?.map(walk).filter(Boolean) as TreeNodeItem[] | undefined
          const matchesSelf = `${node.title} ${node.code} ${node.manualCode}`.toLowerCase().includes(query)
          if (matchesSelf || (childMatches && childMatches.length > 0)) {
            return { ...node, children: childMatches }
          }
          return null
        }
        return treeData.map(walk).filter(Boolean) as TreeNodeItem[]
      })()
    : treeData

  const hasTreeSearch = treeSearch.trim().length > 0

  const toggleNode = (id: string) => setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }))
  const expandAllNodes = () => {
    setExpandedClasses(Object.fromEntries(classes.map((c) => [c.id, true])))
    setExpandedGroups(Object.fromEntries(groups.map((g) => [g.id, true])))
    setExpandedSubGroups(Object.fromEntries(subGroups.map((sg) => [sg.id, true])))
    setExpandedControls(Object.fromEntries(controls.map((ctl) => [ctl.id, true])))
  }
  const collapseAllNodes = () => {
    setExpandedClasses({})
    setExpandedGroups({})
    setExpandedSubGroups({})
    setExpandedControls({})
  }

  const typeLabels: Record<TreeNodeItem["type"], string> = {
    class: "Class",
    group: "Group",
    subGroup: "Sub Group",
    control: "Control",
    gl: "GL",
  }

  const typeTone: Record<TreeNodeItem["type"], string> = {
    class: "bg-indigo-50 text-indigo-700",
    group: "bg-sky-50 text-sky-700",
    subGroup: "bg-blue-50 text-blue-700",
    control: "bg-amber-50 text-amber-800",
    gl: "bg-emerald-50 text-emerald-700",
  }

  const typeAccent: Record<TreeNodeItem["type"], string> = {
    class: "#F06292",
    group: "#BA68C8",
    subGroup: "#4FC3F7",
    control: "#FFB74D",
    gl: "#81C784",
  }

  const openNewClass = () => {
    setClassForm({ title: "", manualCode: "", status: "Active", editing: "" })
    setClassDialogOpen(true)
  }

  const openNewGroup = (classId?: string) => {
    setGroupForm({ classId: classId ?? classes[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
    setGroupDialogOpen(true)
  }

  const openNewSubGroup = (groupId?: string) => {
    setSubGroupForm({ groupId: groupId ?? groups[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
    setSubGroupDialogOpen(true)
  }

  const openNewControl = (subGroupId?: string) => {
    setControlForm({ subGroupId: subGroupId ?? subGroups[0]?.id ?? "", title: "", manualCode: "", status: "Active", editing: "" })
    setControlDialogOpen(true)
  }

  const getDefaultGlForm = (controlId?: string) => {
    const control = controlId ? controls.find((c) => c.id === controlId) : controls[0]
    const sub = control ? subGroups.find((sg) => sg.id === control.subGroupId) : subGroups[0]
    const group = sub ? groups.find((g) => g.id === sub.groupId) : groups.find((g) => g.classId === classes[0]?.id) ?? groups[0]
    const cls = group ? classes.find((c) => c.id === group.classId) : classes[0]

    const classId = cls?.id ?? ""
    const groupId = group?.id ?? groups.find((g) => g.classId === classId)?.id ?? ""
    const subGroupId = sub?.id ?? subGroups.find((sg) => sg.groupId === groupId)?.id ?? ""
    const ctlId = control?.id ?? controls.find((c) => c.subGroupId === subGroupId)?.id ?? ""

    return {
      classId,
      groupId,
      subGroupId,
      controlId: ctlId,
      title: "",
      manualCode: "",
      status: "Active" as Status,
      editing: "",
    }
  }

  const openNewGl = (controlId?: string) => {
    setGlForm(getDefaultGlForm(controlId))
    setGlDialogOpen(true)
  }

  const handleEditNode = (node: TreeNodeItem) => {
    if (node.type === "class") {
      const cls = classes.find((c) => c.id === node.id)
      if (cls) {
        setClassForm({ ...cls, editing: cls.id })
        setClassDialogOpen(true)
      }
      return
    }
    if (node.type === "group") {
      const group = groups.find((g) => g.id === node.id)
      if (group) {
        setGroupForm({ ...group, editing: group.id })
        setGroupDialogOpen(true)
      }
      return
    }
    if (node.type === "subGroup") {
      const sub = subGroups.find((sg) => sg.id === node.id)
      if (sub) {
        setSubGroupForm({ ...sub, editing: sub.id })
        setSubGroupDialogOpen(true)
      }
      return
    }
    if (node.type === "control") {
      const ctl = controls.find((c) => c.id === node.id)
      if (ctl) {
        setControlForm({ ...ctl, editing: ctl.id })
        setControlDialogOpen(true)
      }
      return
    }
    if (node.type === "gl") {
      const gl = glAccounts.find((g) => g.id === node.id)
      if (gl) {
        const control = controls.find((c) => c.id === gl.controlId)
        const sub = control ? subGroups.find((sg) => sg.id === control.subGroupId) : undefined
        const group = sub ? groups.find((g) => g.id === sub.groupId) : undefined
        const cls = group ? classes.find((c) => c.id === group.classId) : undefined
        setGlForm({
          ...gl,
          classId: cls?.id ?? "",
          groupId: group?.id ?? "",
          subGroupId: sub?.id ?? "",
          controlId: control?.id ?? "",
          editing: gl.id,
        })
        setGlDialogOpen(true)
      }
    }
  }

  const AddAction = ({ node }: { node: TreeNodeItem }) => {
    if (node.type === "class") {
      return (
        <Button variant="outline" size="sm" className="h-8 px-2 text-[11px] border-slate-200 hover:border-slate-300" onClick={() => openNewClass()}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Class
        </Button>
      )
    }
    if (node.type === "group") {
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-[11px] border-slate-200 hover:border-slate-300"
          onClick={() => openNewGroup(node.classId)}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Group
        </Button>
      )
    }
    if (node.type === "subGroup") {
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2 text-[11px] border-slate-200 hover:border-slate-300"
          onClick={() => openNewSubGroup(node.groupId ?? node.id)}
        >
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Sub Group
        </Button>
      )
    }
    if (node.type === "control") {
      return (
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-[11px] border-slate-200 hover:border-slate-300"
            onClick={() => openNewControl(node.subGroupId ?? node.id)}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Control
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-[11px] border-slate-200 hover:border-slate-300"
            onClick={() => openNewGl(node.controlId ?? node.id)}
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add GL
          </Button>
        </div>
      )
    }
    if (node.type === "gl") {
      return null
    }
    return null
  }

  const TreeRow = ({ node, depth }: { node: TreeNodeItem; depth: number }) => {
    const isControl = node.type === "control"
    const glChildren = isControl ? node.children ?? [] : []
    const otherChildren = isControl ? [] : node.children ?? []
    const hasChildren = Boolean(otherChildren.length)
    const isExpanded = hasTreeSearch ? true : expandedNodes[node.id] ?? false

    const headerClass =
      node.type === "class"
        ? "bg-rose-50 border-rose-100 text-rose-900"
        : node.type === "group"
          ? "bg-purple-50 border-purple-100 text-purple-900"
          : node.type === "subGroup"
            ? "bg-sky-50 border-sky-100 text-sky-900"
            : node.type === "control"
              ? "bg-amber-50 border-amber-100 text-amber-900"
              : "bg-emerald-50 border-emerald-100 text-emerald-900"

    return (
      <div className="space-y-1.5" style={{ marginLeft: depth ? depth * 12 : 0 }}>
        <div className={`flex items-center justify-between rounded-lg border px-3 py-2 text-[11px] font-semibold ${headerClass}`}>
          <span className="uppercase tracking-[0.08em]">{typeLabels[node.type]}</span>
          <span className="text-[10px] font-medium text-slate-600">{node.code || "—"}</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-gradient-to-r from-white via-slate-50 to-white px-3.5 py-2.5 shadow-sm transition hover:-translate-y-[1px] hover:border-slate-300 hover:shadow-md">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => toggleNode(node.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
              aria-label={`${isExpanded ? "Collapse" : "Expand"} ${node.title}`}
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-7" />
          )}
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_0_3px_rgba(0,0,0,0.04)]"
              style={{ backgroundColor: typeAccent[node.type] }}
              aria-hidden
            />
            <span className="truncate text-[12px] font-semibold text-slate-900">{node.title}</span>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-sm ${typeTone[node.type]}`}>
              {typeLabels[node.type]}
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {renderStatus(node.status)}
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-[11px] border-slate-200 hover:border-slate-300"
              onClick={() => handleEditNode(node)}
            >
              <Edit3 className="mr-1 h-3.5 w-3.5" />
              Edit
            </Button>
            <AddAction node={node} />
          </div>
        </div>
        {isControl && glChildren.length > 0 && (isExpanded || hasTreeSearch) && (
          <div className="mt-2 rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between rounded-t-xl border-b border-slate-200 bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-900">
              <span>GL Accounts</span>
              <span className="text-[10px] font-medium text-emerald-800">{glChildren.length} items</span>
            </div>
            <div className="overflow-auto">
              <table className="min-w-full text-[11px]">
                <thead className="bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600">
                  <tr>
                    <th className="px-3 py-2">GL Title</th>
                    <th className="px-3 py-2">Manual Code</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {glChildren.map((gl, idx) => (
                    <tr key={gl.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                      <td className="px-3 py-2 text-slate-900">{gl.title}</td>
                      <td className="px-3 py-2 font-mono text-slate-700">{gl.manualCode || "—"}</td>
                      <td className="px-3 py-2">{renderStatus(gl.status)}</td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-[11px] border-slate-200 hover:border-slate-300"
                          onClick={() => handleEditNode(gl)}
                        >
                          <Edit3 className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {otherChildren.length > 0 && (isExpanded || hasTreeSearch) && (
          <div className="space-y-2 border-l border-slate-200 pl-4">
            {otherChildren.map((child) => (
              <TreeRow key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initialClasses.map((c) => [c.id, true])),
  )
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const [expandedSubGroups, setExpandedSubGroups] = useState<Record<string, boolean>>({})
  const [expandedControls, setExpandedControls] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string, setter: React.Dispatch<React.SetStateAction<Record<string, boolean>>>) => {
    setter((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const renderControlSection = (control: ControlItem) => {
    const controlGl = glAccounts.filter((gl) => gl.controlId === control.id)
    return (
      <div key={control.id} className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 bg-amber-50 px-3 py-2 text-[11px] font-semibold text-amber-900">
          <span>{composeCode(classes.find((c) => c.id === classes.find((c2) => c2.id === groups.find((g) => g.id === subGroups.find((sg) => sg.id === control.subGroupId)?.groupId)?.classId)?.id), groups.find((g) => g.id === subGroups.find((sg) => sg.id === control.subGroupId)?.groupId), subGroups.find((sg) => sg.id === control.subGroupId), control) || "-"}</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-2 text-[11px]" onClick={() => openNewGl(control.id)}>
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add GL
            </Button>
          </div>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-[11px]">
            <thead className="bg-slate-50 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-600">
              <tr>
                <th className="px-3 py-2">GL Title</th>
                <th className="px-3 py-2">Manual Code</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {controlGl.map((gl, idx) => (
                <tr key={gl.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                  <td className="px-3 py-2 text-slate-900">{gl.title}</td>
                  <td className="px-3 py-2 font-mono text-slate-700">{gl.manualCode || "-"}</td>
                  <td className="px-3 py-2">{renderStatus(gl.status)}</td>
                  <td className="px-3 py-2 text-right">
                    <Button variant="outline" size="sm" className="h-8 px-2 text-[11px]" onClick={() => handleEditNode({ ...gl, type: "gl" } as any)}>
                      <Edit3 className="mr-1 h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderClassHierarchy = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-[11px] font-semibold text-rose-900">
        <span>Class Name</span>
        <Button variant="outline" size="sm" className="h-8 px-2 text-[11px]" onClick={() => openNewClass()}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Class
        </Button>
      </div>
      <div className="space-y-2">
        {classes.map((cls) => (
          <div key={cls.id} className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between px-3 py-2 text-[11px]">
              <div className="flex items-center gap-2">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  onClick={() => toggleExpand(cls.id, setExpandedClasses)}
                >
                  {expandedClasses[cls.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
                <div className="flex flex-col">
                  <span className="text-[12px] font-semibold text-slate-900">{cls.manualCode || "-"} :: {cls.title}</span>
                  <span className="text-[10px] text-slate-500">Click “Add Group” above to place groups under this class.</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {renderStatus(cls.status)}
              </div>
            </div>
            {expandedClasses[cls.id] && (
              <div className="space-y-2 border-t border-slate-100 bg-purple-50/30 px-3 py-2">
                <div className="flex items-center justify-between rounded-md bg-purple-50 px-3 py-1.5 text-[11px] font-semibold text-purple-900">
                  <span>Group Name</span>
                  <Button variant="outline" size="sm" className="h-8 px-2 text-[11px]" onClick={() => openNewGroup(cls.id)}>
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Add Group
                  </Button>
                </div>
                {groups
                  .filter((g) => g.classId === cls.id)
                  .map((g) => (
                    <div key={g.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-2">
                          <button
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                            onClick={() => toggleExpand(g.id, setExpandedGroups)}
                          >
                            {expandedGroups[g.id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          </button>
                          <span className="font-semibold text-slate-900">{composeCode(cls, g) || "-"} :: {g.title}</span>
                          <span className="text-[10px] text-slate-500">Use “Add Sub Group” to place children here.</span>
                        </div>
                <div className="flex items-center gap-2">
                  {renderStatus(g.status)}
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-[11px]"
                    onClick={() => {
                      setGroupForm({ ...g, editing: g.id })
                      setGroupDialogOpen(true)
                    }}
                  >
                    <Edit3 className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Button>
                </div>
              </div>
                      {expandedGroups[g.id] && (
                        <div className="mt-2 space-y-2 rounded-md bg-sky-50/40 px-3 py-2">
                          <div className="flex items-center justify-between rounded-md bg-sky-50 px-3 py-1.5 text-[11px] font-semibold text-sky-900">
                            <span>SubGroup Name</span>
                            <Button variant="outline" size="sm" className="h-8 px-2 text-[11px]" onClick={() => openNewSubGroup(g.id)}>
                              <Plus className="mr-1 h-3.5 w-3.5" />
                              Add Sub Group
                            </Button>
                          </div>
                          {subGroups
                            .filter((sg) => sg.groupId === g.id)
                            .map((sg) => (
                              <div key={sg.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                <div className="flex items-center justify-between text-[11px]">
                                  <div className="flex items-center gap-2">
                                    <button
                                      className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                                      onClick={() => toggleExpand(sg.id, setExpandedSubGroups)}
                                    >
                                      {expandedSubGroups[sg.id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                    </button>
                                    <span className="font-semibold text-slate-900">{composeCode(cls, g, sg) || "-"} :: {sg.title}</span>
                                    <span className="text-[10px] text-slate-500">"Add Control" attaches controls under this sub group.</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {renderStatus(sg.status)}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2 text-[11px]"
                                      onClick={() => {
                                        setSubGroupForm({ ...sg, editing: sg.id })
                                        setSubGroupDialogOpen(true)
                                      }}
                                    >
                                      <Edit3 className="mr-1 h-3.5 w-3.5" />
                                      Edit
                                    </Button>
                                  </div>
                                </div>
                                {expandedSubGroups[sg.id] && (
                                  <div className="mt-2 space-y-3 rounded-md bg-amber-50/50 px-3 py-3">
                                    <div className="flex items-center justify-between rounded-md bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-900">
                                      <span>Control Name</span>
                                      <Button variant="outline" size="sm" className="h-8 px-2 text-[11px]" onClick={() => openNewControl(sg.id)}>
                                        <Plus className="mr-1 h-3.5 w-3.5" />
                                        Add Control
                                      </Button>
                                    </div>
                                    {controls
                                      .filter((ctl) => ctl.subGroupId === sg.id)
                                      .map((ctl) => (
                                        <div key={ctl.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                                          <div className="flex items-center justify-between text-[11px]">
                                            <div className="flex items-center gap-2">
                                              <button
                                                className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                                                onClick={() => toggleExpand(ctl.id, setExpandedControls)}
                                              >
                                                {expandedControls[ctl.id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                              </button>
                                              <span className="font-semibold text-slate-900">{composeCode(cls, g, sg, ctl) || "-"} :: {ctl.title}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                              {renderStatus(ctl.status)}
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 px-2 text-[11px]"
                                                onClick={() => {
                                                  setControlForm({ ...ctl, editing: ctl.id })
                                                  setControlDialogOpen(true)
                                                }}
                                              >
                                                <Edit3 className="mr-1 h-3.5 w-3.5" />
                                                Edit
                                              </Button>
                                            </div>
                                          </div>
                                          {expandedControls[ctl.id] && (
                                            <div className="mt-2">
                                              {renderControlSection(ctl)}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
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
                <CardTitle className="text-sm text-slate-900">Chart of Accounts</CardTitle>
                <p className="text-xs text-slate-500">One header per level. Expand to drill in, use the header Add buttons to place children in the right spot.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  placeholder="Search title or manual code..."
                  value={treeSearch}
                  onChange={(e) => setTreeSearch(e.target.value)}
                  className="h-9 w-56 text-[11px]"
                />
                <Button variant="outline" size="sm" className="h-9 px-3 text-[11px] border-slate-300" onClick={expandAllNodes}>
                  Expand all
                </Button>
                <Button variant="outline" size="sm" className="h-9 px-3 text-[11px] border-slate-300" onClick={collapseAllNodes}>
                  Collapse all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                  { label: "Classes", value: totals.classes },
                  { label: "Groups", value: totals.groups },
                  { label: "Sub Groups", value: totals.subGroups },
                  { label: "Controls", value: totals.controls },
                  { label: "GLs", value: totals.gls },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-700 shadow-sm"
                  >
                    <span className="font-medium">{stat.label}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-800 shadow-inner">{stat.value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                {renderClassHierarchy()}
              </div>
            </CardContent>
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
                  disabled={Boolean(groupForm.editing)}
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
                  disabled={Boolean(groupForm.editing)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Activation</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={groupForm.status}
                  onChange={(e) => setGroupForm((p) => ({ ...p, status: e.target.value as Status }))}
                  disabled={Boolean(groupForm.editing)}
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
                  disabled={Boolean(subGroupForm.editing)}
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
                  disabled={Boolean(subGroupForm.editing)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Activation</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={subGroupForm.status}
                  onChange={(e) => setSubGroupForm((p) => ({ ...p, status: e.target.value as Status }))}
                  disabled={Boolean(subGroupForm.editing)}
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
                  disabled={Boolean(controlForm.editing)}
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
                  disabled={Boolean(controlForm.editing)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Activation</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={controlForm.status}
                  onChange={(e) => setControlForm((p) => ({ ...p, status: e.target.value as Status }))}
                  disabled={Boolean(controlForm.editing)}
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
                <Label className="text-xs text-slate-600">Class</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={glForm.classId}
                  onChange={(e) => {
                    const newClassId = e.target.value
                    const nextGroup = groups.find((g) => g.classId === newClassId)
                    const nextGroupId = nextGroup?.id ?? ""
                    const nextSub = subGroups.find((sg) => sg.groupId === nextGroupId)
                    const nextSubId = nextSub?.id ?? ""
                    const nextCtl = controls.find((c) => c.subGroupId === nextSubId)
                    const nextCtlId = nextCtl?.id ?? ""
                    setGlForm((p) => ({
                      ...p,
                      classId: newClassId,
                      groupId: nextGroupId,
                      subGroupId: nextSubId,
                      controlId: nextCtlId,
                    }))
                  }}
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Group</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={glForm.groupId}
                  onChange={(e) => {
                    const newGroupId = e.target.value
                    const nextSub = subGroups.find((sg) => sg.groupId === newGroupId)
                    const nextSubId = nextSub?.id ?? ""
                    const nextCtl = controls.find((c) => c.subGroupId === nextSubId)
                    const nextCtlId = nextCtl?.id ?? ""
                    setGlForm((p) => ({
                      ...p,
                      groupId: newGroupId,
                      subGroupId: nextSubId,
                      controlId: nextCtlId,
                    }))
                  }}
                >
                  <option value="">Select group</option>
                  {groups
                    .filter((g) => !glForm.classId || g.classId === glForm.classId)
                    .map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Sub Group</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={glForm.subGroupId}
                  onChange={(e) => {
                    const newSubId = e.target.value
                    const nextCtl = controls.find((c) => c.subGroupId === newSubId)
                    const nextCtlId = nextCtl?.id ?? ""
                    setGlForm((p) => ({
                      ...p,
                      subGroupId: newSubId,
                      controlId: nextCtlId,
                    }))
                  }}
                >
                  <option value="">Select sub group</option>
                  {subGroups
                    .filter((sg) => !glForm.groupId || sg.groupId === glForm.groupId)
                    .map((sg) => (
                      <option key={sg.id} value={sg.id}>
                        {sg.title}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-600">Control *</Label>
                <select
                  className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                  value={glForm.controlId}
                  onChange={(e) => setGlForm((p) => ({ ...p, controlId: e.target.value }))}
                >
                  <option value="">Select control</option>
                  {controls
                    .filter((c) => !glForm.subGroupId || c.subGroupId === glForm.subGroupId)
                    .map((c) => (
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


