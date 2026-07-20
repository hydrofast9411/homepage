import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

/**
 * Runs for every /admin/* request (see middleware.ts). Refreshes the Supabase
 * session cookie, then gates access: unauthenticated or non-admin-email sessions
 * are redirected to /admin/login. This — not the Postgres RLS policies — is the
 * real access control for the CMS, since Drizzle queries go around PostgREST/RLS.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAuthorized = !!user && (!ADMIN_EMAIL || user.email === ADMIN_EMAIL);

  if (!isAuthorized && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthorized && isLoginPage) {
    const dashboardUrl = new URL("/admin", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}
