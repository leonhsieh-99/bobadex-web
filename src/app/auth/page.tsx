'use client'
import { useState } from "react"
import { createClient } from "@/utils/supabase/client"

export default function AuthPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  async function onContinue(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending')
    const emailRedirectTo = `{origin}/auth/confirm?next=/dashboard`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo }
    });

    if (!error) {
      setStatus('sent')
      return
    }

    const notFound =  (error as any)?.status === 400 || /user.*not.*found/i.test(error.message);
    if (notFound) {
      const { error: signUpErr } = await supabase.auth.signUp({email, password, options: { emailRedirectTo } })
    }

    setStatus('error')
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold">Welcome to Bobadex</h1>
      <p className="mt-1 text-sm text-muted-foreground">We'll email you a link to sign in or create an account</p>

      <form onSubmit={onContinue} className="mt-4 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded border px-3 py-2"
        />
        <button disabled={status==="sending"} className="w-full rounded bg-black px-3 text-white">
          {status==='sending' ? 'Sending...' : 'Continue'}
        </button>
      </form>

      {status==="sent" && <p className="mt-3 text-sm">Check your email for a secure link.</p>}
      {status==="error" && <p className="mt-3 text-sm text-red-600">Couldn’t send link. Try again.</p>}
    </div>
  )
}