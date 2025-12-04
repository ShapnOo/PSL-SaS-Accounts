import { Card } from "@/components/ui/card"
import { BookOpen, FileText, Landmark, Receipt, Settings, Users } from "lucide-react"

const tones = {
  blue: {
    accent: "bg-blue-500/15",
    iconBg: "bg-blue-50 text-blue-700",
    pill: "border-blue-100 text-blue-700 bg-blue-50/80",
  },
  indigo: {
    accent: "bg-indigo-500/15",
    iconBg: "bg-indigo-50 text-indigo-700",
    pill: "border-indigo-100 text-indigo-700 bg-indigo-50/80",
  },
  emerald: {
    accent: "bg-emerald-500/15",
    iconBg: "bg-emerald-50 text-emerald-700",
    pill: "border-emerald-100 text-emerald-700 bg-emerald-50/80",
  },
  cyan: {
    accent: "bg-cyan-500/15",
    iconBg: "bg-cyan-50 text-cyan-700",
    pill: "border-cyan-100 text-cyan-700 bg-cyan-50/80",
  },
  slate: {
    accent: "bg-slate-500/12",
    iconBg: "bg-slate-50 text-slate-700",
    pill: "border-slate-200 text-slate-700 bg-slate-50/90",
  },
  amber: {
    accent: "bg-amber-500/18",
    iconBg: "bg-amber-50 text-amber-700",
    pill: "border-amber-100 text-amber-700 bg-amber-50/80",
  },
} as const

const stats = [
  {
    label: "Configuration",
    value: 5,
    note: "Financial periods, centers, locks",
    badge: "Setup",
    icon: Settings,
    tone: tones.blue,
  },
  {
    label: "Chart of Accounts",
    value: 284,
    note: "Master + module wise COA",
    badge: "Accounts",
    icon: BookOpen,
    tone: tones.indigo,
  },
  {
    label: "Transactions",
    value: 129,
    note: "Vouchers this month",
    badge: "Ops",
    icon: Receipt,
    tone: tones.emerald,
  },
  {
    label: "Bank Reconciliation",
    value: 12,
    note: "Items pending match",
    badge: "Bank",
    icon: Landmark,
    tone: tones.cyan,
  },
  {
    label: "Reports",
    value: 14,
    note: "Ready-to-run statements",
    badge: "Analytics",
    icon: FileText,
    tone: tones.slate,
  },
  {
    label: "Customers",
    value: 86,
    note: "Active customer ledgers",
    badge: "CRM",
    icon: Users,
    tone: tones.amber,
  },
]

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="relative overflow-hidden rounded-xl border border-slate-100 bg-white/95 p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:border-slate-200"
        >
          <div className={`absolute inset-x-0 top-0 h-1 ${stat.tone.accent}`} />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_20%,rgba(15,23,42,0.04),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(14,165,233,0.06),transparent_30%)]" />
          <div className="flex items-start justify-between gap-3 relative">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value.toLocaleString("en-BD")}</p>
              <p className="text-[11px] text-slate-500">{stat.note}</p>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${stat.tone.pill}`}
              >
                <span className="block h-1.5 w-1.5 rounded-full bg-current opacity-80" aria-hidden />
                {stat.badge}
              </span>
            </div>
            <div className={`rounded-lg ${stat.tone.iconBg} p-2.5 shadow-inner`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
