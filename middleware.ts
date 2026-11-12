import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase environment variables are missing.");
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  // Validate the session with Supabase Auth; do not trust cookie contents alone.
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    const signInUrl = new URL("/autentificare", request.url);
    signInUrl.searchParams.set("next", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(signInUrl);
  }

  // Authentication alone is not enough for role-specific dashboards.
  const path = request.nextUrl.pathname;
  if (path.startsWith("/admin") || path.startsWith("/furnizor/panou")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = profile?.role === "admin";
    const allowed = path.startsWith("/admin")
      ? isAdmin
      : isAdmin || profile?.role === "provider";

    if (!allowed) {
      return NextResponse.redirect(new URL("/cont?access=denied", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/cont/:path*", "/admin/:path*", "/furnizor/panou/:path*"],
};
