/** Stable codes from otp-auth and the signup client. UI renders these, not provider text. */
export const OTP_AUTH_CODES = [
  "OTP_SENT",
  "SUCCESS",
  "INVALID_IDENTIFIER",
  "UNKNOWN_USER",
  "EMAIL_ALREADY_IN_USE",
  "EMAIL_UNCHANGED",
  "CURRENT_EMAIL_MISMATCH",
  "USERNAME_TAKEN",
  "INVALID_OTP",
  "OTP_EXPIRED",
  "RATE_LIMITED",
  "AUTH_REQUIRED",
  "CONFIG_REQUIRED",
  "AUTH_ERROR",
] as const;

export type OtpAuthCode = (typeof OTP_AUTH_CODES)[number];

const CODE_SET = new Set<string>(OTP_AUTH_CODES);

export function parseOtpAuthCode(raw: unknown): OtpAuthCode {
  return typeof raw === "string" && CODE_SET.has(raw)
    ? (raw as OtpAuthCode)
    : "AUTH_ERROR";
}

export class OtpAuthException extends Error {
  readonly code: OtpAuthCode;

  constructor(code: OtpAuthCode) {
    super(code);
    this.name = "OtpAuthException";
    this.code = code;
  }
}

export function messageForOtpCode(code: OtpAuthCode): string {
  switch (code) {
    case "OTP_SENT":
      return "We sent a verification code.";
    case "SUCCESS":
      return "You are signed in.";
    case "INVALID_IDENTIFIER":
      return "Enter a valid email.";
    case "UNKNOWN_USER":
      return "No account uses that email. Sign up to create one.";
    case "EMAIL_ALREADY_IN_USE":
      return "That email is already used by an account.";
    case "EMAIL_UNCHANGED":
      return "That is already your email.";
    case "CURRENT_EMAIL_MISMATCH":
      return "Enter the email currently on this account.";
    case "USERNAME_TAKEN":
      return "That username is taken.";
    case "INVALID_OTP":
      return "That code is incorrect.";
    case "OTP_EXPIRED":
      return "That code has expired. Request a new one.";
    case "RATE_LIMITED":
      return "Too many codes were sent. Wait a minute, then try again.";
    case "AUTH_REQUIRED":
      return "Sign in again to continue.";
    case "CONFIG_REQUIRED":
      return "Could not send the email. Try again in a minute.";
    case "AUTH_ERROR":
      return "Something went wrong. Please try again.";
  }
}

export const OTP_INBOX_HINT =
  "Can take a few seconds. Check spam if you don't see it.";

export const OTP_RESEND_COOLDOWN_SECONDS = 60;

export function isVerifyStepCode(code: OtpAuthCode) {
  return code === "INVALID_OTP" || code === "OTP_EXPIRED";
}
