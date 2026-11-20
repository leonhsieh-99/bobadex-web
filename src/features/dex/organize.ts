export type CollectionSort = "favorites" | "rating" | "name" | "added";

type Sortable = {
  name: string;
  rating: number | null;
  is_favorite: boolean | null;
  created_at: Date | string | null;
};

function timeValue(value: Date | string | null) {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function compareEntries(a: Sortable, b: Sortable, sort: CollectionSort) {
  if (sort === "name") {
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  }

  if (sort === "favorites") {
    const favorite =
      Number(Boolean(b.is_favorite)) - Number(Boolean(a.is_favorite));
    if (favorite !== 0) return favorite;
    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
  }

  if (sort === "rating") {
    if (a.rating == null && b.rating == null) return 0;
    if (a.rating == null) return 1;
    if (b.rating == null) return -1;
    return b.rating - a.rating;
  }

  const aTime = timeValue(a.created_at);
  const bTime = timeValue(b.created_at);
  if (aTime == null && bTime == null) return 0;
  if (aTime == null) return 1;
  if (bTime == null) return -1;
  return bTime - aTime;
}

export function organizeEntries<T extends Sortable>(
  items: T[],
  query: string,
  sort: CollectionSort | null,
) {
  const needle = query.trim().toLowerCase();
  const filtered = needle
    ? items.filter((item) => item.name.toLowerCase().includes(needle))
    : items.slice();

  if (!sort) return filtered;

  return filtered
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const compared = compareEntries(a.item, b.item, sort);
      return compared === 0 ? a.index - b.index : compared;
    })
    .map(({ item }) => item);
}
