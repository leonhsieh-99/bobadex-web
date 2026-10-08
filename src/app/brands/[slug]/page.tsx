import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandFactsStrip from "@/features/brands/BrandFactsStrip";
import BrandHero from "@/features/brands/BrandHero";
import BrandPhotoStrip from "@/features/brands/BrandPhotoStrip";
import BrandVisitCta from "@/features/brands/BrandVisitCta";
import {
  getCachedBrandDetail,
  getCachedBrandGallery,
} from "@/features/brands/loadBrandDetail";
import { getCachedBrandIndex } from "@/features/brands/loadBrandIndex";
import type { BrandCatalogueStats, BrandDetail } from "@/features/brands/types";
import { getCachedBrandRankings } from "@/features/rankings/loadRankings";
import type { BrandRanking } from "@/features/rankings/types";
import PublicShell from "@/shared/layout/PublicShell";

export const revalidate = 300;

export async function generateStaticParams() {
  const brands = await getCachedBrandIndex();
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getCachedBrandDetail(slug);
  if (!brand) return { title: "Brand — Bobadex" };
  const title = `${brand.display} — Bobadex`;
  const description =
    brand.public_summary ??
    `The ${brand.display} page in the Bobadex catalogue.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [brand, photos, rankings] = await Promise.all([
    getCachedBrandDetail(slug),
    getCachedBrandGallery(slug),
    getCachedBrandRankings(),
  ]);
  if (!brand) notFound();

  return (
    <PublicShell>
      <p className="mb-6 text-sm font-semibold opacity-60">
        <Link href="/brands" className="hover:opacity-100">
          All brands
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="opacity-80">{brand.display}</span>
      </p>

      <div className="space-y-12">
        <BrandHero brand={brand} stats={catalogueStats(brand, rankings)} />
        <BrandFactsStrip brand={brand} />
        <BrandPhotoStrip photos={photos} />
        <BrandVisitCta slug={brand.slug} display={brand.display} />
      </div>
    </PublicShell>
  );
}

function catalogueStats(
  brand: BrandDetail,
  rankings: BrandRanking[],
): BrandCatalogueStats {
  const row = rankings.find((item) => item.slug === brand.slug);
  const ratingCount = row?.rating_count ?? brand.rating_count ?? 0;
  const avgRating = row?.avg_rating ?? brand.avg_rating;
  return {
    avgRating: ratingCount > 0 ? avgRating : null,
    ratingCount,
    communityScore:
      row?.community_score != null && ratingCount > 0
        ? row.community_score
        : null,
    locationCount: row?.location_count ?? 0,
  };
}
