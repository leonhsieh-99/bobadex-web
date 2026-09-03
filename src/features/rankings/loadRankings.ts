import { unstable_cache } from "next/cache";
import { AUTH_ENABLED } from "@/features/auth/authEnabled";
import { createPublicClient } from "@/utils/supabase/public";
import { createClient } from "@/utils/supabase/server";
import { HOME_RANKING_PREVIEW, rankedBrands } from "./sortBrands";
import type { BrandRanking, UserBoard, UserRanking } from "./types";

type CatalogRow = {
  slug: string | null;
  display: string | null;
  icon_path: string | null;
  avg_rating: number | string | null;
  rating_count: number | string | null;
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
  table: "shops" | "brand_locations",
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

async function loadBrandRankings(): Promise<BrandRanking[]> {
  const supabase = createPublicClient();
  const [{ data: catalog, error }, shopCounts, storeCounts] = await Promise.all(
    [
      supabase
        .from("public_brand_catalog")
        .select("slug, display, icon_path, avg_rating, rating_count"),
      countByBrandSlug(supabase, "shops"),
      countByBrandSlug(supabase, "brand_locations", true),
    ],
  );

  if (error || !catalog) return [];

  return (catalog as CatalogRow[])
    .filter((row) => Boolean(row.slug && row.display))
    .map((row) => {
      const slug = row.slug as string;
      return {
        slug,
        display: row.display as string,
        icon_path: row.icon_path,
        avg_rating: asNumber(row.avg_rating),
        rating_count: asNumber(row.rating_count) ?? 0,
        shop_count: shopCounts.get(slug) ?? 0,
        store_count: storeCounts.get(slug) ?? 0,
      };
    });
}

export const getCachedBrandRankings = unstable_cache(
  loadBrandRankings,
  ["brand-rankings"],
  { revalidate: 60 * 60 },
);

export async function getHomepageBrandRankings() {
  const brands = await getCachedBrandRankings();
  return rankedBrands(brands, "rating").slice(0, HOME_RANKING_PREVIEW);
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
