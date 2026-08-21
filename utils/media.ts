const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ASSET_URL =
  process.env.NEXT_PUBLIC_SUPABASE_ASSET_URL ?? SUPABASE_URL;

export function publicStorageURL(bucket: string, path: string) {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${clean}`;
}

export function publicAssetURL(bucket: string, path: string) {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `${SUPABASE_ASSET_URL}/storage/v1/object/public/${bucket}/${clean}`;
}

export function thumbPath(path: string, size: 256 | 512) {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `thumbs/s${size}/${clean}`;
}
