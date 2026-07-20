import { pgTable, uuid, text, integer, boolean } from "drizzle-orm/pg-core";

export const clientLogos = pgTable("client_logos", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  logoPath: text("logo_path").notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type ClientLogo = typeof clientLogos.$inferSelect;
export type NewClientLogo = typeof clientLogos.$inferInsert;
