"use client";

import { useQuery } from "@tanstack/react-query";
import { Shop } from "@/features/shops/types";
import React, { useMemo } from "react";
import { fetchShopsByOwnerId } from "@/features/shops/client/queries";
import ShopsView from "@/features/shops/components/ShopsView";
import { useBrands } from "@/features/brands/useBrands";

export default function DashboardShell({
  ownerId,
  isOwner,
  children
} : {
  ownerId: string,
  isOwner: boolean,
  children: React.ReactNode
}) {
  const { data: shops, isLoading, error } = useQuery<Shop[]>({
    queryKey: ['shops', ownerId],
    queryFn: () => fetchShopsByOwnerId(ownerId),
    enabled: !!ownerId
  })
  const { data: brands } = useBrands() // warm brands cache
  const brandIconsBySlug = useMemo(() => {
    const m = new Map<string, string>();
    (brands ?? []).forEach((b) => {
      if (b.slug && b.icon_path) m.set(b.slug, b.icon_path)
    });
    return m
  }, [brands])

  return (
    <main className="flex-1 grid [grid-template-columns:calc(65%-1%)_calc(35%-1%)] gap-x-[2%] px-10 py-3">
      <section className="flex min-h-0 flex-col border rounded-xl overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-sm opacity-70">Loading shops…</div>
          ) : error ? (
            <div className="p-4 text-sm text-red-500">Failed to load shops</div>
          ) : (
            <ShopsView shops={shops ?? []} isOwner={isOwner} brandIcons={brandIconsBySlug} />
          )}
        </div>
      </section>

      <aside className="min-h-0 overflow-y-auto border rounded-xl">
        {children}
      </aside>
    </main>
  );
}