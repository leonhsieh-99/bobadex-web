import { useParams } from "next/navigation";
import DexTile from "@/features/dex/components/DexTile";
import type { Shop } from "../types";

export type ShopBrandVisual = {
  slug: string;
  display: string;
  icon_path?: string | null;
};

export default function ShopsView({
  shops,
  brandsBySlug,
}: {
  shops: Shop[];
  isOwner: boolean;
  brandsBySlug: Map<string, ShopBrandVisual>;
}) {
  const params = useParams();
  const activeId = params?.shopId as string | undefined;

  if (shops.length === 0) {
    return (
      <p className="px-1 py-6 text-sm text-boba-ink-muted">
        No brands match that search.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3 md:[grid-template-columns:repeat(auto-fill,minmax(176px,1fr))]">
      {shops.map((shop) => {
        const brand = shop.brand_slug
          ? brandsBySlug.get(shop.brand_slug)
          : undefined;

        return (
          <DexTile
            key={shop.id}
            shop={shop}
            brand={brand}
            active={shop.id === activeId}
          />
        );
      })}
    </div>
  );
}
