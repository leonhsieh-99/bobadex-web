import { Star } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/features/brands/BrandMark";
import type { BrandRankBy, BrandRanking } from "./types";

function ratingLabel(brand: BrandRanking) {
  if (brand.avg_rating == null || brand.rating_count <= 0) return "Unrated";
  return brand.avg_rating.toFixed(1);
}

function metricCopy(brand: BrandRanking, by: BrandRankBy) {
  if (by === "shops") {
    return `${brand.shop_count} ${brand.shop_count === 1 ? "logged shop" : "logged shops"}`;
  }
  if (by === "stores") {
    return `${brand.store_count} ${brand.store_count === 1 ? "store" : "stores"}`;
  }
  const count = brand.rating_count;
  return `${count} ${count === 1 ? "rating" : "ratings"}`;
}

const emptyCopy: Record<BrandRankBy, string> = {
  rating: "No brands have three rated shops yet.",
  shops: "No logged shops to rank yet.",
  stores: "No mapped stores to rank yet.",
};

export function BrandRankList({
  brands,
  by,
  compact = false,
}: {
  brands: BrandRanking[];
  by: BrandRankBy;
  compact?: boolean;
}) {
  if (brands.length === 0) {
    return (
      <p className="rounded-[1.6rem] border border-[#2b241f]/10 bg-white/50 p-8 text-sm opacity-70">
        {emptyCopy[by]}
      </p>
    );
  }

  return (
    <ol className="divide-y divide-[#2b241f]/10 overflow-hidden rounded-[1.8rem] border border-[#2b241f]/10 bg-white/55">
      {brands.map((brand, index) => {
        const showRating = by === "rating";
        return (
          <li key={brand.slug}>
            <Link
              href={`/brands/${brand.slug}`}
              className={`flex items-center gap-3 transition-colors hover:bg-white/80 ${
                compact ? "px-4 py-3" : "px-4 py-3.5 sm:px-5"
              }`}
            >
              <span className="w-7 shrink-0 text-center text-sm font-black tabular-nums opacity-55">
                {index + 1}
              </span>
              <span
                className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-1 ${
                  compact ? "size-11" : "size-12 sm:size-14"
                }`}
              >
                <BrandMark
                  iconPath={brand.icon_path}
                  name={brand.display}
                  size={256}
                  displaySize={compact ? 44 : 56}
                  eager={index < 5}
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-bold tracking-[-0.02em]">
                  {brand.display}
                </span>
                <span className="mt-0.5 block text-sm opacity-55">
                  {metricCopy(brand, by)}
                </span>
              </span>
              {showRating ? (
                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold">
                  <Star
                    className="size-3.5 fill-[#f0b429] text-[#f0b429]"
                    aria-hidden="true"
                  />
                  {ratingLabel(brand)}
                </span>
              ) : (
                <span className="shrink-0 text-sm font-bold tabular-nums">
                  {by === "shops" ? brand.shop_count : brand.store_count}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
