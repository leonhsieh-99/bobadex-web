import type { Metadata } from "next";
import { AchievementGrid } from "@/features/home/AchievementShowcase";
import { catalogAchievements } from "@/features/home/showcaseAchievements";
import PublicShell from "@/shared/layout/PublicShell";

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
      </header>

      <AchievementGrid achievements={catalogAchievements} />

      <a
        href="/auth/signup"
        className="mt-10 inline-flex rounded-full border border-[#2b241f]/10 bg-white/70 px-5 py-3 text-sm font-semibold shadow-sm transition-transform hover:-translate-y-0.5"
      >
        Sign up to start unlocking
      </a>
    </PublicShell>
  );
}
