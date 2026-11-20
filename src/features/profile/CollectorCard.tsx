import UserMark from "@/shared/layout/UserMark";
import StatTile from "./StatTile";

export default function CollectorCard({
  name,
  username,
  imagePath,
  initials,
  brands,
  favorites,
  since,
}: {
  name: string;
  username: string | null;
  imagePath: string | null;
  initials: string;
  brands: number | null;
  favorites: number | null;
  since: string | null;
}) {
  return (
    <section className="overflow-hidden rounded-boba-xl border border-boba-outline bg-boba-surface">
      <div className="flex h-[72px] items-start justify-end bg-boba-accent-soft px-5 pt-4">
        <p className="text-[11px] font-semibold tracking-[0.22em] text-boba-accent-ink">
          BOBADEX
        </p>
      </div>
      <div className="px-6 pb-6">
        <div className="-mt-11 mb-4 w-fit rounded-full bg-boba-surface p-[3px]">
          <UserMark imagePath={imagePath} initials={initials} size={88} />
        </div>
        <h1 className="font-display text-2xl font-semibold leading-[30px] text-boba-ink">
          {name}
        </h1>
        {username ? (
          <p className="mt-1 text-sm text-boba-ink-muted">@{username}</p>
        ) : null}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <StatTile
            label="Brands"
            value={brands == null ? "…" : String(brands)}
          />
          <StatTile
            label="Favorites"
            value={favorites == null ? "…" : String(favorites)}
          />
          <StatTile label="Collecting since" value={since ?? "…"} />
        </div>
      </div>
    </section>
  );
}
