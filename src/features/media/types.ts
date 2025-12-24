export type ShopMedia = {
  id: string
  shop_id: string
  user_id: string
  image_path: string
  is_banner: boolean | null
  visibility: 'public' | 'private' | null
  created_at: string | null
  comment: string | null
}