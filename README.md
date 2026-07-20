# HYDROFAST website

Next.js (App Router, TypeScript) rebuild of the HYDROFAST corporate site — bilingual (KO/EN) marketing pages plus a CRUD admin backed by Supabase Postgres/Auth/Storage via Drizzle ORM. See `C:\Users\EFHYDRO\.claude\plans\review-the-whole-code-buzzing-hellman.md` for the full architecture writeup.

## One-time setup (do this before the site works)

1. **Apply the database schema.** Open the Supabase Dashboard for project `wmxfomqysadfmbxequsx` → SQL Editor, paste the contents of `docs/sql/001_initial_schema.md`'s SQL block, and run it. This creates every table, enables `pg_trgm`, and creates the 5 Storage buckets.
2. **Create the admin user.** In the same dashboard: Authentication → Providers → disable "Allow new users to sign up". Then Authentication → Users → add a user manually with the email/password you'll use to log into `/admin`.
3. **Fill in `.env.local`** (copy from `.env.example` if starting fresh):
   - `DATABASE_URL` — Project Settings → Database → Connection string → **Transaction pooler** URI (substitute your DB password).
   - `ADMIN_EMAIL` — the email of the user you created in step 2.
   - The Supabase URL/keys are already filled in from `.env.example`.
4. **Seed starter content** (optional but recommended so the site isn't empty):
   ```bash
   npm run db:seed            # 4 business areas, 2 affiliates, 16 partner brands + HydroFast, 9 product categories with spec schemas, history, certifications
   npm run db:migrate-legacy  # imports the legacy site's 17 case studies + 37 client logos and their images
   ```
   `db:migrate-legacy` expects the old static site at `../hydrofast_website` (sibling folder) — edit `LEGACY_ROOT` in `scripts/migrate-legacy-content.ts` if it's elsewhere.
5. Log into `/admin` and start adding manufacturers/products/etc. that aren't covered by the seed script (it only creates category *schemas* + a handful of reference rows — real product data is entered by hand through the admin, per the plan).

## Local development

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

## Schema changes going forward

Don't run `drizzle-kit push` against the live Supabase project. Instead:
1. Edit the schema files under `src/db/schema/`.
2. Run `npm run db:generate` to produce the migration SQL.
3. Copy that SQL into a new `docs/sql/00X_description.md` file (same format as `001_initial_schema.md`).
4. Paste it into the Supabase SQL Editor and run it by hand.

This keeps schema application deliberate and reviewable rather than an automated CI step.

## Deploying to Vercel

1. Go to vercel.com → Add New → Project → Import the `hydrofast9411/homepage` GitHub repo (Vercel auto-detects Next.js, no config needed).
2. In the project's Environment Variables settings, add everything from `.env.local` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `DATABASE_URL`, `ADMIN_EMAIL`, and set `NEXT_PUBLIC_SITE_URL` to the real production URL once known).
3. Deploy. Smoke-test both locales and `/admin` on the resulting `*.vercel.app` URL.
4. When ready to cut over the domain: Vercel project → Settings → Domains → add `hydrofast.co.kr`, then update the DNS records at your registrar per Vercel's instructions. Keep the legacy static host live until you've verified the new site end-to-end on the custom domain.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Drizzle ORM (Postgres) · Supabase (Auth + Storage) · next-intl (ko/en) · Framer Motion · Zod + react-hook-form · sharp (image resizing at upload time)
