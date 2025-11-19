'use client'

import Link from "next/link"
import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { login } from "@/app/auth/actions"
import { register } from "module"

type Mode = 'login' | 'register'

export default function AuthCard({ mode }: { mode: Mode }) {
  const sp = useSearchParams()
  const router = useRouter()
  const next = sp.get('next') ?? 'dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const otherRoute = mode === 'login' ? 'signup' : 'login'
  const otherHref = `${otherRoute}${next ? `?next=${encodeURIComponent(next)}` : ""}`;

  return (
    <div className="min-h-[100dvh] flex items-center justify-center p-6">
      <div className="min-w-1/3 rounded-2xl border bg-background p-6 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-2 h-12 w-12 rounded-full border flex items-center justify-center">🧋</div>
          <h1 className="text-2xl font-semibold">Bobadex</h1>
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? 'Welcome back.': 'Create your account'}
          </p>
        </div>

        {/* Form */}
        <form action={login} className="space-y-4 mt-6" autoComplete="on">
          <input type="hidden" name="next" value={next}/>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                autoComplete="email"
                required
                className="w-full rounded-md border outline-none px-3 py-2 focus:ring"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm">
              Password {mode === 'register' && <span className="text-muted-foreground">(min 8 characters)</span>}
            </label>
            <input
              id="password"
              type="current-password"
              name="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={mode == 'register' ? 8 : undefined}
              className="w-full rounded-md border outline-none px-3 py-2 focus:ring"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {mode === 'login' && (
            <div className="flex justify-end">
              <Link href='forgot-password' className="">
                Forgot password?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-foreground px-3 py-2 text-background disabled:opacity-70"
          >
            {busy ? (mode === "login" ? "Signing in..." : "Creating account...") : (mode === "login" ? "Sign in" : "Sign up")}
          </button>
        </form>

        {/* toggle */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>Don&apos;t have an account? <Link href={otherHref} className="underline">Sign up</Link></>
          ) : (
            <>Already have an account? <Link href={otherHref} className="underline">Sign in</Link></>
          )}
        </p>
      </div>
    </div>
  )
}