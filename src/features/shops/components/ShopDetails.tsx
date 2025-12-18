'use client'

import { fetchDrinksByShopId } from "@/features/drinks/client/queries"
import { Drink } from "@/features/drinks/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Shop } from "../types"

export default function ShopDetails({ shopId }: { shopId: string }) {
  const qc = useQueryClient()
  const allCached = qc.getQueriesData<Shop[]>({ queryKey: ["shops"] });
  const shop =
    allCached
      .flatMap(([, data]) => data ?? [])
      .find((s) => s.id === shopId);
  
  const { data: drinks, isLoading, error } = useQuery<Drink[]>({
    queryKey: ['drinks', shopId],
    queryFn: () => fetchDrinksByShopId(shopId),
    enabled: !!shopId
  })

  if (!shop) return <div className="p-4 text-sm opacity-70">Select a shop</div>;

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="text-xl font-semibold">{shop.name}</div>
        <div className="text-sm opacity-70">Rating: {shop.rating ?? "—"}</div>
      </div>

      <div>
        <div className="font-medium mb-2">Drinks</div>
        {isLoading ? (
          <div className="text-sm opacity-70">Loading drinks…</div>
        ) : (
          <ul className="space-y-2">
            {(drinks ?? []).map((d) => (
              <li key={d.id} className="border rounded-lg p-2">
                <div className="font-medium">{d.name}</div>
                <div className="text-sm opacity-70">Rating: {d.rating ?? "—"}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}