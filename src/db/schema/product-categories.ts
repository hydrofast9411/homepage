import { pgTable, uuid, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { businessAreas } from "./business-areas";

/**
 * One element of `spec_schema`. This is the admin-defined shape that drives
 * both the dynamic product form (lib/spec-schema.ts) and the product detail
 * page's spec table. `key` becomes the JSON key inside a product's `specs`.
 */
export type SpecFieldDataType = "text" | "number" | "unit_value" | "select" | "boolean";

export interface SpecFieldOption {
  value: string;
  labelKo: string;
  labelEn?: string;
}

export interface SpecFieldDef {
  key: string;
  labelKo: string;
  labelEn?: string;
  dataType: SpecFieldDataType;
  unit?: string;
  options?: SpecFieldOption[];
  required: boolean;
  sortOrder: number;
  showInCardTeaser: boolean;
}

export const productCategories = pgTable("product_categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessAreaId: uuid("business_area_id").references(() => businessAreas.id, {
    onDelete: "set null",
  }),
  slug: text("slug").notNull().unique(),
  nameKo: text("name_ko").notNull(),
  nameEn: text("name_en"),
  descriptionKo: text("description_ko"),
  descriptionEn: text("description_en"),
  iconKey: text("icon_key"),
  sortOrder: integer("sort_order").notNull().default(0),
  specSchema: jsonb("spec_schema").$type<SpecFieldDef[]>().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;
