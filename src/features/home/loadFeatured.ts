import { unstable_cache } from "next/cache";
import { brandAccentForSlug } from "@/features/brands/brandAccent";
import { parseProfileFacts } from "@/features/brands/parseProfileFacts";
import { getCachedBrandRankings } from "@/features/rankings/loadRankings";
import { createPublicClient } from "@/utils/supabase/public";
import {
  MIN_FEATURED_STORES,
  pacificCalendar,
  pickFeaturedSlugs,
} from "./pickFeatured";
import type { FeaturedBrand } from "./types";

type ProfileRow = {
  brand_slug: string | null;
  public_summary: string | null;
  profile_facts: unknown;
};

function asTrimmed(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function isEnriched(
  summary: string | null,
  facts: ReturnType<typeof parseProfileFacts>,
) {
  if (!summary || summary.length < 40) return false;
  if (facts.founded_place || facts.founded_year) return true;
  if (facts.market_presence.length > 0) return true;
  return Boolean(
    facts.signature_products.length ||
      facts.known_for.length ||
      facts.product_categories.length,
  );
}

async function loadFeaturedForDay(dayKey: string): Promise<FeaturedBrand[]> {
  const requested = dayKeyToCalendar(dayKey) ?? pacificCalendar();
  const rankings = await getCachedBrandRankings();
  const withStores = rankings.filter(
    (brand) =>
      brand.store_count >= MIN_FEATURED_STORES && Boolean(brand.icon_path),
  );
  if (withStores.length === 0) return [];

  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("brand_profiles")
    .select("brand_slug, public_summary, profile_facts")
    .in(
      "brand_slug",
      withStores.map((brand) => brand.slug),
    );

  if (error || !data) return [];

  const profiles = new Map(
    (data as ProfileRow[])
      .filter((row) => row.brand_slug)
      .map((row) => [row.brand_slug as string, row]),
  );

  const eligible = withStores.filter((brand) => {
    const profile = profiles.get(brand.slug);
    if (!profile) return false;
    const summary = asTrimmed(profile.public_summary);
    return isEnriched(summary, parseProfileFacts(profile.profile_facts));
  });

  const slugs = pickFeaturedSlugs(
    eligible.map((brand) => brand.slug),
    requested,
  );
  const bySlug = new Map(eligible.map((brand) => [brand.slug, brand]));

  return slugs.flatMap((slug) => {
    const brand = bySlug.get(slug);
    const profile = profiles.get(slug);
    const summary = asTrimmed(profile?.public_summary);
    const iconPath = brand?.icon_path;
    if (!brand || !profile || !summary || !iconPath) return [];

    const facts = parseProfileFacts(profile.profile_facts);
    const palette = brandAccentForSlug(slug);

    return [
      {
        slug,
        display: brand.display,
        icon_path: iconPath,
        public_summary: summary,
        founded_place: facts.founded_place,
        founded_year: facts.founded_year,
        market_presence: facts.market_presence,
        signature_products: facts.signature_products,
        known_for: facts.known_for,
        product_categories: facts.product_categories,
        accent: palette.accent,
        mascotBackdrop: palette.mascotBackdrop,
      },
    ];
  });
}

function dayKeyToCalendar(dayKey: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return pacificCalendar(new Date(Date.UTC(year, month - 1, day, 20)));
}

const getCachedFeaturedForDay = unstable_cache(
  loadFeaturedForDay,
  ["featured-brands", "v2"],
  { revalidate: 60 * 60 },
);

export async function getTodaysFeaturedBrands() {
  return getCachedFeaturedForDay(pacificCalendar().dayKey);
}
