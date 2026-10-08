"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { requestSignup, verifySignup } from "../emailAccountAuth";
import {
  establishLoginSession,
  requestEmailLoginOtp,
  verifyEmailLoginOtp,
} from "../otpAuthClient";
import {
  messageForOtpCode,
  OTP_INBOX_HINT,
  OTP_RESEND_COOLDOWN_SECONDS,
  type OtpAuthCode,
  OtpAuthException,
} from "../otpCodes";
import {
  displayNameError,
  emailToOtpIdentifier,
  isOtpCode,
  safeNextPath,
  usernameError,
} from "../otpIdentity";

type Mode = "login" | "signup";

const fieldClass =
  "w-full rounded-2xl border border-[#2b241f]/10 bg-white px-4 py-3 text-sm outline-none placeholder:opacity-50 focus:border-[#2b241f]/25";

export default function EmailOtpForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<OtpAuthCode | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [resendAt, setResendAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const awaitingCode = sentEmail !== null;
  const secondsLeft =
    resendAt == null ? 0 : Math.max(0, Math.ceil((resendAt - now) / 1000));

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  function startCooldown() {
    setResendAt(Date.now() + OTP_RESEND_COOLDOWN_SECONDS * 1000);
    setNow(Date.now());
  }

  function goBack() {
    setCode("");
    setSentEmail(null);
    setError(null);
    setFieldError(null);
  }

  async function sendCode(event?: React.FormEvent) {
    event?.preventDefault();
    if (busy || secondsLeft > 0) return;
    setError(null);
    setFieldError(null);

    const identifier = emailToOtpIdentifier(email);
    if (!identifier) {
      setError("INVALID_IDENTIFIER");
      return;
    }

    let displayName = "";
    let handle = "";
    if (mode === "signup") {
      displayName = name.trim();
      handle = username.trim();
      const nameProblem = displayNameError(displayName);
      const usernameProblem = usernameError(handle);
      if (nameProblem || usernameProblem) {
        setFieldError(nameProblem ?? usernameProblem);
        return;
      }
    }

    setBusy(true);
    try {
      const supabase = createClient();
      const result =
        mode === "signup"
          ? await requestSignup(supabase, {
              email: identifier,
              username: handle,
              displayName,
              emailRedirectTo: window.location.origin,
            })
          : await requestEmailLoginOtp(identifier);

      if (result === "SUCCESS") {
        router.replace(next);
        router.refresh();
        return;
      }

      setEmail(identifier);
      setSentEmail(identifier);
      setCode("");
      startCooldown();
    } catch (caught) {
      const authCode =
        caught instanceof OtpAuthException ? caught.code : "AUTH_ERROR";
      setError(authCode);
      if (authCode === "RATE_LIMITED") startCooldown();
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(event?: React.FormEvent) {
    event?.preventDefault();
    if (busy || !sentEmail) return;
    const token = code.trim();
    if (!isOtpCode(token)) {
      setError("INVALID_OTP");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const supabase = createClient();
      if (mode === "signup") {
        await verifySignup(supabase, sentEmail, token);
      } else {
        const tokens = await verifyEmailLoginOtp(sentEmail, token);
        await establishLoginSession(supabase, tokens);
      }
      setCode("");
      router.replace(next);
      router.refresh();
    } catch (caught) {
      const authCode =
        caught instanceof OtpAuthException ? caught.code : "AUTH_ERROR";
      setError(authCode);
      if (authCode === "RATE_LIMITED") startCooldown();
    } finally {
      setBusy(false);
    }
  }

  const otherHref =
    mode === "login"
      ? `/auth/signup?email=${encodeURIComponent(emailToOtpIdentifier(email) ?? "")}&next=${encodeURIComponent(next)}`
      : `/auth/login?email=${encodeURIComponent(emailToOtpIdentifier(email) ?? "")}&next=${encodeURIComponent(next)}`;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
          {mode === "login" ? "Welcome back" : "New dex"}
        </p>
        <div className="flex items-center gap-2">
          {awaitingCode ? (
            <button
              type="button"
              onClick={goBack}
              disabled={busy}
              aria-label="Edit email"
              className="flex size-9 items-center justify-center rounded-full border border-[#2b241f]/10 bg-white/70 disabled:opacity-50"
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </button>
          ) : null}
          <h1 className="text-4xl font-black tracking-[-0.04em]">
            {awaitingCode
              ? "Check your inbox"
              : mode === "login"
                ? "Log in"
                : "Create account"}
          </h1>
        </div>
      </div>

      {awaitingCode ? (
        <form onSubmit={submitCode} className="space-y-4">
          <p className="text-sm font-semibold">We sent a verification code.</p>
          <p className="text-sm leading-6 opacity-70">
            Enter the code sent to {sentEmail}.
          </p>
          <div>
            <label htmlFor="otp" className="mb-1.5 block text-sm font-semibold">
              Code
            </label>
            <input
              id="otp"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={code}
              disabled={busy}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className={`${fieldClass} tracking-[0.4em]`}
            />
            <p className="mt-2 text-sm leading-5 opacity-55">
              {OTP_INBOX_HINT}
            </p>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-[#2b241f] px-4 py-3 text-sm font-semibold text-[#fbf8f0] disabled:opacity-60"
          >
            {busy ? "Checking…" : "Verify code"}
          </button>
          <button
            type="button"
            onClick={() => sendCode()}
            disabled={busy || secondsLeft > 0}
            className="w-full rounded-full border border-[#2b241f]/10 bg-white px-4 py-3 text-sm font-semibold disabled:opacity-50"
          >
            {secondsLeft > 0 ? `Resend code in ${secondsLeft}s` : "Resend code"}
          </button>
        </form>
      ) : (
        <form onSubmit={sendCode} className="space-y-4">
          {mode === "signup" ? (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={20}
                  value={name}
                  disabled={busy}
                  onChange={(event) => setName(event.target.value)}
                  className={fieldClass}
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="mb-1.5 block text-sm font-semibold"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  autoComplete="username"
                  required
                  minLength={3}
                  maxLength={15}
                  pattern="[A-Za-z0-9_]+"
                  value={username}
                  disabled={busy}
                  onChange={(event) => setUsername(event.target.value)}
                  className={fieldClass}
                />
              </div>
            </>
          ) : null}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-semibold"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              disabled={busy}
              onChange={(event) => setEmail(event.target.value)}
              className={fieldClass}
            />
          </div>
          <button
            type="submit"
            disabled={busy || secondsLeft > 0}
            className="w-full rounded-full bg-[#2b241f] px-4 py-3 text-sm font-semibold text-[#fbf8f0] disabled:opacity-60"
          >
            {busy
              ? "Sending…"
              : secondsLeft > 0
                ? `Send code in ${secondsLeft}s`
                : "Send code"}
          </button>
        </form>
      )}

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium text-[#9a3412]">
          {messageForOtpCode(error)}
        </p>
      ) : null}
      {fieldError ? (
        <p role="alert" className="mt-4 text-sm font-medium text-[#9a3412]">
          {fieldError}
        </p>
      ) : null}

      {error === "UNKNOWN_USER" && mode === "login" ? (
        <Link
          href={otherHref}
          className="mt-3 inline-flex text-sm font-semibold underline"
        >
          Sign up
        </Link>
      ) : null}
      {error === "EMAIL_ALREADY_IN_USE" && mode === "signup" ? (
        <Link
          href={otherHref}
          className="mt-3 inline-flex text-sm font-semibold underline"
        >
          Log in instead
        </Link>
      ) : null}

      <p className="mt-6 text-sm opacity-65">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link href={otherHref} className="font-semibold underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href={otherHref} className="font-semibold underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
