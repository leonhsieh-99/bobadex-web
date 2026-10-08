export type BrandRankBy = "locations" | "score" | "rating" | "collected";

export type BrandRanking = {
  slug: string;
  display: string;
  icon_path: string | null;
  avg_rating: number | null;
  rating_count: number;
  collector_count: number;
  location_count: number;
  community_score: number | null;
};

export type UserRanking = {
  id: string;
  displayName: string;
  username: string;
  profileImagePath: string | null;
  shopCount: number;
};

export type UserBoard =
  | { status: "coming-soon" }
  | { status: "sign-in" }
  | { status: "ready"; users: UserRanking[] };
