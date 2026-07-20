import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./schema";

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let cached: DrizzleDb | null = null;

function getDb(): DrizzleDb {
  if (cached) return cached;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill in the Supabase " +
        "Postgres connection string (Transaction pooler URI) from the Supabase dashboard."
    );
  }

  // `prepare: false` is required against Supabase's transaction-mode pooler (pgbouncer),
  // which does not support prepared statements.
  const client = postgres(connectionString, { prepare: false });
  cached = drizzle(client, { schema });
  return cached;
}

// Lazily instantiated on first query rather than at import time — this lets
// Next.js evaluate route modules (e.g. to read segment config) at build time
// even before DATABASE_URL is configured, deferring the real connection
// attempt to when a Server Component/Action actually calls db.<method>().
export const db: DrizzleDb = new Proxy({} as DrizzleDb, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});
