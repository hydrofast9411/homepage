import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Server-side Supabase client bound to the current request's cookies.
 * Used in Server Components / Server Actions to read the logged-in admin's session.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component render (not a Server Action/Route Handler) —
            // safe to ignore since middleware.ts refreshes the session on every request.
          }
        },
      },
    }
  );
}

// Service-role client moved to lib/supabase/service-role.ts (no next/headers
// dependency there, so it's importable from standalone scripts too).
export { createServiceRoleClient } from "./service-role";
