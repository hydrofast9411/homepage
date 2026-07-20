import { pgTable, uuid, text, integer } from "drizzle-orm/pg-core";

export const affiliates = pgTable("affiliates", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(), // dongshin | efhydro
  nameKo: text("name_ko").notNull(),
  nameEn: text("name_en"),
  taglineKo: text("tagline_ko"),
  taglineEn: text("tagline_en"),
  logoPath: text("logo_path"),
  heroImagePath: text("hero_image_path"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const affiliateSections = pgTable("affiliate_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  affiliateId: uuid("affiliate_id")
    .notNull()
    .references(() => affiliates.id, { onDelete: "cascade" }),
  sectionKey: text("section_key").notNull(),
  headingKo: text("heading_ko"),
  headingEn: text("heading_en"),
  bodyKo: text("body_ko"),
  bodyEn: text("body_en"),
  imagePath: text("image_path"),
  layoutVariant: text("layout_variant"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Affiliate = typeof affiliates.$inferSelect;
export type NewAffiliate = typeof affiliates.$inferInsert;
export type AffiliateSection = typeof affiliateSections.$inferSelect;
export type NewAffiliateSection = typeof affiliateSections.$inferInsert;
