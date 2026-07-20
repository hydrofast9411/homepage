import { pgTable, uuid, text, integer, boolean } from "drizzle-orm/pg-core";

export const historyEvents = pgTable("history_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  year: integer("year").notNull(),
  month: integer("month"),
  titleKo: text("title_ko").notNull(),
  titleEn: text("title_en"),
  descriptionKo: text("description_ko"),
  descriptionEn: text("description_en"),
  isHighlight: boolean("is_highlight").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type HistoryEvent = typeof historyEvents.$inferSelect;
export type NewHistoryEvent = typeof historyEvents.$inferInsert;
