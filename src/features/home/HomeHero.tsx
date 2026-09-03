"use client";

import { LibraryBig, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AUTH_ENABLED } from "@/features/auth/authEnabled";
import { BrandMark } from "@/features/brands/BrandMark";
import BrandTypeahead from "./BrandTypeahead";
import type { BrandSearchItem, ConstellationMark } from "./constellation";

export default function HomeHero({
  constellation,
  searchBrands,
  brandCount,
  featuredSlugs,
}: {
  constellation: ConstellationMark[];
  searchBrands: BrandSearchItem[];
  brandCount: number;
  featuredSlugs: string[];
}) {
  const reduce = useReducedMotion() ?? false;
  const [query, setQuery] = useState("");
  const featured = useMemo(() => new Set(featuredSlugs), [featuredSlugs]);
  const normalizedQuery = query.trim().toLowerCase();

  return (
    <header className="relative mb-16 min-h-[34rem] overflow-hidden sm:min-h-[40rem]">
      <div className="pointer-events-none absolute inset-0">
        {constellation.map((brand, index) => {
          const matches =
            !normalizedQuery ||
            brand.display.toLowerCase().includes(normalizedQuery) ||
            brand.slug.toLowerCase().includes(normalizedQuery) ||
            brand.aliases.some((alias) =>
              alias.toLowerCase().includes(normalizedQuery),
            );
          const isFeatured = featured.has(brand.slug);

          return (
            <motion.div
              key={`${brand.slug}-${brand.ring}`}
              className={`pointer-events-auto absolute z-0 ${
                brand.ring === "outer" ? "hidden sm:block" : "block"
              }`}
              style={{ left: brand.left, top: brand.top }}
              initial={reduce ? false : { opacity: 0, scale: 0.55 }}
              animate={{ opacity: matches ? 1 : 0.18, scale: 1 }}
              transition={{
                duration: 0.55,
                delay: reduce ? 0 : index * 0.03,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                href={`/brands/${brand.slug}`}
                aria-label={brand.display}
                title={brand.display}
                className={`flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border bg-white/80 p-1.5 shadow-[0_8px_24px_rgba(73,49,31,0.12)] backdrop-blur transition-transform hover:z-10 hover:scale-110 sm:size-14 ${
                  isFeatured ? "border-[#2b241f]/25" : "border-white/80"
                }`}
              >
                <span
                  className={reduce ? undefined : "motion-safe:animate-float"}
                  style={
                    reduce
                      ? undefined
                      : {
                          animationDelay: `${(index % 8) * 0.28}s`,
                          animationDuration: `${4.6 + (index % 5) * 0.45}s`,
                        }
                  }
                >
                  <BrandMark
                    iconPath={brand.icon_path}
                    name={brand.display}
                    size={256}
                    displaySize={56}
                  />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-10 flex flex-col items-center pt-6 text-center sm:pt-10">
        <Image
          src="/bobadex.svg"
          alt="Bobadex"
          width={620}
          height={166}
          className="h-auto w-full max-w-[34rem]"
          priority
        />
        <p className="mt-3 max-w-xl text-pretty text-base leading-7 opacity-70 sm:text-lg">
          {AUTH_ENABLED
            ? "Open the catalogue. Find a brand, then start your own dex."
            : "Open the catalogue. Find a brand."}
        </p>

        <BrandTypeahead brands={searchBrands} onQuery={setQuery} />

        {AUTH_ENABLED ? (
          <a
            href="/auth/signup"
            className="mt-5 flex items-center gap-3 rounded-full border border-[#2b241f]/10 bg-white/70 px-5 py-3 text-sm font-semibold shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            Sign up to track your favorites
          </a>
        ) : (
          <Link
            href="/brands"
            className="mt-5 flex items-center gap-3 rounded-full border border-[#2b241f]/10 bg-white/70 px-5 py-3 text-sm font-semibold shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5"
          >
            <LibraryBig className="size-4" aria-hidden="true" />
            Browse the catalogue
          </Link>
        )}

        {brandCount > 0 ? (
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] opacity-55">
            {brandCount} brands in the dex
          </p>
        ) : null}
      </div>
    </header>
  );
}
