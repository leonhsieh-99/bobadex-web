import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request
          })
          cookiesToSet.forEach(({ name, value, options, }) => 
            supabaseResponse.cookies.set(name, value, options)
          )
        }
      }
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;

  const isPublic =
    path === "/" ||
    path.startsWith("/login") ||
    path.startsWith("/auth") ||
    path.startsWith("/error") ||
    path.startsWith("/favicon");

    if (!user && !isPublic) {
      const full = request.nextUrl.pathname + request.nextUrl.search;
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.search = `?next=${encodeURIComponent(full)}`;
      return NextResponse.redirect(url);
    }

    if (user && (path === "/auth/login" || path === "/login" || path === "/auth")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return supabaseResponse
  }