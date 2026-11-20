"use client";

import { useQuery } from "@tanstack/react-query";
import { Library } from "lucide-react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { useBrands } from "@/features/brands/useBrands";
import DexHeader from "@/features/dex/components/DexHeader";
import DexToolbar from "@/features/dex/components/DexToolbar";
import EmptyState from "@/features/dex/components/EmptyState";
import { SkeletonGrid } from "@/features/dex/components/Skeletons";
import { type CollectionSort, organizeEntries } from "@/features/dex/organize";
import { fetchShopsByOwnerId } from "@/features/shops/client/queries";
import ShopsView, {
  type ShopBrandVisual,
} from "@/features/shops/components/ShopsView";
import type { Shop } from "@/features/shops/types";

const EMPTY_SHOPS: Shop[] = [];

type DexData = {
  shops: Shop[];
  isLoading: boolean;
  isError: boolean;
  brandsBySlug: Map<string, ShopBrandVisual>;
};

const DexDataContext = createContext<DexData | null>(null);

export function useDexData() {
  const value = useContext(DexDataContext);
  if (!value) {
    throw new Error("useDexData must be used inside the dashboard.");
  }
  return value;
}

export default function DashboardShell({
  ownerId,
  isOwner,
  children,
}: {
  ownerId: string;
  isOwner: boolean;
  children: ReactNode;
}) {
  const segment = useSelectedLayoutSegment();
  const isProfile = segment === "profile";
  const shopId = segment && segment !== "profile" ? segment : null;
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<CollectionSort | null>(null);
  const {
    data: shops,
    isLoading,
    isError,
  } = useQuery<Shop[]>({
    queryKey: ["shops", ownerId],
    queryFn: () => fetchShopsByOwnerId(ownerId),
    enabled: !!ownerId,
  });
  const { data: brands } = useBrands();
  const brandsBySlug = useMemo(() => {
    const map = new Map<string, ShopBrandVisual>();
    for (const brand of brands ?? []) {
      if (!brand.slug) continue;
      map.set(brand.slug, {
        slug: brand.slug,
        display: brand.display,
        icon_path: brand.icon_path,
      });
    }
    return map;
  }, [brands]);

  const loadedShops = shops ?? EMPTY_SHOPS;
  const visibleShops = useMemo(
    () => organizeEntries(loadedShops, query, sort),
    [loadedShops, query, sort],
  );
  const dexData = useMemo<DexData>(
    () => ({
      shops: loadedShops,
      isLoading,
      isError,
      brandsBySlug,
    }),
    [loadedShops, isLoading, isError, brandsBySlug],
  );

  return (
    <DexDataContext.Provider value={dexData}>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
        {isProfile ? (
          children
        ) : (
          <>
            <div className={shopId ? "hidden lg:block" : undefined}>
              <DexHeader
                count={isLoading || isError ? null : loadedShops.length}
              />
              {!isLoading && !isError && loadedShops.length > 5 ? (
                <DexToolbar
                  query={query}
                  onQuery={setQuery}
                  sort={sort}
                  onSort={setSort}
                />
              ) : null}
            </div>

            <div
              className={
                shopId
                  ? "lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_420px]"
                  : undefined
              }
            >
              <div className={shopId ? "hidden min-w-0 lg:block" : "min-w-0"}>
                {isLoading ? (
                  <SkeletonGrid />
                ) : isError ? (
                  <EmptyState
                    icon={Library}
                    tone="danger"
                    title="Couldn't load your dex."
                    body="Your brands are still on your account. Try refreshing this page."
                  />
                ) : loadedShops.length === 0 ? (
                  <EmptyState
                    icon={Library}
                    title="Your dex is empty."
                    body="Brands you log in the Bobadex app show up here."
                    action={
                      <Link
                        href="/brands"
                        className="inline-flex h-12 items-center rounded-full bg-boba-accent px-5 text-sm font-semibold text-boba-on-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-boba-accent"
                      >
                        Browse brands
                      </Link>
                    }
                  />
                ) : (
                  <ShopsView
                    shops={visibleShops}
                    isOwner={isOwner}
                    brandsBySlug={brandsBySlug}
                  />
                )}
              </div>
              {shopId ? (
                <aside className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:self-start">
                  {children}
                </aside>
              ) : null}
            </div>
          </>
        )}
      </main>
    </DexDataContext.Provider>
  );
}
