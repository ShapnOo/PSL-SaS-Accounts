"use client"

import { useMemo, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Plan = {
  id: string
  name: string
  priceMonthly: number | "custom"
  priceYearly: number | "custom"
  desc: string
  badge?: string
  features: string[]
}

const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 29,
    priceYearly: 24,
    desc: "For lean teams launching fast.",
    features: ["Up to 10 users", "Basic audit logs", "Email support", "Single region"],
  },
  {
    id: "growth",
    name: "Growth",
    priceMonthly: 79,
    priceYearly: 64,
    desc: "For scaling companies that need control.",
    badge: "Most popular",
    features: ["Up to 100 users", "Advanced audit logs", "RBAC + MFA", "Multi-region"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: "custom",
    priceYearly: "custom",
    desc: "For large orgs with compliance needs.",
    badge: "Custom",
    features: ["Unlimited users", "SSO/SAML & SCIM", "Dedicated region", "Premium support"],
  },
]

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly")
  const [selectedPlan, setSelectedPlan] = useState<Plan>(plans[1])
  const [status, setStatus] = useState<"idle" | "paid" | "later">("idle")

  const displayPrice = useMemo(() => {
    const price = billing === "monthly" ? selectedPlan.priceMonthly : selectedPlan.priceYearly
    if (price === "custom") return "Custom"
    return `$${price}/mo`
  }, [billing, selectedPlan])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4">
        {/* Hero */}
        <div className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-lg shadow-slate-200/60 backdrop-blur text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#1B254D]/10 px-4 py-1.5 text-xs font-semibold text-[#1B254D]">
            Transparent pricing • Secure checkout
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Pricing</p>
            <h1 className="text-3xl font-semibold text-slate-900">Choose a plan. Pay with confidence.</h1>
            <p className="text-sm text-slate-600">All plans include MFA, secure onboarding, and audit-ready logs.</p>
          </div>
          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-sm shadow-sm">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                billing === "monthly" ? "bg-[#1B254D] text-white shadow-sm" : "text-slate-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition ${
                billing === "yearly" ? "bg-[#1B254D] text-white shadow-sm" : "text-slate-700"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Plan cards */}
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const active = selectedPlan.id === plan.id
              const price = billing === "monthly" ? plan.priceMonthly : plan.priceYearly
              const priceLabel = price === "custom" ? "Custom" : `$${price}/mo`
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`cursor-pointer rounded-2xl border p-5 text-left transition-all ${
                    active
                      ? "border-[#1B254D] shadow-xl shadow-[#1B254D]/10 bg-white"
                      : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
                      <p className="text-xs text-slate-500">{plan.desc}</p>
                    </div>
                    {plan.badge && (
                      <span className="rounded-full bg-[#1B254D]/10 px-3 py-1 text-xs font-semibold text-[#1B254D]">
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-[#1B254D]">{priceLabel}</p>
                  <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-[#1B254D]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Button
                      className="w-full"
                      variant={active ? "default" : "outline"}
                    >
                      {active ? "Selected" : "Choose plan"}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Checkout panel */}
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/70 border border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Checkout</p>
                <p className="text-sm font-semibold text-slate-900">Secure payment</p>
              </div>
              <span className="text-xs font-semibold text-[#1B254D] bg-[#1B254D]/10 px-3 py-1 rounded-full">
                {selectedPlan.name} • {billing}
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <Input className="h-11 bg-slate-50 border-slate-200" placeholder="Alex Parker" defaultValue="Alex Parker" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Work Email</label>
                <Input
                  className="h-11 bg-slate-50 border-slate-200"
                  type="email"
                  placeholder="you@company.com"
                  defaultValue="alex@demo.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Company</label>
                <Input className="h-11 bg-slate-50 border-slate-200" placeholder="Company Name" defaultValue="Demo Studio Inc" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Country / Region</label>
                <select className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800">
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Germany</option>
                </select>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <p className="text-sm font-semibold text-slate-800">Payment Method</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm text-slate-700">Card Number</label>
                  <Input className="h-11 bg-white border-slate-200" placeholder="1234 5678 9012 3456" defaultValue="4242 4242 4242 4242" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm text-slate-700">Expiry</label>
                    <Input className="h-11 bg-white border-slate-200" placeholder="MM/YY" defaultValue="12/28" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-slate-700">CVC</label>
                    <Input className="h-11 bg-white border-slate-200" placeholder="123" defaultValue="123" />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-700">Billing Address</label>
                <Input className="h-11 bg-white border-slate-200" placeholder="Street, City, State" defaultValue="123 Demo Street, NY" />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="text-sm font-semibold text-slate-800">Summary</p>
                <p className="text-xs text-slate-600">Plan: {selectedPlan.name}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-[#1B254D]">{displayPrice}</p>
                <p className="text-xs text-slate-500">Billed {billing}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" className="h-4 w-4" defaultChecked /> I agree to the Terms and Privacy.
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button
                  className="h-12 w-full rounded-xl text-base bg-[#1B254D] hover:bg-[#233063]"
                  onClick={() => setStatus("paid")}
                  asChild
                >
                  <a href="/payment-success">Complete Payment</a>
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-full rounded-xl text-base"
                  onClick={() => setStatus("later")}
                  asChild
                >
                  <a href="/">Pay Later</a>
                </Button>
              </div>
              {status === "paid" && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Payment successful. Your {selectedPlan.name} workspace is activated. Continue to onboarding.
                </div>
              )}
              {status === "later" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Plan saved. You can complete payment later from Billing. Limited trial access is enabled.
                </div>
              )}
              <p className="text-center text-xs text-slate-500">
                Payment is encrypted and secured. Need help? <span className="font-semibold text-[#1B254D]">Contact support</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
