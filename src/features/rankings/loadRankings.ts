import { unstable_cache } from "next/cache";
import { AUTH_ENABLED } from "@/features/auth/authEnabled";
import { createPublicClient } from "@/utils/supabase/public";
import { createClient } from "@/utils/supabase/server";
import { communityScore } from "./communityScore";
import { HOME_RANKING_PREVIEW, rankedBrands } from "./sortBrands";
import type { BrandRanking, UserBoard, UserRanking } from "./types";

type CatalogRow = {
  slug: string | null;
  display: string | null;
  icon_path: string | null;
  avg_rating: number | string | null;
  rating_count: number | string | null;
};

type ShopAggregate = {
  ratingSum: number;
  ratingCount: number;
  collectors: Set<string>;
};

const PAGE_SIZE = 1000;

function asNumber(value: number | string | null | undefined) {
  if (value == null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function bumpCount(counts: Map<string, number>, slug: string | null) {
  if (!slug) return;
  counts.set(slug, (counts.get(slug) ?? 0) + 1);
}

async function countByBrandSlug(
  supabase: ReturnType<typeof createPublicClient>,
  table: "brand_locations",
  statusFilter = false,
) {
  const counts = new Map<string, number>();
  let from = 0;
  let applyStatus = statusFilter;

  while (true) {
    let query = supabase
      .from(table)
      .select("brand_slug")
      .range(from, from + PAGE_SIZE - 1);

    if (applyStatus) query = query.eq("physical_status", "active");

    const { data, error } = await query;

    if (error) {
      if (applyStatus && from === 0) {
        applyStatus = false;
        continue;
      }
      break;
    }

    if (!data?.length) break;
    for (const row of data) bumpCount(counts, row.brand_slug as string | null);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return counts;
}

async function loadShopAggregates(
  supabase: ReturnType<typeof createPublicClient>,
) {
  const byBrand = new Map<string, ShopAggregate>();
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("shops")
      .select("brand_slug, user_id, rating")
      .order("id")
      .range(from, from + PAGE_SIZE - 1);

    if (error || !data?.length) {
      if (error && from === 0) return null;
      break;
    }

    for (const row of data) {
      const slug = row.brand_slug as string | null;
      if (!slug) continue;
      let aggregate = byBrand.get(slug);
      if (!aggregate) {
        aggregate = { ratingSum: 0, ratingCount: 0, collectors: new Set() };
        byBrand.set(slug, aggregate);
      }
      const userId = row.user_id as string | null;
      if (userId) aggregate.collectors.add(userId);
      const rating = asNumber(row.rating as number | string | null);
      if (rating == null) continue;
      aggregate.ratingSum += rating;
      aggregate.ratingCount += 1;
    }

    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return byBrand;
}

function weightedMean(rows: CatalogRow[]) {
  let sum = 0;
  let count = 0;
  for (const row of rows) {
    const average = asNumber(row.avg_rating);
    const ratingCount = asNumber(row.rating_count) ?? 0;
    if (average == null || ratingCount <= 0) continue;
    sum += average * ratingCount;
    count += ratingCount;
  }
  return count > 0 ? sum / count : 0;
}

async function loadBrandRankings(): Promise<BrandRanking[]> {
  const supabase = createPublicClient();
  const [{ data: catalog, error }, locationCounts, shopAggregates] =
    await Promise.all([
      supabase
        .from("public_brand_catalog")
        .select("slug, display, icon_path, avg_rating, rating_count"),
      countByBrandSlug(supabase, "brand_locations", true),
      loadShopAggregates(supabase),
    ]);

  if (error || !catalog) return [];

  const rows = (catalog as CatalogRow[]).filter((row) =>
    Boolean(row.slug && row.display),
  );

  let meanRating = 0;
  if (shopAggregates) {
    let sum = 0;
    let count = 0;
    for (const row of rows) {
      const aggregate = shopAggregates.get(row.slug as string);
      if (!aggregate || aggregate.ratingCount <= 0) continue;
      sum += aggregate.ratingSum;
      count += aggregate.ratingCount;
    }
    meanRating = count > 0 ? sum / count : 0;
  } else {
    meanRating = weightedMean(rows);
  }

  return rows.map((row) => {
    const slug = row.slug as string;
    const aggregate = shopAggregates?.get(slug);
    const ratingCount =
      aggregate?.ratingCount ?? asNumber(row.rating_count) ?? 0;
    const average =
      aggregate && aggregate.ratingCount > 0
        ? aggregate.ratingSum / aggregate.ratingCount
        : asNumber(row.avg_rating);

    return {
      slug,
      display: row.display as string,
      icon_path: row.icon_path,
      avg_rating: ratingCount > 0 ? average : null,
      rating_count: ratingCount,
      collector_count: aggregate?.collectors.size ?? 0,
      location_count: locationCounts.get(slug) ?? 0,
      community_score: communityScore(average, ratingCount, meanRating),
    };
  });
}

export const getCachedBrandRankings = unstable_cache(
  loadBrandRankings,
  ["brand-rankings-v2"],
  { revalidate: 60 * 60 },
);

export async function getHomepageBrandRankings() {
  const brands = await getCachedBrandRankings();
  return rankedBrands(brands, "locations").slice(0, HOME_RANKING_PREVIEW);
}

function parseUserRanking(row: Record<string, unknown>): UserRanking | null {
  const id = typeof row.id === "string" ? row.id : null;
  const displayName =
    typeof row.display_name === "string" ? row.display_name.trim() : "";
  const username = typeof row.username === "string" ? row.username.trim() : "";
  if (!id || !displayName) return null;

  return {
    id,
    displayName,
    username,
    profileImagePath:
      typeof row.profile_image_path === "string"
        ? row.profile_image_path
        : null,
    shopCount: asNumber(row.shop_count as number | string | null) ?? 0,
  };
}

export async function loadUserBoard(): Promise<UserBoard> {
  if (!AUTH_ENABLED) return { status: "coming-soon" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { status: "sign-in" };

  const { data, error } = await supabase.rpc("get_user_rankings");
  if (error || !Array.isArray(data)) return { status: "ready", users: [] };

  return {
    status: "ready",
    users: data
      .map((row) => parseUserRanking(row as Record<string, unknown>))
      .filter((row): row is UserRanking => row != null),
  };
}
