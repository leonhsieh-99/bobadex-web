import type { MarketPresence } from "@/features/home/types";

export type BrandStatus = "active" | "retired";

export type Brand = {
  slug: string;
  display: string;
  aliases: Array<string>;
  icon_path: string | undefined;
  status: BrandStatus;
};

export type PublicBrand = {
  slug: string;
  display: string;
  icon_path: string | undefined;
  icon_256_path: string | undefined;
  icon_512_path: string | undefined;
  avg_rating: number | null;
  rating_count: number | null;
  has_profile: boolean;
  public_summary: string | null;
};

export type BrandFact = {
  label: string;
  value: string;
};

export type BrandProfileFacts = {
  founded_place: string | null;
  founded_year: number | string | null;
  market_presence: MarketPresence[];
  signature_products: string[];
  known_for: string[];
  product_categories: string[];
  aliases: string[];
  extras: BrandFact[];
  observed_at: string | null;
};

export type BrandDetail = {
  slug: string;
  display: string;
  icon_path: string | null;
  avg_rating: number | null;
  rating_count: number | null;
  has_profile: boolean;
  public_summary: string | null;
  facts: BrandProfileFacts;
};

export type BrandGalleryPhoto = {
  id: string;
  image_path: string;
  comment: string | null;
};
