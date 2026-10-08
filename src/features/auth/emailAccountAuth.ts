import type { AuthError, SupabaseClient } from "@supabase/supabase-js";
import { type OtpAuthCode, OtpAuthException } from "./otpCodes";

function randomSecret() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function mapAuthError(error: AuthError): OtpAuthCode {
  const code = error.code ?? "";
  if (
    error.status === 429 ||
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit"
  ) {
    return "RATE_LIMITED";
  }
  if (code === "otp_expired") return "OTP_EXPIRED";
  if (
    code === "otp_disabled" ||
    code === "email_provider_disabled" ||
    code === "signup_disabled"
  ) {
    return "CONFIG_REQUIRED";
  }
  if (code === "user_already_exists" || code === "email_exists") {
    return "EMAIL_ALREADY_IN_USE";
  }
  if (code === "validation_failed" || code === "invalid_email") {
    return "INVALID_IDENTIFIER";
  }
  if (error.status === 403 || code === "otp_invalid") return "INVALID_OTP";
  return "AUTH_ERROR";
}

function isPermissionDenied(error: { code?: string; message?: string }) {
  return error.code === "42501";
}

async function rpcTaken(
  supabase: SupabaseClient,
  fn: "username_exists" | "email_exists",
  params: Record<string, string>,
) {
  const { data, error } = await supabase.rpc(fn, params);
  if (error) {
    // email_exists is revoked from anon on the current project. Signup still
    // calls it, then relies on Auth's empty-identities result for existing emails.
    if (fn === "email_exists" && isPermissionDenied(error)) return false;
    throw new OtpAuthException("AUTH_ERROR");
  }
  return data === true;
}

/**
 * New accounts only. Uses Supabase Auth email OTP, not the otp-auth function.
 * The generated password never leaves this function.
 */
export async function requestSignup(
  supabase: SupabaseClient,
  input: {
    email: string;
    username: string;
    displayName: string;
    emailRedirectTo: string;
  },
): Promise<OtpAuthCode> {
  const usernameTaken = await rpcTaken(supabase, "username_exists", {
    input_username: input.username,
  });
  if (usernameTaken) throw new OtpAuthException("USERNAME_TAKEN");

  const emailTaken = await rpcTaken(supabase, "email_exists", {
    input_email: input.email,
  });
  if (emailTaken) throw new OtpAuthException("EMAIL_ALREADY_IN_USE");

  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: randomSecret(),
    options: {
      data: {
        username: input.username,
        display_name: input.displayName,
      },
      emailRedirectTo: input.emailRedirectTo,
    },
  });

  if (error) throw new OtpAuthException(mapAuthError(error));
  if (data.user && data.user.identities?.length === 0) {
    throw new OtpAuthException("EMAIL_ALREADY_IN_USE");
  }
  if (data.session) return "SUCCESS";
  return "OTP_SENT";
}

export async function verifySignup(
  supabase: SupabaseClient,
  email: string,
  code: string,
) {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "signup",
  });
  if (error) throw new OtpAuthException(mapAuthError(error));
  if (!data.session) throw new OtpAuthException("AUTH_ERROR");
}
