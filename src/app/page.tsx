import { getCachedBrandIndex } from "@/features/brands/loadBrandIndex";
import {
  buildConstellation,
  toSearchIndex,
} from "@/features/home/constellation";
import HomePage from "@/features/home/HomePage";
import { getTodaysFeaturedBrands } from "@/features/home/loadFeatured";
import { getHomepageBrandRankings } from "@/features/rankings/loadRankings";
import PublicShell from "@/shared/layout/PublicShell";

export const revalidate = 3600;

export default async function Home() {
  const [brands, featuredBrands, topBrands] = await Promise.all([
    getCachedBrandIndex(),
    getTodaysFeaturedBrands(),
    getHomepageBrandRankings(),
  ]);

  return (
    <PublicShell>
      <HomePage
        constellation={buildConstellation(brands)}
        searchBrands={toSearchIndex(brands)}
        brandCount={brands.length}
        featuredBrands={featuredBrands}
        topBrands={topBrands}
      />
    </PublicShell>
  );
}
