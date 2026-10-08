import { MapPin, Star } from "lucide-react";
import { marketChips, originEyebrow, tagChips } from "@/features/home/chips";
import { BrandMark } from "./BrandMark";
import { brandAccentForSlug } from "./brandAccent";
import type { BrandCatalogueStats, BrandDetail } from "./types";

function catalogueFacts(stats: BrandCatalogueStats) {
  const facts: Array<{ label: string; value: string }> = [];
  if (stats.communityScore != null && stats.ratingCount > 0) {
    facts.push({
      label: "Community score",
      value: stats.communityScore.toFixed(1),
    });
  }
  if (stats.ratingCount > 0) {
    facts.push({
      label: "Rating count",
      value: String(stats.ratingCount),
    });
  }
  if (stats.locationCount > 0) {
    facts.push({
      label: "Known locations",
      value: String(stats.locationCount),
    });
  }
  return facts;
}

function communityRatingLabel(
  avgRating: number | null,
  ratingCount: number | null,
) {
  const count = ratingCount ?? 0;
  if (count <= 0 || avgRating == null) return "Unrated";
  return avgRating.toFixed(1);
}

export default function BrandHero({
  brand,
  stats,
}: {
  brand: BrandDetail;
  stats: BrandCatalogueStats;
}) {
  const palette = brandAccentForSlug(brand.slug);
  const markets = marketChips(brand.facts.market_presence);
  const tags = tagChips(brand.facts);
  const eyebrow = originEyebrow(brand.facts);
  const rating = communityRatingLabel(stats.avgRating, stats.ratingCount);
  const facts = catalogueFacts(stats);
  const summary =
    brand.public_summary ||
    "We don't have a dossier for this brand yet. Ratings and photos still come from the community.";

  return (
    <article
      className={`grid overflow-hidden rounded-[2rem] border border-[#2b241f]/10 bg-gradient-to-br ${palette.accent} shadow-[0_12px_40px_rgba(74,51,32,0.06)] md:grid-cols-[17rem_1fr]`}
    >
      <div className="relative flex min-h-56 flex-col items-center justify-center overflow-hidden p-7 md:min-h-64">
        <div
          className={`absolute h-44 w-44 rounded-full ${palette.mascotBackdrop} opacity-25 blur-2xl`}
        />
        <div className="relative flex size-40 items-center justify-center rounded-[2rem] border border-white/80 bg-white/80 p-5 shadow-[0_14px_35px_rgba(73,49,31,0.14)] backdrop-blur sm:size-44">
          <BrandMark
            iconPath={brand.icon_path}
            name={brand.display}
            slug={brand.slug}
            size={512}
            displaySize={176}
            priority
          />
        </div>
      </div>

      <div className="flex flex-col justify-center border-t border-[#2b241f]/10 bg-white/30 p-7 backdrop-blur-[2px] md:border-l md:border-t-0 md:p-10">
        {eyebrow ? (
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] opacity-65">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-black tracking-[-0.035em] sm:text-5xl">
          {brand.display}
        </h1>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold sm:text-base">
          <Star
            className="size-4 fill-[#e8b84a] text-[#e8b84a]"
            aria-hidden="true"
          />
          <span>{rating}</span>
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-6 opacity-70 sm:text-base sm:leading-7">
          {summary}
        </p>
        {facts.length ? (
          <dl className="mt-5 flex flex-wrap gap-2">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="rounded-2xl border border-[#2b241f]/10 bg-white/60 px-3 py-2"
              >
                <dt className="text-[0.65rem] font-extrabold uppercase tracking-[0.16em] opacity-55">
                  {fact.label}
                </dt>
                <dd className="text-sm font-bold tabular-nums">{fact.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
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
    </article>
  );
}
