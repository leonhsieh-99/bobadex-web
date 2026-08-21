import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/utils/supabase/public";
import { emptyProfileFacts, parseProfileFacts } from "./parseProfileFacts";
import type {
  BrandDetail,
  BrandGalleryPhoto,
  BrandProfileFacts,
} from "./types";

type CatalogRow = {
  slug: string | null;
  display: string | null;
  icon_path: string | null;
  avg_rating: number | string | null;
  rating_count: number | string | null;
  has_profile: boolean | null;
  public_summary: string | null;
};

type ProfileRow = {
  public_summary: string | null;
  profile_facts: unknown;
};

type GalleryRow = {
  id: string | null;
  image_path: string | null;
  comment: string | null;
  visibility?: string | null;
};

async function loadBrandFacts(slug: string): Promise<BrandDetail | null> {
  const supabase = createPublicClient();

  const catalogResult = await supabase
    .from("public_brand_catalog")
    .select(
      "slug, display, icon_path, avg_rating, rating_count, has_profile, public_summary",
    )
    .eq("slug", slug)
    .maybeSingle();

  let catalog: CatalogRow | null = catalogResult.data as CatalogRow | null;
  let brandAliases: string[] = [];

  if (catalogResult.error) {
    const { data: brand } = await supabase
      .from("brands")
      .select("slug, display, icon_path, aliases, is_demo")
      .eq("slug", slug)
      .maybeSingle();

    if (!brand?.slug || !brand.display || brand.is_demo) return null;

    catalog = {
      slug: brand.slug as string,
      display: brand.display as string,
      icon_path: (brand.icon_path as string | null) ?? null,
      avg_rating: null,
      rating_count: null,
      has_profile: false,
      public_summary: null,
    };
    brandAliases = asStringList(brand.aliases);
  }

  if (!catalog?.slug || !catalog.display) return null;

  const [profile, aliasRows] = await Promise.all([
    loadProfile(supabase, slug),
    loadAliases(supabase, slug),
  ]);

  const facts = mergeFacts(profile.facts, [...brandAliases, ...aliasRows]);
  const publicSummary =
    asTrimmed(catalog.public_summary) ?? profile.publicSummary;
  const hasProfile =
    Boolean(catalog.has_profile) ||
    Boolean(publicSummary) ||
    hasAnyFacts(facts);

  return {
    slug: catalog.slug,
    display: catalog.display,
    icon_path: catalog.icon_path,
    avg_rating: asNumber(catalog.avg_rating),
    rating_count: asNumber(catalog.rating_count),
    has_profile: hasProfile,
    public_summary: publicSummary,
    facts,
  };
}

async function loadBrandGallery(slug: string): Promise<BrandGalleryPhoto[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.rpc("get_brand_gallery", {
    brand_slug: slug,
    limit_count: 20,
    offset_count: 0,
  });

  if (error || !data) return [];

  return (data as GalleryRow[]).flatMap((row) => {
    const id = row.id;
    const imagePath = row.image_path?.trim();
    if (!id || !imagePath) return [];
    if (row.visibility && row.visibility !== "public") return [];
    return [
      {
        id,
        image_path: imagePath,
        comment: asTrimmed(row.comment),
      },
    ];
  });
}

export const getCachedBrandDetail = unstable_cache(
  loadBrandFacts,
  ["brand-detail"],
  { revalidate: 60 * 60 },
);

export const getCachedBrandGallery = unstable_cache(
  loadBrandGallery,
  ["brand-gallery"],
  { revalidate: 5 * 60 },
);

async function loadProfile(
  supabase: ReturnType<typeof createPublicClient>,
  slug: string,
) {
  const columns = "public_summary, profile_facts";
  let result = await supabase
    .from("brand_profiles")
    .select(columns)
    .eq("slug", slug)
    .maybeSingle();

  if (result.error && isMissingColumn(result.error.message, "slug")) {
    result = await supabase
      .from("brand_profiles")
      .select(columns)
      .eq("brand_slug", slug)
      .maybeSingle();
  }

  if (result.error || !result.data) {
    return { publicSummary: null as string | null, facts: emptyProfileFacts() };
  }

  const row = result.data as ProfileRow;
  return {
    publicSummary: asTrimmed(row.public_summary),
    facts: parseProfileFacts(row.profile_facts),
  };
}

async function loadAliases(
  supabase: ReturnType<typeof createPublicClient>,
  slug: string,
) {
  const withDisplay = await supabase
    .from("brand_aliases")
    .select("alias_display")
    .eq("brand_slug", slug);

  if (!withDisplay.error) {
    return (withDisplay.data ?? [])
      .map((row) => asTrimmed(row.alias_display as string | null))
      .filter((value): value is string => Boolean(value));
  }

  return [];
}

function mergeFacts(
  facts: BrandProfileFacts,
  extraAliases: string[],
): BrandProfileFacts {
  const aliases = uniqueNames([...facts.aliases, ...extraAliases]);
  return { ...facts, aliases };
}

function hasAnyFacts(facts: BrandProfileFacts) {
  return Boolean(
    facts.founded_place ||
      facts.founded_year ||
      facts.market_presence.length ||
      facts.signature_products.length ||
      facts.known_for.length ||
      facts.product_categories.length ||
      facts.aliases.length ||
      facts.extras.length,
  );
}

function asTrimmed(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function asNumber(value: number | string | null | undefined) {
  if (value == null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function asStringList(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function uniqueNames(values: string[]) {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const value of values) {
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    names.push(value);
  }
  return names;
}

function isMissingColumn(message: string, column: string) {
  return message.toLowerCase().includes(column.toLowerCase());
}
