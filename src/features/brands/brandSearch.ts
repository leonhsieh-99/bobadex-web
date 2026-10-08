export type BrandPlace = {
  city: string;
  state: string;
};

export type CatalogueSearchBrand = {
  display: string;
  slug: string;
  aliases: string[];
  places: BrandPlace[];
};

function matchesIdentity(brand: CatalogueSearchBrand, query: string) {
  if (brand.display.toLowerCase().includes(query)) return true;
  if (brand.slug.toLowerCase().includes(query)) return true;
  return brand.aliases.some((alias) => alias.toLowerCase().includes(query));
}

function mentionedPlace(brand: CatalogueSearchBrand, query: string) {
  let best: BrandPlace | null = null;
  for (const place of brand.places) {
    const city = place.city.toLowerCase();
    if (city.length < 3 || !query.includes(city)) continue;
    if (!best || city.length > best.city.toLowerCase().length) best = place;
  }
  return best;
}

function withoutCity(query: string, city: string) {
  return query.replaceAll(city.toLowerCase(), " ").replace(/\s+/g, " ").trim();
}

export function brandMatchesCatalogueQuery(
  brand: CatalogueSearchBrand,
  rawQuery: string,
) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;
  if (matchesIdentity(brand, query)) return true;

  const place = mentionedPlace(brand, query);
  if (!place) return false;
  const remainder = withoutCity(query, place.city);
  if (!remainder) return true;
  return matchesIdentity(brand, remainder);
}

export function cataloguePlaceLabel(
  brand: CatalogueSearchBrand,
  rawQuery: string,
) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return null;
  const place = mentionedPlace(brand, query);
  if (!place) return null;
  return place.state ? `${place.city}, ${place.state}` : place.city;
}
