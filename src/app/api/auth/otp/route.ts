import { AUTH_ENABLED } from "@/features/auth/authEnabled";

const ACTIONS = new Set(["requestEmailLoginOtp", "verifyEmailLoginOtp"]);

function json(body: { code: string }, status = 200) {
  return Response.json(body, { status });
}

/**
 * Same-origin proxy for the otp-auth edge function.
 * Its responses omit CORS headers, so the browser cannot read error codes directly.
 * This route does not log the request or the response.
 */
export async function POST(request: Request) {
  if (!AUTH_ENABLED) return json({ code: "AUTH_ERROR" }, 404);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return json({ code: "CONFIG_REQUIRED" }, 500);

  let incoming: unknown;
  try {
    incoming = await request.json();
  } catch {
    return json({ code: "INVALID_IDENTIFIER" }, 400);
  }

  const body = incoming as {
    action?: unknown;
    email?: unknown;
    code?: unknown;
  };
  if (typeof body.action !== "string" || !ACTIONS.has(body.action)) {
    return json({ code: "AUTH_ERROR" }, 400);
  }
  if (typeof body.email !== "string" || body.email.length > 254) {
    return json({ code: "INVALID_IDENTIFIER" }, 400);
  }

  const payload: { action: string; email: string; code?: string } = {
    action: body.action,
    email: body.email,
  };
  if (body.action === "verifyEmailLoginOtp") {
    if (typeof body.code !== "string")
      return json({ code: "INVALID_OTP" }, 400);
    payload.code = body.code;
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${url}/functions/v1/otp-auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
  } catch {
    return json({ code: "AUTH_ERROR" }, 502);
  }

  let parsed: unknown;
  try {
    parsed = await upstream.json();
  } catch {
    return json({ code: "AUTH_ERROR" }, 502);
  }

  const record =
    parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  if (!record || typeof record.code !== "string") {
    return json({ code: "AUTH_ERROR" }, upstream.ok ? 200 : upstream.status);
  }

  return Response.json(record, { status: upstream.status });
}
