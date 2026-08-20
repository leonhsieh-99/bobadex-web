import type { Metadata } from "next";
import BrandsExplorer from "@/features/brands/BrandsExplorer";
import { getCachedBrandIndex } from "@/features/brands/loadBrandIndex";
import PublicShell from "@/shared/layout/PublicShell";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Brands — Bobadex",
  description: "Browse the full Bobadex catalogue of boba brands.",
};

export default async function BrandsPage() {
  const brands = await getCachedBrandIndex();

  return (
    <PublicShell>
      <header className="mb-8 max-w-2xl">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
          Catalogue
        </p>
        <h1 className="text-4xl font-black tracking-[-0.04em] sm:text-5xl">
          All brands
        </h1>
        <p className="mt-4 text-base leading-7 opacity-70 sm:text-lg">
          The full dex, readable by anyone. Logging a shop or a drink still
          needs an account.
        </p>
      </header>

      <BrandsExplorer brands={brands} />
    </PublicShell>
  );
}
