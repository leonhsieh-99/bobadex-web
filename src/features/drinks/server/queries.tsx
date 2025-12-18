import { createClient } from "@/utils/supabase/server";

export default async function getDrinksByShopId(shopId: string) {
  const supabase = await createClient()
  return supabase.from('drinks').select().eq('shop_id', shopId)
}