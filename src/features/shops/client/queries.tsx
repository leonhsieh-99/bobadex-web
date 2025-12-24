import { createClient } from "@/utils/supabase/client";
import { Shop, ShopCard } from "../types"

export async function fetchShopsByOwnerId(ownerId: string): Promise<Shop[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .eq("user_id", ownerId)

  if (error) throw error;
  return (data ?? []) as Shop[];
}

export async function fetchShopBannersByOwnerId(ownerId: string): Promise<ShopCard[]> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('shops_with_banner', { p_user_id: ownerId })
  if (error) throw error
  return (data ?? []) as ShopCard[]
}