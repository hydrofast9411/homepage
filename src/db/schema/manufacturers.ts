import { pgTable, uuid, text, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { businessAreas } from "./business-areas";

export const manufacturers = pgTable("manufacturers", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  country: text("country"),
  logoPath: text("logo_path"),
  websiteUrl: text("website_url"),
  descriptionKo: text("description_ko"),
  descriptionEn: text("description_en"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const manufacturerBusinessAreas = pgTable(
  "manufacturer_business_areas",
  {
    manufacturerId: uuid("manufacturer_id")
      .notNull()
      .references(() => manufacturers.id, { onDelete: "cascade" }),
    businessAreaId: uuid("business_area_id")
      .notNull()
      .references(() => businessAreas.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.manufacturerId, table.businessAreaId] })]
);

export type Manufacturer = typeof manufacturers.$inferSelect;
export type NewManufacturer = typeof manufacturers.$inferInsert;
