import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BrandMark } from "@/features/brands/BrandMark";
import { getCachedBrandIndex } from "@/features/brands/loadBrandIndex";
import PublicShell from "@/shared/layout/PublicShell";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brands = await getCachedBrandIndex();
  const brand = brands.find((item) => item.slug === slug);
  if (!brand) return { title: "Brand — Bobadex" };
  return {
    title: `${brand.display} — Bobadex`,
    description: `The ${brand.display} page in the Bobadex catalogue.`,
  };
}

export default async function BrandDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brands = await getCachedBrandIndex();
  const brand = brands.find((item) => item.slug === slug);
  if (!brand) notFound();

  return (
    <PublicShell>
      <header className="mb-8 flex max-w-2xl items-center gap-5">
        <span className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-[1.6rem] border border-[#2b241f]/10 bg-white p-2">
          <BrandMark
            iconPath={brand.icon_path}
            name={brand.display}
            size={256}
            displaySize={80}
            priority
          />
        </span>
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
            Brand
          </p>
          <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            {brand.display}
          </h1>
        </div>
      </header>

      <p className="max-w-xl text-base leading-7 opacity-70">
        Full brand pages are next. This is just the catalogue entry so search
        and the constellation have somewhere to land.
      </p>
    </PublicShell>
  );
}
