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

/**
 * Service-role client — server-only, bypasses RLS. Used exclusively for Storage
 * uploads/deletes from Server Actions, never for table queries (Drizzle owns those)
 * and never imported into client code.
 */
export function createServiceRoleClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // no-op: service-role client is never used for session-based auth
        },
      },
    }
  );
}
