export function pickEvenSpread<T>(items: T[], count: number) {
  if (items.length <= count) return items;

  const step = items.length / count;
  const picked: T[] = [];

  for (let index = 0; index < count; index++) {
    const item = items[Math.floor(index * step)];
    if (item) picked.push(item);
  }

  return picked;
}
