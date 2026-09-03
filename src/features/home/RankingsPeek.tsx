"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BrandRankList } from "@/features/rankings/BrandRankList";
import type { BrandRanking } from "@/features/rankings/types";
import { Reveal } from "./Reveal";

export default function RankingsPeek({ brands }: { brands: BrandRanking[] }) {
  return (
    <Reveal>
      <section
        id="rankings"
        aria-labelledby="rankings-heading"
        className="scroll-mt-24"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
              Community
            </p>
            <h2
              id="rankings-heading"
              className="text-3xl font-black tracking-[-0.035em] sm:text-4xl"
            >
              Rankings
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 opacity-70 sm:text-base">
              Top rated brands with at least three reviews.
            </p>
          </div>
          <Link
            href="/rankings"
            className="hidden items-center gap-1.5 text-sm font-semibold opacity-70 transition-opacity hover:opacity-100 sm:inline-flex"
          >
            Open rankings
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <BrandRankList brands={brands} by="rating" compact />

        <Link
          href="/rankings"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold opacity-70 sm:hidden"
        >
          Open rankings
          <ArrowRight className="size-4" />
        </Link>
      </section>
    </Reveal>
  );
}
