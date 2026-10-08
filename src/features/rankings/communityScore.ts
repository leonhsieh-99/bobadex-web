/** Same prior the app uses in get_brand_rankings. */
export const COMMUNITY_PRIOR = 8;

export function communityScore(
  average: number | null,
  ratingCount: number,
  meanRating: number,
) {
  if (average == null || ratingCount <= 0) return null;
  const weight = COMMUNITY_PRIOR;
  return (
    (ratingCount / (ratingCount + weight)) * average +
    (weight / (ratingCount + weight)) * meanRating
  );
}
