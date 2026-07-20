import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";
config({ path: ".env.local" });

// This config is used only for `drizzle-kit generate` (producing SQL migration files /
// keeping schema.ts and docs/sql/*.md in sync) and `drizzle-kit studio` (local DB browsing).
// It is NOT used to auto-push migrations — per project convention, generated SQL is copied
// by hand into a new docs/sql/00X_*.md file and run manually in the Supabase SQL Editor.
export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
