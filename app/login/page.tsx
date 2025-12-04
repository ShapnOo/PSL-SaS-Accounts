"use client"

import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        <div className="px-8 pt-8 pb-6">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1B254D]/10 text-[#1B254D] font-semibold">
              SA
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Sign in to your account</h1>
            <p className="text-sm text-slate-500">SaaS access with MFA-ready credentials</p>
          </div>

          <form className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <Input
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me on this device
                </label>
                <Link href="/forgot-password" className="text-[#1B254D] hover:underline">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button className="w-full h-11">Sign In</Button>
          </form>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/60 px-8 py-4 text-center text-sm text-slate-600">
          New to the platform?{" "}
          <Link href="/signup" className="text-[#1B254D] font-semibold hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  )
}
