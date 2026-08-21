import { getCachedBrandIndex } from "@/features/brands/loadBrandIndex";
import HomePage from "@/features/home/HomePage";
import PublicShell from "@/shared/layout/PublicShell";

export const revalidate = 3600;

export default async function Home() {
  const brands = await getCachedBrandIndex();

  return (
    <PublicShell>
      <HomePage brands={brands} />
    </PublicShell>
  );
}
