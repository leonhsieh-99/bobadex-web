import type { BrandRankBy, BrandRanking } from "./types";

export const MIN_RATING_COUNT = 3;
export const RANKING_LIMIT = 100;
export const HOME_RANKING_PREVIEW = 5;

function compareRating(a: BrandRanking, b: BrandRanking) {
  const ratingDiff = (b.avg_rating ?? 0) - (a.avg_rating ?? 0);
  if (ratingDiff !== 0) return ratingDiff;
  if (b.rating_count !== a.rating_count) return b.rating_count - a.rating_count;
  return a.display.localeCompare(b.display);
}

export function parseRankBy(value: string | string[] | undefined): BrandRankBy {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "shops" || raw === "stores") return raw;
  return "rating";
}

export function rankedBrands(brands: BrandRanking[], by: BrandRankBy) {
  const rows = brands.filter((brand) => {
    if (by === "rating") {
      return brand.avg_rating != null && brand.rating_count >= MIN_RATING_COUNT;
    }
    if (by === "shops") return brand.shop_count > 0;
    return brand.store_count > 0;
  });

  rows.sort((a, b) => {
    if (by === "rating") return compareRating(a, b);
    if (by === "shops") {
      if (b.shop_count !== a.shop_count) return b.shop_count - a.shop_count;
      return compareRating(a, b);
    }
    if (b.store_count !== a.store_count) return b.store_count - a.store_count;
    return compareRating(a, b);
  });

  return rows.slice(0, RANKING_LIMIT);
}
