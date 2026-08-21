"use client";

import { useState } from "react";
import type { BrandIndexItem } from "@/features/brands/loadBrandIndex";
import AchievementShowcase from "./AchievementShowcase";
import FeaturedStage from "./FeaturedStage";
import { featuredBrands, INITIAL_FEATURED_SLUG } from "./featuredBrands";
import HomeHero from "./HomeHero";
import RankingsPeek from "./RankingsPeek";
import { Reveal } from "./Reveal";

export default function HomePage({ brands }: { brands: BrandIndexItem[] }) {
  const [featuredSlug, setFeaturedSlug] = useState(INITIAL_FEATURED_SLUG);

  return (
    <>
      <HomeHero
        brands={brands}
        featuredSlugs={featuredBrands.map((brand) => brand.slug)}
      />
      <div className="space-y-20">
        <Reveal>
          <FeaturedStage
            selectedSlug={featuredSlug}
            onSelect={setFeaturedSlug}
          />
        </Reveal>
        <AchievementShowcase />
        <RankingsPeek />
      </div>
    </>
  );
}
