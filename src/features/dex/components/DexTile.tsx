import { Heart } from "lucide-react";
import Link from "next/link";
import { BrandMark } from "@/features/brands/BrandMark";
import RatingValue from "@/features/dex/components/RatingValue";
import type { Shop } from "@/features/shops/types";
import { cn } from "@/lib/utils";

export default function DexTile({
  shop,
  brand,
  active,
}: {
  shop: Shop;
  brand?: {
    slug: string;
    display: string;
    icon_path?: string | null;
  };
  active: boolean;
}) {
  return (
    <Link
      href={`/dashboard/${shop.id}`}
      aria-current={active ? "page" : undefined}
      className="group relative block aspect-square min-w-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-boba-accent"
    >
      <span
        className={cn(
          "relative flex h-full flex-col rounded-boba-lg border border-boba-outline border-l-[3px] border-l-boba-accent-ink bg-boba-surface p-3",
          "motion-safe:transition-[transform,box-shadow] motion-safe:duration-[120ms]",
          "motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:shadow-boba-floating",
          "motion-safe:group-active:scale-[0.98]",
          active && "ring-2 ring-boba-accent",
        )}
      >
        {shop.is_favorite ? (
          <Heart
            className="absolute top-3 right-3 size-4 fill-boba-heart text-boba-heart"
            aria-label="Favorite"
          />
        ) : null}
        <span className="relative z-10 line-clamp-2 pr-6 font-display text-[15px] font-semibold leading-5 text-boba-ink">
          {shop.name}
        </span>
        <span className="relative z-10 mt-auto max-w-[48%] pt-2">
          <RatingValue rating={shop.rating} compact />
        </span>
        <span className="pointer-events-none absolute right-3 bottom-3 aspect-square w-[55%] max-w-40 min-w-[52px]">
          <BrandMark
            iconPath={brand?.icon_path}
            name={brand?.display ?? shop.name}
            slug={brand?.slug ?? shop.brand_slug}
            size={256}
            displaySize={96}
          />
        </span>
      </span>
    </Link>
  );
}
