import { pgTable, uuid, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import type { ContentSection } from "@/content/business-areas";

export const businessAreas = pgTable("business_areas", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  nameKo: text("name_ko").notNull(),
  nameEn: text("name_en"),
  summaryKo: text("summary_ko"),
  summaryEn: text("summary_en"),
  descriptionKo: text("description_ko"),
  descriptionEn: text("description_en"),
  // Marketing/detail-page fields (brochure-derived). `contentJson` holds the
  // full section/block document rendered by BusinessContent — edited in the
  // admin via BlockEditor, so the 5 headline pages are fully CMS-managed.
  taglineKo: text("tagline_ko"),
  taglineEn: text("tagline_en"),
  accent: text("accent"),
  areaIndex: text("area_index"),
  heroImagePath: text("hero_image_path"),
  cardImagePath: text("card_image_path"),
  contentJson: jsonb("content_json").$type<ContentSection[]>().notNull().default([]),
  iconKey: text("icon_key"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type BusinessArea = typeof businessAreas.$inferSelect;
export type NewBusinessArea = typeof businessAreas.$inferInsert;
