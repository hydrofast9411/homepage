# 002 — Business-area marketing content (CMS-managed)

Adds the columns that let the 5 headline business-area pages be edited from the
admin instead of living in code. `content_json` holds the section/block document
rendered by `BusinessContent` (same shape as `ContentSection[]`).

Apply in the Supabase SQL Editor (idempotent — safe to re-run). The seed script
`npm run db:seed-content` also applies these via `ALTER TABLE ... IF NOT EXISTS`
before populating, so on a dev machine running the seed is enough.

```sql
ALTER TABLE business_areas ADD COLUMN IF NOT EXISTS tagline_ko text;
ALTER TABLE business_areas ADD COLUMN IF NOT EXISTS tagline_en text;
ALTER TABLE business_areas ADD COLUMN IF NOT EXISTS accent text;
ALTER TABLE business_areas ADD COLUMN IF NOT EXISTS area_index text;
ALTER TABLE business_areas ADD COLUMN IF NOT EXISTS card_image_path text;
ALTER TABLE business_areas ADD COLUMN IF NOT EXISTS content_json jsonb NOT NULL DEFAULT '[]'::jsonb;
```
