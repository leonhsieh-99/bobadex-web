export function userInitials(
  displayName?: string | null,
  username?: string | null,
  email?: string | null,
) {
  const source = displayName?.trim() || username?.trim();
  if (source) {
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
    }
    return source.slice(0, 2).toUpperCase();
  }

  const local = email?.split("@")[0]?.trim();
  if (local) return local.slice(0, 1).toUpperCase();
  return "G";
}
