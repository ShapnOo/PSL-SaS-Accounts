"use client"

import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 p-8 space-y-6 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-semibold">
          ✓
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Payment</p>
          <h1 className="text-2xl font-semibold text-slate-900">Payment successful</h1>
          <p className="text-sm text-slate-600">
            Your plan is activated. We’ve emailed your receipt and provisioning details.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild className="h-11 rounded-xl text-base">
            <Link href="/">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="h-11 rounded-xl text-base">
            <Link href="/billing">View Billing</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
