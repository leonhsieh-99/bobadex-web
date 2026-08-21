export type MarketPresence = {
  name: string;
  level: "country" | "admin1" | "metro" | "city" | string;
  country_code?: string | null;
};

export type FeaturedBrand = {
  slug: string;
  display: string;
  icon_path: string;
  public_summary: string;
  founded_place?: string | null;
  founded_year?: number | string | null;
  market_presence: MarketPresence[];
  signature_products: string[];
  known_for: string[];
  product_categories: string[];
  accent: string;
  mascotBackdrop: string;
};
