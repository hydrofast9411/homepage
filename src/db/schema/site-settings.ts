import { pgTable, text, jsonb } from "drizzle-orm/pg-core";

export const siteSettings = pgTable("site_settings", {
  settingKey: text("setting_key").primaryKey(),
  valueKo: text("value_ko"),
  valueEn: text("value_en"),
  valueJson: jsonb("value_json"),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;
