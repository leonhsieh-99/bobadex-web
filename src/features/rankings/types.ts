export type BrandRankBy = "rating" | "shops" | "stores";

export type BrandRanking = {
  slug: string;
  display: string;
  icon_path: string | null;
  avg_rating: number | null;
  rating_count: number;
  shop_count: number;
  store_count: number;
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
