import type { Metadata } from "next";
import Link from "next/link";
import { AUTH_ENABLED } from "@/features/auth/authEnabled";
import { AchievementGrid } from "@/features/home/AchievementShowcase";
import { catalogAchievements } from "@/features/home/showcaseAchievements";
import PublicShell from "@/shared/layout/PublicShell";
import { SUPPORT_EMAIL } from "@/shared/site";

export const metadata: Metadata = {
  title: "Achievements — Bobadex",
  description:
    "Browse the medals you can earn in Bobadex by logging shops, drinks, photos, and friends.",
};

export default function AchievementsPage() {
  return (
    <PublicShell>
      <header className="mb-10 max-w-2xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
          Achievements
        </p>
        <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          The medal case
        </h1>
        <p className="mt-4 text-base leading-7 opacity-70 sm:text-lg">
          Look freely. These unlock when you add shops, try drinks, write notes,
          upload photos, and add friends. A few secret medals stay off this
          list.
        </p>
        <p className="mt-3 max-w-xl text-sm leading-6 opacity-55">
          These badges are AI-generated stand-ins. If you want to draw
          replacements,{" "}
          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("Bobadex badge design")}`}
            className="font-semibold underline decoration-[#2b241f]/25 underline-offset-2 hover:opacity-100"
          >
            send a design
          </a>{" "}
          and I&apos;ll swap it in.
        </p>
      </header>

      <AchievementGrid achievements={catalogAchievements} />

      {AUTH_ENABLED ? (
        <a
          href="/auth/signup"
          className="mt-10 inline-flex rounded-full border border-[#2b241f]/10 bg-white/70 px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Sign up to start unlocking
        </a>
      ) : (
        <Link
          href="/brands"
          className="mt-10 inline-flex rounded-full border border-[#2b241f]/10 bg-white/70 px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
        >
          Browse the catalogue
        </Link>
      )}
    </PublicShell>
  );
}
