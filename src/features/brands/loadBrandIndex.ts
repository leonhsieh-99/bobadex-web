import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/utils/supabase/public";

export type BrandIndexItem = {
  slug: string;
  display: string;
  icon_path: string | null;
  aliases: string[];
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

export async function loadBrandIndex(): Promise<BrandIndexItem[]> {
  const supabase = createPublicClient();

  const [{ data: catalog, error: catalogError }, { data: aliases }] =
    await Promise.all([
      supabase
        .from("public_brand_catalog")
        .select("slug, display, icon_path, has_profile")
        .order("display"),
      supabase.from("brand_aliases").select("brand_slug, alias_display"),
    ]);

  const aliasesBySlug = groupAliases(aliases);

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
      has_profile: Boolean(brand.has_profile),
    }));
}

export const getCachedBrandIndex = unstable_cache(
  loadBrandIndex,
  ["brand-index"],
  { revalidate: 60 * 60 },
);
