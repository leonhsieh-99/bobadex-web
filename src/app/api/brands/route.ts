import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function aliasesBySlug(
  rows: Array<{ brand_slug: string | null; alias_display: string | null }> | null,
) {
  const grouped = new Map<string, string[]>();
  for (const row of rows ?? []) {
    const slug = row.brand_slug?.trim();
    const alias = row.alias_display?.trim();
    if (!slug || !alias) continue;
    const list = grouped.get(slug) ?? [];
    if (!list.includes(alias)) list.push(alias);
    grouped.set(slug, list);
  }
  return grouped;
}

async function loadBrands(supabase: Awaited<ReturnType<typeof createClient>>) {
  const [{ data: brands, error: brandsError }, { data: aliases, error: aliasError }] =
    await Promise.all([
      supabase.from("brands").select("slug, display, icon_path, status"),
      supabase.from("brand_aliases").select("brand_slug, alias_display"),
    ]);

  if (brandsError) throw brandsError;
  if (aliasError) throw aliasError;

  const grouped = aliasesBySlug(aliases);
  return (brands ?? []).map((brand) => ({
    ...brand,
    aliases: grouped.get(brand.slug) ?? [],
  }));
}

async function loadVersion(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase
    .from("brand_metadata")
    .select()
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.last_updated ?? "0";
}

export async function GET(req: Request) {
  const supabase = await createClient();
  const version = await loadVersion(supabase);
  const etag = `"brands-${version}"`;

  const ifNoneMatch = req.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=0, s-maxage=86400", // One day on CDN
      },
    });
  }

  const brands = await loadBrands(supabase);

  return NextResponse.json(brands, {
    headers: {
      ETag: etag,
      // Browser revalidates each load but CDN keeps a day
      "Cache-Control": "public, max-age=0, s-maxage=86400",
    },
  });
}
