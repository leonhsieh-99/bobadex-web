const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_]+$/;

export function emailToOtpIdentifier(raw: string): string | null {
  const email = raw.trim().toLowerCase();
  if (email.length === 0 || email.length > 254) return null;
  if (!EMAIL_PATTERN.test(email)) return null;
  return email;
}

export function isOtpCode(raw: string) {
  return /^[0-9]{6}$/.test(raw.trim());
}

export function displayNameError(raw: string): string | null {
  const name = raw.trim();
  if (name.length < 2) return "Name must be 2–20 characters.";
  if (name.length > 20) return "Name must be 2–20 characters.";
  return null;
}

export function usernameError(raw: string): string | null {
  const username = raw.trim();
  if (username.length < 3 || username.length > 15) {
    return "Username must be 3–15 characters.";
  }
  if (!USERNAME_PATTERN.test(username)) {
    return "Usernames use letters, numbers, and underscores.";
  }
  return null;
}

export function safeNextPath(raw: string | null | undefined) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}
