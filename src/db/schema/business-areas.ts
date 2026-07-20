import { pgTable, uuid, text, integer, timestamp } from "drizzle-orm/pg-core";

export const businessAreas = pgTable("business_areas", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  nameKo: text("name_ko").notNull(),
  nameEn: text("name_en"),
  summaryKo: text("summary_ko"),
  summaryEn: text("summary_en"),
  descriptionKo: text("description_ko"),
  descriptionEn: text("description_en"),
  heroImagePath: text("hero_image_path"),
  iconKey: text("icon_key"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BusinessArea = typeof businessAreas.$inferSelect;
export type NewBusinessArea = typeof businessAreas.$inferInsert;
