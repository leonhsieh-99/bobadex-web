import { Search } from "lucide-react";
import type { CollectionSort } from "@/features/dex/organize";
import { cn } from "@/lib/utils";

const SORTS: { id: CollectionSort; label: string }[] = [
  { id: "favorites", label: "Favorites" },
  { id: "rating", label: "Rating" },
  { id: "name", label: "Name" },
  { id: "added", label: "Added" },
];

export function Chip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "inline-flex h-11 shrink-0 items-center rounded-full px-3 text-[13px] font-semibold",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-boba-accent",
        pressed
          ? "bg-boba-accent-soft text-boba-accent-ink"
          : "bg-boba-surface-alt text-boba-ink-muted",
      )}
    >
      {children}
    </button>
  );
}

export default function DexToolbar({
  query,
  onQuery,
  sort,
  onSort,
  label = "Search your brands",
}: {
  query: string;
  onQuery: (value: string) => void;
  sort: CollectionSort | null;
  onSort: (value: CollectionSort | null) => void;
  label?: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">{label}</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-boba-ink-faint"
          aria-hidden="true"
        />
        <input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder={label}
          className="h-11 w-full rounded-boba-md bg-boba-surface-alt pr-4 pl-10 text-sm text-boba-ink outline-none placeholder:text-boba-ink-faint focus:ring-2 focus:ring-boba-accent"
        />
      </label>
      <fieldset className="m-0 flex min-w-0 gap-2 overflow-x-auto border-0 p-0">
        <legend className="sr-only">Sort</legend>
        {SORTS.map((item) => (
          <Chip
            key={item.id}
            pressed={sort === item.id}
            onClick={() => onSort(sort === item.id ? null : item.id)}
          >
            {item.label}
          </Chip>
        ))}
      </fieldset>
    </div>
  );
}
