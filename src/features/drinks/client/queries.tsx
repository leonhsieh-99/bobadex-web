import { createClient } from "@/utils/supabase/client";
import { Drink } from "../types";

export async function fetchDrinksByShopId(shopId: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from('drinks').select().eq('shop_id', shopId)

  if (error) throw error
  return (data ?? []) as Drink[]
}