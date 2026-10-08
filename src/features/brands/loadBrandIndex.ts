import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/utils/supabase/public";
import type { BrandPlace } from "./brandSearch";

export type { BrandPlace };

export type BrandIndexItem = {
  slug: string;
  display: string;
  icon_path: string | null;
  aliases: string[];
  places: BrandPlace[];
  has_profile: boolean;
};

function groupAliases(
  aliases: Array<{
    brand_slug: string | null;
    alias_display: string | null;
  }> | null,
) {
  const aliasesBySlug = new Map<string, string[]>();
  for (const row of aliases ?? []) {
    if (!row.brand_slug || !row.alias_display) continue;
    const list = aliasesBySlug.get(row.brand_slug) ?? [];
    list.push(row.alias_display);
    aliasesBySlug.set(row.brand_slug, list);
  }
  return aliasesBySlug;
}

function groupPlaces(rows: unknown) {
  const placesBySlug = new Map<string, BrandPlace[]>();
  if (!Array.isArray(rows)) return placesBySlug;

  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const record = row as { brand_slug?: unknown; places?: unknown };
    const slug = typeof record.brand_slug === "string" ? record.brand_slug : "";
    if (!slug || !Array.isArray(record.places)) continue;

    const places: BrandPlace[] = [];
    for (const place of record.places) {
      if (!place || typeof place !== "object") continue;
      const city =
        "city" in place && typeof place.city === "string"
          ? place.city.trim()
          : "";
      const state =
        "state" in place && typeof place.state === "string"
          ? place.state.trim()
          : "";
      if (!city) continue;
      places.push({ city, state });
    }
    if (places.length) placesBySlug.set(slug, places);
  }

  return placesBySlug;
}

export async function loadBrandIndex(): Promise<BrandIndexItem[]> {
  const supabase = createPublicClient();

  const [
    { data: catalog, error: catalogError },
    { data: aliases },
    placesResult,
  ] = await Promise.all([
    supabase
      .from("public_brand_catalog")
      .select("slug, display, icon_path, has_profile")
      .order("display"),
    supabase.from("brand_aliases").select("brand_slug, alias_display"),
    supabase.rpc("brand_search_places"),
  ]);

  const aliasesBySlug = groupAliases(aliases);
  const placesBySlug = groupPlaces(
    placesResult.error ? null : placesResult.data,
  );

  if (catalogError || !catalog) {
    const { data: brands, error } = await supabase
      .from("brands")
      .select("slug, display, icon_path")
      .eq("status", "active")
      .order("display");

    if (error || !brands) return [];

    return brands
      .filter((brand) => Boolean(brand.slug && brand.display))
      .map((brand) => ({
        slug: brand.slug as string,
        display: brand.display as string,
        icon_path: (brand.icon_path as string | null) ?? null,
        aliases: aliasesBySlug.get(brand.slug as string) ?? [],
        places: placesBySlug.get(brand.slug as string) ?? [],
        has_profile: false,
      }));
  }

  return catalog
    .filter((brand) => Boolean(brand.slug && brand.display))
    .map((brand) => ({
      slug: brand.slug as string,
      display: brand.display as string,
      icon_path: (brand.icon_path as string | null) ?? null,
      aliases: aliasesBySlug.get(brand.slug as string) ?? [],
      places: placesBySlug.get(brand.slug as string) ?? [],
      has_profile: Boolean(brand.has_profile),
    }));
}

export const getCachedBrandIndex = unstable_cache(
  loadBrandIndex,
  ["brand-index-v2"],
  { revalidate: 60 * 60 },
);
