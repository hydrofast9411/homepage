import { pgTable, uuid, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { businessAreas } from "./business-areas";

export const caseStudies = pgTable("case_studies", {
  id: uuid("id").defaultRandom().primaryKey(),
  clientName: text("client_name").notNull(),
  titleKo: text("title_ko").notNull(),
  titleEn: text("title_en"),
  descriptionKo: text("description_ko"),
  descriptionEn: text("description_en"),
  imagePath: text("image_path"),
  aspectRatio: text("aspect_ratio").notNull().default("21-9"),
  businessAreaId: uuid("business_area_id").references(() => businessAreas.id, {
    onDelete: "set null",
  }),
  isPublished: boolean("is_published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type CaseStudy = typeof caseStudies.$inferSelect;
export type NewCaseStudy = typeof caseStudies.$inferInsert;
