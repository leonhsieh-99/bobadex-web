"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Library, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BrandMark } from "@/features/brands/BrandMark";
import { useDexData } from "@/features/dashboard/components/DashboardShell";
import DexToolbar from "@/features/dex/components/DexToolbar";
import DrinkRow from "@/features/dex/components/DrinkRow";
import EmptyState from "@/features/dex/components/EmptyState";
import RatingValue from "@/features/dex/components/RatingValue";
import { SkeletonRow } from "@/features/dex/components/Skeletons";
import { type CollectionSort, organizeEntries } from "@/features/dex/organize";
import { fetchDrinksByShopId } from "@/features/drinks/client/queries";
import type { Drink } from "@/features/drinks/types";

const EMPTY_DRINKS: Drink[] = [];

function ShopNotes({ notes }: { notes: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      className="w-full text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-boba-accent"
      aria-expanded={open}
      onClick={() => setOpen((current) => !current)}
    >
      <span
        className={`block text-sm leading-5 text-boba-ink-muted ${open ? "" : "line-clamp-3"}`}
      >
        {notes}
      </span>
    </button>
  );
}

export default function ShopDetails({ shopId }: { shopId: string }) {
  const {
    shops,
    isLoading: shopsLoading,
    isError: shopsError,
    brandsBySlug,
  } = useDexData();
  const shop = shops.find((item) => item.id === shopId);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<CollectionSort | null>(null);
  const {
    data: drinks,
    isLoading,
    isError,
  } = useQuery<Drink[]>({
    queryKey: ["drinks", shopId],
    queryFn: () => fetchDrinksByShopId(shopId),
    enabled: !!shopId,
  });

  const brand = shop?.brand_slug
    ? brandsBySlug.get(shop.brand_slug)
    : undefined;
  const loadedDrinks = drinks ?? EMPTY_DRINKS;
  const orderedDrinks = useMemo(() => {
    const organized = organizeEntries(loadedDrinks, query, sort);
    if (!shop?.pinned_drink_id) return organized;
    const pinned = organized.find((drink) => drink.id === shop.pinned_drink_id);
    if (!pinned) return organized;
    return [
      pinned,
      ...organized.filter((drink) => drink.id !== shop.pinned_drink_id),
    ];
  }, [loadedDrinks, query, sort, shop?.pinned_drink_id]);

  if (!shop && shopsLoading) {
    return (
      <div className="overflow-hidden rounded-boba-xl border border-boba-outline bg-boba-surface">
        <div className="h-40 animate-pulse bg-boba-accent-soft" />
        <div className="px-4">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      </div>
    );
  }

  if (!shop) {
    return (
      <EmptyState
        icon={Library}
        tone={shopsError ? "danger" : "muted"}
        title={
          shopsError
            ? "Couldn't load your dex."
            : "This brand isn't in your dex."
        }
        body={
          shopsError
            ? "Your brands are still on your account. Try refreshing this page."
            : "Pick another brand from your dex."
        }
        action={
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center text-sm font-semibold text-boba-accent-ink underline-offset-2 hover:underline"
          >
            Back to your dex
          </Link>
        }
      />
    );
  }

  const notes = shop.notes?.trim() ?? "";

  return (
    <div>
      <Link
        href="/dashboard"
        className="mb-4 inline-flex h-11 items-center gap-2 text-sm font-semibold text-boba-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-boba-accent lg:hidden"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to your dex
      </Link>
      <section className="relative overflow-hidden rounded-boba-xl border border-boba-outline bg-boba-surface lg:flex lg:max-h-[calc(100vh-3rem)] lg:flex-col lg:shadow-boba-floating">
        <Link
          href="/dashboard"
          aria-label="Close"
          className="absolute top-3 right-3 z-10 hidden size-11 items-center justify-center rounded-full bg-boba-surface/80 text-boba-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-boba-accent lg:flex"
        >
          <X className="size-4" aria-hidden="true" />
        </Link>
        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          <div className="bg-boba-accent-soft px-5 pt-6 pb-5">
            <div className="mb-4 size-24">
              <BrandMark
                iconPath={brand?.icon_path}
                name={brand?.display ?? shop.name}
                slug={brand?.slug ?? shop.brand_slug}
                size={256}
                displaySize={96}
              />
            </div>
            <h1 className="pr-12 font-display text-2xl font-semibold leading-[30px] text-boba-ink">
              {shop.name}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <RatingValue rating={shop.rating} />
              {shop.is_favorite ? (
                <Heart
                  className="size-4 fill-boba-heart text-boba-heart"
                  aria-label="Favorite"
                />
              ) : null}
            </div>
            {shop.brand_slug ? (
              <Link
                href={`/brands/${shop.brand_slug}`}
                className="mt-3 inline-flex h-11 items-center text-sm font-semibold text-boba-accent-ink underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-boba-accent"
              >
                View brand
              </Link>
            ) : null}
          </div>

          <div className="space-y-5 px-5 py-5">
            {notes ? <ShopNotes notes={notes} /> : null}

            <div>
              <h2 className="font-display text-lg font-semibold leading-6 text-boba-ink">
                Drinks
                {isLoading || isError ? "" : ` · ${loadedDrinks.length}`}
              </h2>
              {isLoading ? (
                <div className="mt-2">
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </div>
              ) : isError ? (
                <p className="mt-3 text-sm text-boba-danger">
                  Couldn't load drinks.
                </p>
              ) : loadedDrinks.length === 0 ? (
                <p className="mt-3 text-sm text-boba-ink-muted">
                  No drinks logged yet.
                </p>
              ) : (
                <>
                  {loadedDrinks.length > 5 ? (
                    <div className="mt-4">
                      <DexToolbar
                        query={query}
                        onQuery={setQuery}
                        sort={sort}
                        onSort={setSort}
                        label="Search your drinks"
                      />
                    </div>
                  ) : null}
                  {orderedDrinks.length === 0 ? (
                    <p className="text-sm text-boba-ink-muted">
                      No drinks match that search.
                    </p>
                  ) : (
                    <div className="mt-1">
                      {orderedDrinks.map((drink) => (
                        <DrinkRow
                          key={drink.id}
                          drink={drink}
                          pinned={drink.id === shop.pinned_drink_id}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
