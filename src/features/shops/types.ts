export type Shop = {
  id: string
  user_id: string
  name: string
  rating: number | null
  is_favorite: boolean | null
  brand_slug: string | null
  notes: string | null
  pinned_drink_id: string | null
  created_at: Date | null
}

export type ShopCard = {
  shop_id: string;
  name: string;
  rating: number | null;
  banner_media_id: string | null;
  banner_path: string | null;
};