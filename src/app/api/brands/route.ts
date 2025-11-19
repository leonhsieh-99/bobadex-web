import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

async function loadBrands(supabase: any) {
  const { data, error } = await supabase
    .from('brands')
    .select('slug, display, aliases, icon_path, status')
  
  if (error) throw error
  return data ?? [];
}

async function loadVersion(supabase: any) {
  const { data, error } = await supabase
    .from('brand_metadata')
    .select()
    .limit(1)
    .maybeSingle()
  
  if (error) throw error
  return data?.last_updated ?? '0'
}

export async function GET(req:Request) {
  const supabase = await createClient();
  const version = await loadVersion(supabase);
  const etag = `"brands-${version}"`

  const ifNoneMatch = req.headers.get('if-none-match');
  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=0, s-maxage=86400" // One day on CDN
      }
    })
  }

  const brands = await loadBrands(supabase);

  return NextResponse.json(brands, {
    headers: {
      ETag: etag,
      // Browser revalidates each load but CDN keeps a day
      "Cache-Control": "public, max-age=0, s-maxage=86400"
    }
  })
}
