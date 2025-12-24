export type Drink = {
  id: string
  shop_id: string
  user_id: string
  name: string
  rating: number | null
  is_favorite: boolean | null
  visibility: 'private' | 'public' | null
  created_at: string | null
  notes: string | null
}