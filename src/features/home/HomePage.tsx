import type { BrandRanking } from "@/features/rankings/types";
import AchievementShowcase from "./AchievementShowcase";
import type { BrandSearchItem, ConstellationMark } from "./constellation";
import FeaturedStage from "./FeaturedStage";
import HomeHero from "./HomeHero";
import RankingsPeek from "./RankingsPeek";
import { Reveal } from "./Reveal";
import type { FeaturedBrand } from "./types";

export default function HomePage({
  constellation,
  searchBrands,
  brandCount,
  featuredBrands,
  topBrands,
}: {
  constellation: ConstellationMark[];
  searchBrands: BrandSearchItem[];
  brandCount: number;
  featuredBrands: FeaturedBrand[];
  topBrands: BrandRanking[];
}) {
  return (
    <>
      <HomeHero
        constellation={constellation}
        searchBrands={searchBrands}
        brandCount={brandCount}
        featuredSlugs={featuredBrands.map((brand) => brand.slug)}
      />
      <div className="space-y-20">
        {featuredBrands.length > 0 ? (
          <Reveal>
            <FeaturedStage brands={featuredBrands} />
          </Reveal>
        ) : null}
        <AchievementShowcase />
        <RankingsPeek brands={topBrands} />
      </div>
    </>
  );
}
