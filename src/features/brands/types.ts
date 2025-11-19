export type BrandStatus = 'active' | 'retired'

export type Brand = {
  slug: string
  display: string
  aliases: Array<string>
  icon_path: string | undefined
  status: BrandStatus
}