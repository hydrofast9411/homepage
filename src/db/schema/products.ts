import { pgTable, uuid, text, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { manufacturers } from "./manufacturers";
import { productCategories } from "./product-categories";
import { businessAreas } from "./business-areas";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull().unique(),
    modelNo: text("model_no"),
    manufacturerId: uuid("manufacturer_id").references(() => manufacturers.id, {
      onDelete: "set null",
    }),
    categoryId: uuid("category_id").references(() => productCategories.id, {
      onDelete: "set null",
    }),
    businessAreaId: uuid("business_area_id").references(() => businessAreas.id, {
      onDelete: "set null",
    }),
    nameKo: text("name_ko").notNull(),
    nameEn: text("name_en"),
    shortDescriptionKo: text("short_description_ko"),
    shortDescriptionEn: text("short_description_en"),
    descriptionKo: text("description_ko"),
    descriptionEn: text("description_en"),
    // Keyed against this product's category.specSchema[].key
    specs: jsonb("specs").$type<Record<string, string | number | boolean>>().notNull().default({}),
    primaryImagePath: text("primary_image_path"),
    isPublished: boolean("is_published").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    // Maintained on every write in the same server action — see lib/search.ts
    searchText: text("search_text").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("products_category_idx").on(table.categoryId),
    index("products_manufacturer_idx").on(table.manufacturerId),
    index("products_business_area_idx").on(table.businessAreaId),
    // NB: the gin_trgm_ops GIN index on search_text is created in docs/sql/001_initial_schema.md —
    // drizzle-orm doesn't have a first-class builder for trigram opclasses, so it's SQL-only.
  ]
);

export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  storagePath: text("storage_path").notNull(),
  altKo: text("alt_ko"),
  altEn: text("alt_en"),
  sortOrder: integer("sort_order").notNull().default(0),
  isPrimary: boolean("is_primary").notNull().default(false),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
