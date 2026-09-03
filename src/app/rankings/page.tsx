import type { Metadata } from "next";
import {
  getCachedBrandRankings,
  loadUserBoard,
} from "@/features/rankings/loadRankings";
import RankingsBoard from "@/features/rankings/RankingsBoard";
import { parseRankBy, rankedBrands } from "@/features/rankings/sortBrands";
import PublicShell from "@/shared/layout/PublicShell";

export const metadata: Metadata = {
  title: "Rankings — Bobadex",
  description:
    "Community rankings of boba brands, based on shops people have actually rated.",
};

export const revalidate = 3600;

export default async function RankingsPage({
  searchParams,
}: {
  searchParams: Promise<{ by?: string; tab?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "users" ? "users" : "brands";
  const by = parseRankBy(params.by);
  const [catalog, userBoard] = await Promise.all([
    getCachedBrandRankings(),
    loadUserBoard(),
  ]);

  return (
    <PublicShell>
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
          Rankings
        </p>
        <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          What the community is sipping
        </h1>
        <p className="mt-4 text-base leading-7 opacity-70 sm:text-lg">
          Brands are public. Rating uses the same bar as the app: highest
          average, at least three rated shops. You can also sort by logged shops
          or mapped stores. Drinker rankings stay behind an account.
        </p>
      </header>

      <RankingsBoard
        ranked={rankedBrands(catalog, by)}
        by={by}
        tab={tab}
        userBoard={userBoard}
      />
    </PublicShell>
  );
}
