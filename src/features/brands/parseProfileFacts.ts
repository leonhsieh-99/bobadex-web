import type { MarketPresence } from "@/features/home/types";
import type { BrandFact, BrandProfileFacts } from "./types";

const HERO_KEYS = new Set([
  "founded",
  "founded_place",
  "founded_year",
  "year_established",
  "origin",
  "market_presence",
  "markets",
  "signature_products",
  "known_for",
  "product_categories",
  "aliases",
  "also_known_as",
  "aka",
  "public_summary",
  "summary",
  "slug",
  "display",
  "icon_path",
  "sources",
  "citations",
  "confidence",
  "raw",
]);

const EXTRA_LABELS: Record<string, string> = {
  headquarters: "Headquarters",
  hq: "Headquarters",
  parent_company: "Parent company",
  parent: "Parent company",
  website: "Website",
  url: "Website",
  store_count: "Locations",
  locations_count: "Locations",
  estimated_locations: "Locations",
  origin_country: "Origin",
  country_of_origin: "Origin",
};

export function emptyProfileFacts(): BrandProfileFacts {
  return {
    founded_place: null,
    founded_year: null,
    market_presence: [],
    signature_products: [],
    known_for: [],
    product_categories: [],
    aliases: [],
    extras: [],
  };
}

export function parseProfileFacts(raw: unknown): BrandProfileFacts {
  const facts = asRecord(raw);
  if (!facts) return emptyProfileFacts();

  const foundedPlace =
    asTrimmedString(facts.founded_place) ??
    asTrimmedString(facts.origin) ??
    null;
  const foundedYear =
    asYear(facts.founded_year) ?? asYear(facts.year_established);

  const extras: BrandFact[] = [];
  for (const [key, value] of Object.entries(facts)) {
    if (HERO_KEYS.has(key)) continue;
    const rendered = renderExtraValue(value);
    if (!rendered) continue;
    extras.push({
      label: EXTRA_LABELS[key] ?? humanizeKey(key),
      value: rendered,
    });
    if (extras.length >= 2) break;
  }

  return {
    founded_place: foundedPlace,
    founded_year: foundedYear,
    market_presence: asMarketPresence(facts.market_presence ?? facts.markets),
    signature_products: asStringArray(facts.signature_products),
    known_for: asStringArray(facts.known_for),
    product_categories: asStringArray(facts.product_categories),
    aliases: asStringArray(facts.aliases ?? facts.also_known_as ?? facts.aka),
    extras,
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value) return null;
  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      return asRecord(parsed);
    } catch {
      return null;
    }
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function asTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function asYear(value: unknown): number | string | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) return value.trim();
  return null;
}

function asStringArray(value: unknown): string[] {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function asMarketPresence(value: unknown): MarketPresence[] {
  if (!Array.isArray(value)) return [];
  const places: MarketPresence[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const name = asTrimmedString(record.name);
    if (!name) continue;
    places.push({
      name,
      level: typeof record.level === "string" ? record.level : "city",
      country_code:
        typeof record.country_code === "string" ? record.country_code : null,
    });
  }
  return places;
}

function renderExtraValue(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }
  if (typeof value === "string") {
    return asTrimmedString(value);
  }
  if (Array.isArray(value)) {
    const items = asStringArray(value);
    return items.length ? items.slice(0, 4).join(", ") : null;
  }
  return null;
}

function humanizeKey(key: string) {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
