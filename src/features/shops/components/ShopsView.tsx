import Link from "next/link";
import { Shop } from "../types";
import { useParams } from "next/navigation";

export default function ShopsView({shops, isOwner} : {shops: Shop[], isOwner: boolean}) {
  const params = useParams()
  const activeId = params?.shopId as string | undefined
  return (
    <div className="">
      {shops.map((shop) => {
        const active = shop.id === activeId;
        return (
          <Link
            key={shop.id}
            href={`/dashboard/${shop.id}`}
            className={`block p-3 hover:bg-muted/50 ${active ? "bg-muted" : ""}`}
          >
            <div className="font-medium">{shop.name}</div>
            <div className="text-sm opacity-70">{shop.rating ?? "—"}</div>
          </Link>
        )
      })}
    </div>
  )
}