"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "John M. Smith",
    email: "john@demo.com",
    username: "john-demo",
    phone: "+1 202 555 0136",
    password: "Password123!",
    confirmPassword: "Password123!",
    company: "Demo Studio Inc",
    subdomain: "demostudio",
    accept: true,
  })

  const update = (key: keyof typeof form, value: string | boolean) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 flex items-center justify-center px-4">
      <div className="w-full max-w-6xl rounded-3xl bg-white shadow-xl shadow-slate-200/80 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Left panel */}
          <div className="flex-1 bg-slate-50 p-8 md:p-10 space-y-6">
            <nav className="flex items-center gap-6 text-sm font-semibold text-slate-700">
              <Link href="#">Home</Link>
              <Link href="#">About</Link>
              <Link href="#">Contact</Link>
              <Link href="/pricing">Pricing</Link>
              <span className="text-[#1B254D]">Signup</span>
            </nav>
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-slate-900">
                User <span className="text-[#1B254D]">Signup</span>
              </h1>
              <p className="text-sm text-slate-600 max-w-md">
                Create your account to get started. We keep your workspace secure with MFA and strong-password policies.
              </p>
            </div>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <span className="mt-1 h-5 w-5 rounded-full bg-[#1B254D]/10 text-[#1B254D] flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <p>Role-based access and audit-ready activity logs.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-1 h-5 w-5 rounded-full bg-[#1B254D]/10 text-[#1B254D] flex items-center justify-center text-xs font-bold">
                  ✓
                </span>
                <p>Regional data residency with enforced MFA by default.</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="h-48 w-full rounded-xl bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center text-slate-500">
                Illustration / Laptop placeholder
              </div>
            </div>
          </div>

          {/* Right form card */}
          <div className="relative flex-1 bg-[#1B254D] p-3 sm:p-6">
            <div className="absolute right-4 top-4">
              <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-md">
                • Live Chat
              </button>
            </div>
            <div className="mx-auto w-full max-w-xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
              <form className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Account Type</label>
                  <select
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800"
                    defaultValue="Classic Business"
                  >
                    <option>Classic Business</option>
                    <option>Growth</option>
                    <option>Enterprise</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <Input
                    className="h-11 rounded-xl border-slate-200 bg-slate-50"
                    placeholder="John M. Smith"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <Input
                    className="h-11 rounded-xl border-slate-200 bg-slate-50"
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Username</label>
                  <Input
                    className="h-11 rounded-xl border-slate-200 bg-slate-50"
                    placeholder="@example123"
                    value={form.username}
                    onChange={(e) => update("username", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                  <Input
                    className="h-11 rounded-xl border-slate-200 bg-slate-50"
                    placeholder="+123 1234 5678"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Company</label>
                  <Input
                    className="h-11 rounded-xl border-slate-200 bg-slate-50"
                    placeholder="Company Name"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Subdomain</label>
                  <div className="flex items-center gap-2">
                    <Input
                      className="h-11 flex-1 rounded-xl border-slate-200 bg-slate-50"
                    placeholder="yourcompany"
                    value={form.subdomain}
                    onChange={(e) => update("subdomain", e.target.value)}
                  />
                    <span className="text-sm text-slate-600 pr-1">.yourapp.com</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <Input
                    className="h-11 rounded-xl border-slate-200 bg-slate-50"
                    type="password"
                    placeholder="•••••••••"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                  <Input
                    className="h-11 rounded-xl border-slate-200 bg-slate-50"
                    type="password"
                    placeholder="•••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => update("confirmPassword", e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2 flex flex-col gap-3 pt-1">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={form.accept}
                      onChange={(e) => update("accept", e.target.checked)}
                    />
                    Agree with Terms of Use and Privacy Policy.
                  </label>
                  <Button asChild className="h-12 w-full rounded-xl text-base bg-[#1B254D] hover:bg-[#233063]">
                    <Link href="/pricing">Save &amp; Next</Link>
                  </Button>
                  <p className="text-center text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#1B254D] font-semibold hover:underline">
                      Login Now
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
