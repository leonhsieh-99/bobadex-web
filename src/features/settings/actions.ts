"use server";

import { cookies } from "next/headers";
import {
  BRAND_VISUALS_COOKIE,
  type BrandVisuals,
  parseBrandVisuals,
} from "./brandVisuals";

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function saveBrandVisualsCookie(visuals: BrandVisuals) {
  const cookieStore = await cookies();
  cookieStore.set(BRAND_VISUALS_COOKIE, parseBrandVisuals(visuals), {
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    sameSite: "lax",
  });
}
