"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";
import {
  type ShowcaseAchievement,
  teaserAchievements,
} from "./showcaseAchievements";

export default function AchievementShowcase() {
  return (
    <Reveal>
      <section
        id="achievements"
        aria-labelledby="achievements-heading"
        className="scroll-mt-24"
      >
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
              The dex
            </p>
            <h2
              id="achievements-heading"
              className="text-3xl font-black tracking-[-0.035em] sm:text-4xl"
            >
              Medals you can earn
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 opacity-70 sm:text-base">
              A peek at the collection. Unlocking happens when you log shops,
              drinks, and friends.
            </p>
          </div>
          <Link
            href="/achievements"
            className="hidden items-center gap-1.5 text-sm font-semibold opacity-70 transition-opacity hover:opacity-100 sm:inline-flex"
          >
            All medals
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <AchievementGrid achievements={teaserAchievements} />

        <Link
          href="/achievements"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold opacity-70 sm:hidden"
        >
          All medals
          <ArrowRight className="size-4" />
        </Link>
      </section>
    </Reveal>
  );
}

export function AchievementGrid({
  achievements,
}: {
  achievements: ShowcaseAchievement[];
}) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {achievements.map((achievement) => (
        <li key={achievement.name}>
          <article className="flex h-full flex-col items-center rounded-[1.6rem] border border-[#2b241f]/10 bg-white/55 p-5 text-center shadow-[0_8px_24px_rgba(74,51,32,0.04)] transition-transform hover:-translate-y-0.5">
            <Image
              src={achievement.image}
              alt={`${achievement.name} medal`}
              width={112}
              height={112}
              className="size-24 object-contain sm:size-28"
            />
            <h3 className="mt-3 text-base font-black tracking-[-0.03em]">
              {achievement.name}
            </h3>
            <p className="mt-1 text-sm leading-5 opacity-65">
              {achievement.description}
            </p>
          </article>
        </li>
      ))}
    </ul>
  );
}
