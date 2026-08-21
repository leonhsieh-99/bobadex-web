import type { FeaturedBrand, MarketPresence } from "./types";

const MARKET_LEVEL_ORDER: Record<string, number> = {
  country: 0,
  metro: 1,
  admin1: 2,
  city: 3,
};

function nonemptyStrings(values: string[] | null | undefined) {
  return (values ?? []).map((value) => value.trim()).filter(Boolean);
}

function humanizeCategory(value: string) {
  return value
    .replace(/[_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function marketChips(
  presence: MarketPresence[] | null | undefined,
  limit = 4,
) {
  const ranked = [...(presence ?? [])]
    .filter((place) => place.name?.trim())
    .sort(
      (a, b) =>
        (MARKET_LEVEL_ORDER[a.level] ?? 9) - (MARKET_LEVEL_ORDER[b.level] ?? 9),
    );

  const seen = new Set<string>();
  const chips: string[] = [];

  for (const place of ranked) {
    const name = place.name.trim();
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    chips.push(name);
    if (chips.length >= limit) break;
  }

  return chips;
}

export function tagChips(
  brand: Pick<
    FeaturedBrand,
    "signature_products" | "known_for" | "product_categories"
  >,
  limit = 4,
) {
  const signature = nonemptyStrings(brand.signature_products);
  if (signature.length) return signature.slice(0, limit);

  const knownFor = nonemptyStrings(brand.known_for);
  if (knownFor.length) return knownFor.slice(0, limit);

  const categories = nonemptyStrings(brand.product_categories).map(
    humanizeCategory,
  );
  return categories.slice(0, limit);
}

export function originEyebrow(
  brand: Pick<FeaturedBrand, "founded_place" | "founded_year">,
) {
  const place = brand.founded_place?.trim() || null;
  const year = brand.founded_year ? String(brand.founded_year).trim() : "";

  if (place && year) return `Founded ${year} · ${place}`;
  if (year) return `Founded ${year}`;
  if (place) return place;
  return null;
}
