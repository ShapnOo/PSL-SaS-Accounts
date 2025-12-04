import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const quickLinks = [
  // Configuration
  { label: "Financial Period", category: "primary" },
  { label: "Cost Center", category: "secondary" },
  { label: "New Voucher", category: "accent" },
  { label: "Month Lock", category: "warning" },

  // Chart of Accounts
  { label: "Chart of Accounts", category: "primary" },
  { label: "Opening Balance", category: "secondary" },
  { label: "Modulewise COA", category: "accent" },

  // Transaction
  { label: "Voucher List", category: "primary" },
  { label: "Journal List", category: "secondary" },
  { label: "Bank Payment Voucher", category: "warning" },
  { label: "Bank Received Voucher", category: "success" },
  { label: "Cash Payment Voucher", category: "warning" },
  { label: "Cash Received Voucher", category: "success" },

  // Bank Reconciliation
  { label: "Bank Reconciliation", category: "accent" },

  // Reports
  { label: "Reports", category: "primary" },
]

const categoryStyles: Record<string, string> = {
  primary: "bg-blue-500 hover:bg-blue-600 text-white",
  secondary: "bg-slate-500 hover:bg-slate-600 text-white",
  accent: "bg-sky-500 hover:bg-sky-600 text-white",
  success: "bg-emerald-500 hover:bg-emerald-600 text-white",
  warning: "bg-amber-500 hover:bg-amber-600 text-white",
}

export function QuickAccess() {
  return (
    <Card className="border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-foreground">Quick Access</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((link) => (
            <Button
              key={link.label}
              size="sm"
              className={`${categoryStyles[link.category]} border-0 text-xs font-medium shadow-sm h-7 px-2.5`}
            >
              {link.label}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
