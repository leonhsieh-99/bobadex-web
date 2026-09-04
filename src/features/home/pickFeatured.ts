/** Active mapped storefronts — a real footprint, not a couple of pins. */
export const MIN_FEATURED_STORES = 5;
export const FEATURED_PER_DAY = 5;
export const FEATURED_DAYS_IN_WEEK = 7;

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export type PacificCalendar = {
  dayKey: string;
  weekKey: string;
  dayIndex: number;
};

export function pacificCalendar(now = new Date()): PacificCalendar {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    })
      .formatToParts(now)
      .map((part) => [part.type, part.value]),
  );

  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  const weekday = WEEKDAYS.indexOf(
    (parts.weekday ?? "Mon") as (typeof WEEKDAYS)[number],
  );
  const dayIndex = weekday === 0 ? 6 : weekday - 1;
  const monday = new Date(
    Date.UTC(year, month - 1, day, 12) - dayIndex * 86_400_000,
  );

  return {
    dayKey: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    weekKey: monday.toISOString().slice(0, 10),
    dayIndex,
  };
}

export function pickFeaturedSlugs(
  slugs: string[],
  calendar: PacificCalendar,
  perDay = FEATURED_PER_DAY,
): string[] {
  return (
    dealFeaturedWeek(slugs, calendar.weekKey, perDay)[calendar.dayIndex] ?? []
  );
}

/** Deal unique packs until the pool is spent, then shuffle a new deck. */
export function dealFeaturedWeek(
  slugs: string[],
  weekKey: string,
  perDay = FEATURED_PER_DAY,
): string[][] {
  if (slugs.length === 0 || perDay <= 0) {
    return Array.from({ length: FEATURED_DAYS_IN_WEEK }, () => []);
  }

  const days: string[][] = [];
  const shown = new Set<string>();
  let remnant: string[] = [];
  let deck = 0;

  for (let day = 0; day < FEATURED_DAYS_IN_WEEK; day += 1) {
    let queue = remnant;
    if (queue.length < perDay) {
      const shuffled = seededShuffle(
        slugs,
        hashSeed(`featured:${weekKey}:${deck}`),
      );
      deck += 1;
      const leftover = new Set(queue);
      const unseen = shuffled.filter(
        (slug) => !shown.has(slug) && !leftover.has(slug),
      );
      const rest = shuffled.filter(
        (slug) => shown.has(slug) && !leftover.has(slug),
      );
      queue = [...queue, ...unseen, ...rest];
    }

    const count = Math.min(perDay, queue.length);
    const pick = queue.slice(0, count);
    remnant = queue.slice(count);
    for (const slug of pick) shown.add(slug);
    days.push(pick);
  }

  return days;
}

function hashSeed(input: string) {
  let hash = 2166136261;
  for (const char of input) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededShuffle(items: string[], seed: number) {
  const next = mulberry32(seed);
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(next() * (index + 1));
    const current = shuffled[index];
    const other = shuffled[swap];
    if (current == null || other == null) continue;
    shuffled[index] = other;
    shuffled[swap] = current;
  }
  return shuffled;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
