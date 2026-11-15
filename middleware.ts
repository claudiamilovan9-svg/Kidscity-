import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    // Fail closed for protected routes when Auth is not configured.
    if (request.nextUrl.pathname.startsWith("/cont") || request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/autentificare?error=auth_unavailable", request.url));
    }
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: Parameters<typeof response.cookies.set>[2] }>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // getClaims verifies the JWT; getSession() only reads cookie contents.
  const { data: { claims }, error } = await supabase.auth.getClaims();
  const userId = !error && typeof claims?.sub === "string" ? claims.sub : null;
  const pathname = request.nextUrl.pathname;
  const isAccountRoute = pathname === "/cont" || pathname.startsWith("/cont/");
  const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

  function redirectWithCookies(path: string) {
    const destination = new URL(path, request.url);
    const redirectResponse = NextResponse.redirect(destination);
    response.cookies.getAll().forEach(cookie => redirectResponse.cookies.set(cookie));
    return redirectResponse;
  }

  if ((isAccountRoute || isAdminRoute) && !userId) {
    const loginUrl = new URL("/autentificare", request.url);
    loginUrl.searchParams.set("next", pathname);
    return redirectWithCookies(loginUrl.toString());
  }

  if (isAdminRoute && userId) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();

    if (profileError || profile?.role !== "admin") {
      return redirectWithCookies("/cont?error=access_denied");
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/cont/:path*",
    "/admin/:path*",
  ],
};
