export type BrandStatus = 'active' | 'retired'

export type Brand = {
  slug: string
  display: string
  aliases: Array<string>
  icon_path: string | undefined
  status: BrandStatus
}

export type PublicBrand = {
  slug: string
  display: string
  icon_path: string | undefined
  icon_256_path: string | undefined
  icon_512_path: string | undefined
  avg_rating: number | null
  rating_count: number | null
  has_profile: boolean
}