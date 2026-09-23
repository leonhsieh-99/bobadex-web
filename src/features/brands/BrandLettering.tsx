import { brandAccentForSlug } from "./brandAccent";
import { brandInitials } from "./brandInitials";

export function BrandLettering({
  name,
  slug,
  size,
}: {
  name: string;
  slug?: string | null;
  size: number;
}) {
  const initials = brandInitials(name);
  const palette = brandAccentForSlug(slug || name.toLowerCase());
  const fontSize = Math.max(11, size * (initials.length > 1 ? 0.38 : 0.46));

  return (
    <span
      aria-hidden="true"
      className={`flex h-full w-full items-center justify-center rounded-[inherit] bg-gradient-to-br ${palette.accent} font-black tracking-[-0.06em] text-[#2b241f]`}
      style={{ fontSize }}
    >
      {initials}
    </span>
  );
}
