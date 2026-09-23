export const BRAND_VISUALS = ["mascots", "minimal"] as const;

export type BrandVisuals = (typeof BRAND_VISUALS)[number];

export const DEFAULT_BRAND_VISUALS: BrandVisuals = "mascots";

export const BRAND_VISUALS_COOKIE = "bobadex_brand_visuals";
export const BRAND_VISUALS_STORAGE_KEY = "bobadex.brandVisuals";

export function parseBrandVisuals(
  value: string | null | undefined,
): BrandVisuals {
  return value === "minimal" ? "minimal" : DEFAULT_BRAND_VISUALS;
}

export function persistBrandVisuals(visuals: BrandVisuals) {
  try {
    window.localStorage.setItem(BRAND_VISUALS_STORAGE_KEY, visuals);
  } catch {
    /* private mode */
  }
}
