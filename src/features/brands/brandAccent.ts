const BRAND_ACCENTS = [
  {
    accent: "from-[#fff3c7] to-[#ffe4a8]",
    mascotBackdrop: "bg-[#ffc84a]",
  },
  {
    accent: "from-[#ffe8e2] to-[#ffd0c5]",
    mascotBackdrop: "bg-[#ef5b46]",
  },
  {
    accent: "from-[#e8f4ed] to-[#cde8d8]",
    mascotBackdrop: "bg-[#78b88d]",
  },
  {
    accent: "from-[#eef3dc] to-[#d7e4b5]",
    mascotBackdrop: "bg-[#7a9a3a]",
  },
  {
    accent: "from-[#fde8e8] to-[#f5c8c8]",
    mascotBackdrop: "bg-[#c43b3b]",
  },
] as const;

export type BrandAccent = (typeof BRAND_ACCENTS)[number];

export function brandAccentForSlug(slug: string): BrandAccent {
  let hash = 0;
  for (const char of slug) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return BRAND_ACCENTS[hash % BRAND_ACCENTS.length] ?? BRAND_ACCENTS[0];
}
