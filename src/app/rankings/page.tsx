import { LogIn, Trophy } from "lucide-react";
import type { Metadata } from "next";
import PublicShell from "@/shared/layout/PublicShell";

export const metadata: Metadata = {
  title: "Rankings — Bobadex",
  description:
    "Community rankings of boba brands, based on shops people have actually rated.",
};

export default function RankingsPage() {
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
          Rankings will list brands by average shop rating once enough real
          drinkers have logged visits. Until then, this board stays empty on
          purpose — we are not filling it with demo data.
        </p>
      </header>

      <div className="flex flex-col items-start gap-5 rounded-[2rem] border border-[#2b241f]/10 bg-white/50 p-8 sm:flex-row sm:items-center sm:p-10">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-[#fff3c7]">
          <Trophy className="size-7" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xl font-black tracking-[-0.03em]">
            Waiting on real ratings
          </p>
          <p className="mt-2 max-w-xl text-sm leading-6 opacity-70 sm:text-base">
            A brand shows up here after several rated shops. Sign in, log a
            shop, and you are part of the first wave.
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
    </PublicShell>
  );
}
