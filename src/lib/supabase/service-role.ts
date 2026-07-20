import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client with no Next.js runtime dependency (no
 * next/headers, no cookies) — safe to import from both Next app code and
 * standalone scripts run via tsx (e.g. scripts/migrate-legacy-content.ts).
 * Bypasses RLS by design; used only for Storage uploads/deletes.
 */
export function createServiceRoleClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
