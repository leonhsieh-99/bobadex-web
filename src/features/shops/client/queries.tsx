import { createClient } from "@/utils/supabase/client";
import { Shop } from "../types";

export async function fetchShopsByOwnerId(ownerId: string): Promise<Shop[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("shops")
    .select("*")
    .eq("user_id", ownerId)

  if (error) throw error;
  return (data ?? []) as Shop[];
}