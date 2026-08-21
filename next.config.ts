import type { NextConfig } from "next";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;
const supabaseAssetHost = process.env.NEXT_PUBLIC_SUPABASE_ASSET_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_ASSET_URL).hostname
  : undefined;

const imageHosts = [
  ...new Set([supabaseHost, supabaseAssetHost].filter(Boolean)),
] as string[];

const nextConfig: NextConfig = {
  images: {
    // Brand thumbs are immutable hashes; keep optimized copies on the CDN.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: imageHosts.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
