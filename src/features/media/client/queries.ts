import { createClient } from "@/utils/supabase/client";
import { ShopMedia } from "../types";

export async function fetchShopMedia(shopId: string): Promise<ShopMedia[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('shop_media')
    .select('id, shop_id, user_id, image_path, is_banner, visibility, created_at, comment')
    .eq('shop_id', shopId)

  if (error) throw error
  return (data ?? []) as ShopMedia[]
}