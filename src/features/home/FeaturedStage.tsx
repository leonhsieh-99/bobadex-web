"use client";

import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BrandMark } from "@/features/brands/BrandMark";
import { marketChips, originEyebrow, tagChips } from "./chips";
import { featuredBrands, INITIAL_FEATURED_SLUG } from "./featuredBrands";
import type { FeaturedBrand } from "./types";

export const FEATURED_ROTATE_MS = 10_000;

export default function FeaturedStage({
  selectedSlug,
  onSelect,
}: {
  selectedSlug: string;
  onSelect: (slug: string) => void;
}) {
  const reduce = useReducedMotion() ?? false;
  const [tabHidden, setTabHidden] = useState(false);
  const selectedIndex = Math.max(
    0,
    featuredBrands.findIndex((item) => item.slug === selectedSlug),
  );
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;
  const brand =
    featuredBrands[selectedIndex] ??
    featuredBrands.find((item) => item.slug === INITIAL_FEATURED_SLUG);

  const selectByOffset = useCallback(
    (offset: number) => {
      const next =
        (selectedIndex + offset + featuredBrands.length) %
        featuredBrands.length;
      const nextBrand = featuredBrands[next];
      if (nextBrand) onSelect(nextBrand.slug);
    },
    [onSelect, selectedIndex],
  );

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (tabHidden) return;
    const timer = window.setInterval(() => {
      const current = selectedIndexRef.current;
      const next = (current + 1) % featuredBrands.length;
      const nextBrand = featuredBrands[next];
      if (nextBrand) onSelect(nextBrand.slug);
    }, FEATURED_ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [tabHidden, onSelect]);

  if (!brand) return null;

  const markets = marketChips(brand.market_presence);
  const tags = tagChips(brand);
  const eyebrow = originEyebrow(brand);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectByOffset(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectByOffset(-1);
    }
  }

  return (
    <section
      id="featured"
      aria-labelledby="featured-heading"
      className="scroll-mt-24"
      onKeyDown={onKeyDown}
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
            Today&apos;s catalogue picks
          </p>
          <h2
            id="featured-heading"
            className="text-3xl font-black tracking-[-0.035em] sm:text-4xl"
          >
            Featured brands
          </h2>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <CycleButton
            label="Previous featured brand"
            onClick={() => selectByOffset(-1)}
          >
            <ChevronLeft className="size-4" />
          </CycleButton>
          <CycleButton
            label="Next featured brand"
            onClick={() => selectByOffset(1)}
          >
            <ChevronRight className="size-4" />
          </CycleButton>
        </div>
      </div>

      <div className="min-w-0">
        <AnimatePresence mode="wait">
          <motion.article
            key={brand.slug}
            className={`grid overflow-hidden rounded-[2rem] border border-[#2b241f]/10 bg-gradient-to-br ${brand.accent} shadow-[0_12px_40px_rgba(74,51,32,0.06)] md:grid-cols-[17rem_1fr]`}
            initial={reduce ? false : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            aria-live="polite"
          >
            <StageVisual brand={brand} />
            <div className="flex flex-col justify-center border-t border-[#2b241f]/10 bg-white/30 p-7 backdrop-blur-[2px] md:border-l md:border-t-0 md:p-10">
              {eyebrow ? (
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] opacity-65">
                  {eyebrow}
                </p>
              ) : null}
              <h3 className="text-3xl font-black tracking-[-0.035em] sm:text-4xl">
                {brand.display}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 opacity-70 sm:text-base sm:leading-7">
                {brand.public_summary}
              </p>
              {markets.length || tags.length ? (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  {markets.map((market) => (
                    <span
                      key={market}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#2b241f]/10 bg-white/65 px-3 py-1.5 text-xs font-semibold"
                    >
                      <MapPin className="size-3.5" aria-hidden="true" />
                      {market}
                    </span>
                  ))}
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="max-w-[14rem] truncate rounded-full border border-[#2b241f]/10 bg-white/65 px-3 py-1.5 text-xs font-semibold"
                      title={tag}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {featuredBrands.map((item) => {
          const active = item.slug === brand.slug;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => onSelect(item.slug)}
              aria-pressed={active}
              aria-label={`Show ${item.display}`}
              className={`flex min-w-36 flex-1 items-center gap-3 rounded-[1.4rem] border p-2.5 text-left transition-transform hover:-translate-y-0.5 ${
                active
                  ? "border-[#2b241f]/20 bg-white shadow-sm"
                  : "border-[#2b241f]/10 bg-white/40"
              }`}
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white p-1.5">
                <BrandMark
                  iconPath={item.icon_path}
                  name={item.display}
                  size={256}
                  displaySize={44}
                  eager
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">
                  {item.display}
                </span>
                <span className="block text-xs opacity-55">
                  {active ? "Now showing" : "View"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function StageVisual({ brand }: { brand: FeaturedBrand }) {
  return (
    <div className="relative flex min-h-56 items-center justify-center overflow-hidden p-7 md:min-h-64">
      <div
        className={`absolute h-44 w-44 rounded-full ${brand.mascotBackdrop} opacity-25 blur-2xl`}
      />
      <div className="relative flex size-40 items-center justify-center rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_14px_35px_rgba(73,49,31,0.14)] backdrop-blur sm:size-44">
        <BrandMark
          iconPath={brand.icon_path}
          name={brand.display}
          size={512}
          displaySize={176}
          priority
        />
      </div>
    </div>
  );
}

function CycleButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-9 items-center justify-center rounded-full border border-[#2b241f]/10 bg-white/70 transition-transform hover:-translate-y-0.5"
    >
      {children}
    </button>
  );
}
