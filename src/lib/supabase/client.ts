import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Only used for Auth (sign-in on /admin/login) —
 * table queries always go through Drizzle (src/db/client.ts) on the server.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
