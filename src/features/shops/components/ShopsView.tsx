import Link from "next/link";
import { useParams } from "next/navigation";
import { BrandMark } from "@/features/brands/BrandMark";
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

  return (
    <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3">
      {shops.map((shop) => {
        const active = shop.id === activeId;
        const brand = shop.brand_slug
          ? brandsBySlug.get(shop.brand_slug)
          : undefined;

        return (
          <Link
            key={shop.id}
            href={`/dashboard/${shop.id}`}
            className={[
              "rounded-xl border p-3 transition",
              "hover:bg-muted/50",
              active
                ? "bg-muted ring-1 ring-muted-foreground/20"
                : "bg-background",
              "flex h-40 flex-col sm:h-44 lg:h-48",
            ].join(" ")}
          >
            <div className="font-medium">{shop.name}</div>
            <div className="text-sm opacity-70">{shop.rating ?? "—"}</div>
            <div className="relative flex-1 bg-transparent">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-[90px] items-center justify-center overflow-hidden rounded-2xl">
                  <BrandMark
                    iconPath={brand?.icon_path}
                    name={brand?.display ?? shop.name}
                    slug={brand?.slug ?? shop.brand_slug}
                    size={256}
                    displaySize={90}
                  />
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
