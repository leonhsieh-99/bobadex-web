import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type OtpAuthCode,
  OtpAuthException,
  parseOtpAuthCode,
} from "./otpCodes";

type OtpSession = {
  access_token?: unknown;
  refresh_token?: unknown;
};

export type OtpLoginTokens = {
  userId: string;
  accessToken: string;
  refreshToken: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

async function invokeOtpAuth(body: {
  action: string;
  email: string;
  code?: string;
}) {
  let response: Response;
  try {
    response = await fetch("/api/auth/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new OtpAuthException("AUTH_ERROR");
  }

  let payload: Record<string, unknown> | null = null;
  try {
    payload = asRecord(await response.json());
  } catch {
    payload = null;
  }
  if (!payload) {
    throw new OtpAuthException(
      response.status === 429 ? "RATE_LIMITED" : "AUTH_ERROR",
    );
  }

  const code = parseOtpAuthCode(payload.code);
  if (code !== "OTP_SENT" && code !== "SUCCESS") {
    throw new OtpAuthException(code);
  }
  return payload;
}

function expectSent(payload: Record<string, unknown>): OtpAuthCode {
  const code = parseOtpAuthCode(payload.code);
  if (code !== "OTP_SENT" && code !== "SUCCESS") {
    throw new OtpAuthException(code);
  }
  return code;
}

export function parseOtpLoginSuccess(
  payload: Record<string, unknown>,
): OtpLoginTokens {
  const code = parseOtpAuthCode(payload.code);
  if (code !== "SUCCESS") throw new OtpAuthException(code);

  const userId = payload.user_id;
  const session = asRecord(payload.session) as OtpSession | null;
  const accessToken = session?.access_token;
  const refreshToken = session?.refresh_token;
  if (
    typeof userId !== "string" ||
    userId.length === 0 ||
    typeof accessToken !== "string" ||
    accessToken.length === 0 ||
    typeof refreshToken !== "string" ||
    refreshToken.length === 0
  ) {
    throw new OtpAuthException("AUTH_ERROR");
  }

  return { userId, accessToken, refreshToken };
}

/** Existing accounts only. Never creates a user. */
export async function requestEmailLoginOtp(email: string) {
  const payload = await invokeOtpAuth({
    action: "requestEmailLoginOtp",
    email,
  });
  return expectSent(payload);
}

export async function verifyEmailLoginOtp(email: string, code: string) {
  const payload = await invokeOtpAuth({
    action: "verifyEmailLoginOtp",
    email,
    code,
  });
  return parseOtpLoginSuccess(payload);
}

export async function establishLoginSession(
  supabase: SupabaseClient,
  tokens: OtpLoginTokens,
) {
  const { data, error } = await supabase.auth.setSession({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
  });
  if (error || data.user?.id !== tokens.userId) {
    await supabase.auth.signOut();
    throw new OtpAuthException("AUTH_ERROR");
  }
}
