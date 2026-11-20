export function SkeletonTile() {
  return (
    <div className="aspect-square rounded-boba-lg bg-boba-surface-alt motion-safe:animate-pulse" />
  );
}

const SKELETON_TILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;

export function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3 md:[grid-template-columns:repeat(auto-fill,minmax(176px,1fr))]">
      {SKELETON_TILES.map((id) => (
        <SkeletonTile key={id} />
      ))}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="h-8 w-[52px] rounded-boba-sm bg-boba-surface-alt motion-safe:animate-pulse" />
      <div className="h-4 flex-1 rounded-boba-sm bg-boba-surface-alt motion-safe:animate-pulse" />
    </div>
  );
}
