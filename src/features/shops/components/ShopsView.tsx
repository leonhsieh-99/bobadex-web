import Link from "next/link";
import { Shop } from "../types";
import { useParams } from "next/navigation";
import { publicStorageURL, thumbPath } from "@/utils/media";
import Image from "next/image";

export default function ShopsView({shops, isOwner, brandIcons} : {shops: Shop[], isOwner: boolean, brandIcons: Map<string, string>}) {
  const params = useParams()
  const activeId = params?.shopId as string | undefined
  return (
    <div className="grid gap-3 p-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {shops.map((shop) => {
        const active = shop.id === activeId;
        const iconPath = shop.brand_slug ? brandIcons.get(shop.brand_slug) : undefined
        const iconUrl = iconPath ?
          publicStorageURL('shop-media', thumbPath(iconPath, 512))
          : null
        
        return (
          <Link
            key={shop.id}
            href={`/dashboard/${shop.id}`}
            className={[
              "rounded-xl border p-3 transition",
              "hover:bg-muted/50",
              active ? "bg-muted ring-1 ring-muted-foreground/20" : "bg-background",
              'flex flex-col',
              'h-40 sm:h-44 lg:h-48',
            ].join(" ")}
          >
            <div className="font-medium">{shop.name}</div>
            <div className="text-sm opacity-70">{shop.rating ?? "—"}</div>
            <div className="relative flex-1 bg-transparent">
              {iconUrl ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={iconUrl}
                    alt={`${shop.name} icon`}
                    width={90}
                    height={90}
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-14 w-14 rounded-xl bg-background/70 border" />
                </div>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )
}