import type { BrandRankBy, BrandRanking } from "./types";

export const MIN_RATING_COUNT = 3;
export const RANKING_LIMIT = 100;
export const HOME_RANKING_PREVIEW = 5;

const RANK_VALUES: BrandRankBy[] = [
  "locations",
  "score",
  "rating",
  "collected",
];

export function parseRankBy(value: string | string[] | undefined): BrandRankBy {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "stores") return "locations";
  if (raw === "shops") return "collected";
  if (raw && RANK_VALUES.includes(raw as BrandRankBy)) {
    return raw as BrandRankBy;
  }
  return "locations";
}

function metricValue(brand: BrandRanking, by: BrandRankBy) {
  if (by === "locations") {
    return brand.location_count > 0 ? brand.location_count : null;
  }
  if (by === "collected") {
    return brand.collector_count > 0 ? brand.collector_count : null;
  }
  if (by === "rating") {
    if (brand.avg_rating == null || brand.rating_count < MIN_RATING_COUNT) {
      return null;
    }
    return brand.avg_rating;
  }
  return brand.community_score;
}

export function rankedBrands(brands: BrandRanking[], by: BrandRankBy) {
  const rows = brands.filter((brand) => metricValue(brand, by) != null);

  rows.sort((a, b) => {
    const diff = (metricValue(b, by) ?? 0) - (metricValue(a, by) ?? 0);
    if (diff !== 0) return diff;
    return a.display.localeCompare(b.display);
  });

  return rows.slice(0, RANKING_LIMIT);
}
