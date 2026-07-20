/**
 * Applies the 002 migration (idempotent) and seeds/updates the 5 headline
 * business areas — name, tagline, summary, accent, index, hero/card image and
 * the full `content_json` block document — from the hand-authored brochure
 * content module (src/content/business-areas.ts).
 *
 *   npm run db:seed-content
 *
 * Safe to re-run: upserts by slug and overwrites the marketing fields, so this
 * is the way to push edits made in the content module to the DB. After the
 * first run the same content is fully editable from /admin/business-areas.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { sql, eq } from "drizzle-orm";
import { db } from "../src/db/client";
import { businessAreas } from "../src/db/schema";
import { BUSINESS_AREAS } from "../src/content/business-areas";

async function migrate() {
  console.log("Applying 002 columns (idempotent)...");
  await db.execute(sql`ALTER TABLE business_areas ADD COLUMN IF NOT EXISTS tagline_ko text`);
  await db.execute(sql`ALTER TABLE business_areas ADD COLUMN IF NOT EXISTS tagline_en text`);
  await db.execute(sql`ALTER TABLE business_areas ADD COLUMN IF NOT EXISTS accent text`);
  await db.execute(sql`ALTER TABLE business_areas ADD COLUMN IF NOT EXISTS area_index text`);
  await db.execute(sql`ALTER TABLE business_areas ADD COLUMN IF NOT EXISTS card_image_path text`);
  await db.execute(
    sql`ALTER TABLE business_areas ADD COLUMN IF NOT EXISTS content_json jsonb NOT NULL DEFAULT '[]'::jsonb`
  );
}

async function seed() {
  for (const area of BUSINESS_AREAS) {
    const values = {
      slug: area.slug,
      nameKo: area.name.ko,
      nameEn: area.name.en ?? null,
      summaryKo: area.summary.ko,
      summaryEn: area.summary.en ?? null,
      taglineKo: area.tagline.ko,
      taglineEn: area.tagline.en ?? null,
      accent: area.accent,
      areaIndex: area.index,
      heroImagePath: area.heroImage,
      cardImagePath: area.cardImage,
      contentJson: area.sections,
      sortOrder: area.order,
      updatedAt: new Date(),
    };

    const [existing] = await db.select().from(businessAreas).where(eq(businessAreas.slug, area.slug));
    if (existing) {
      await db.update(businessAreas).set(values).where(eq(businessAreas.slug, area.slug));
      console.log(`  updated ${area.slug}`);
    } else {
      await db.insert(businessAreas).values(values);
      console.log(`  inserted ${area.slug}`);
    }
  }
}

async function main() {
  await migrate();
  await seed();
  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
