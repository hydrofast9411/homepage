import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  // /admin lives outside the [locale] segment (Korean-only chrome, single admin) —
  // gate it with Supabase auth instead of running it through locale negotiation.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
    // Match everything except Next.js internals and static files, mirroring the
    // next-intl example matcher, so locale negotiation runs on real pages.
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
