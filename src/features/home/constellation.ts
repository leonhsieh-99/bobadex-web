import type { BrandIndexItem } from "@/features/brands/loadBrandIndex";
import { pickEvenSpread } from "./pickEvenSpread";

export const INNER_COUNT = 8;
export const OUTER_COUNT = 14;

export type BrandSearchItem = {
  slug: string;
  display: string;
  aliases: string[];
  icon_path: string | null;
};

export type ConstellationMark = BrandSearchItem & {
  ring: "inner" | "outer";
  left: string;
  top: string;
};

function ringPosition(
  index: number,
  count: number,
  radiusX: number,
  radiusY: number,
  rotation: number,
) {
  const angle = (index / count) * Math.PI * 2 + rotation;
  return {
    left: `${50 + Math.cos(angle) * radiusX}%`,
    top: `${48 + Math.sin(angle) * radiusY}%`,
  };
}

function asSearchItem(brand: BrandIndexItem): BrandSearchItem {
  return {
    slug: brand.slug,
    display: brand.display,
    aliases: brand.aliases,
    icon_path: brand.icon_path,
  };
}

export function toSearchIndex(brands: BrandIndexItem[]): BrandSearchItem[] {
  return brands.map(asSearchItem);
}

export function buildConstellation(
  brands: BrandIndexItem[],
): ConstellationMark[] {
  const inner = pickEvenSpread(brands, INNER_COUNT).map((brand, index) => ({
    ...asSearchItem(brand),
    ring: "inner" as const,
    ...ringPosition(index, INNER_COUNT, 28, 30, 0.2),
  }));
  const outer = pickEvenSpread([...brands].reverse(), OUTER_COUNT).map(
    (brand, index) => ({
      ...asSearchItem(brand),
      ring: "outer" as const,
      ...ringPosition(index, OUTER_COUNT, 46, 44, 0.4),
    }),
  );
  return [...inner, ...outer];
}
