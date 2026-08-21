"use client";

import { ArrowRight, LogIn, Trophy } from "lucide-react";
import Link from "next/link";
import { Reveal } from "./Reveal";

export default function RankingsPeek() {
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
          </div>
          <Link
            href="/rankings"
            className="hidden items-center gap-1.5 text-sm font-semibold opacity-70 transition-opacity hover:opacity-100 sm:inline-flex"
          >
            Open rankings
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="flex flex-col items-start gap-5 rounded-[2rem] border border-[#2b241f]/10 bg-white/50 p-8 sm:flex-row sm:items-center sm:p-10">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-[#fff3c7]">
            <Trophy className="size-7" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-black tracking-[-0.03em]">
              Rankings unlock as people log shops
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 opacity-70 sm:text-base">
              Community brand rankings will land here once enough drinkers have
              rated shops.
            </p>
          </div>
          <a
            href="/auth/login?next=/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-[#2b241f]/10 bg-white px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
          >
            <LogIn className="size-4" aria-hidden="true" />
            Sign in to rank
          </a>
        </div>
      </section>
    </Reveal>
  );
}
