import { pgTable, uuid, text, boolean, timestamp } from "drizzle-orm/pg-core";

export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  email: text("email").notNull(),
  phone: text("phone"),
  businessAreaInterest: text("business_area_interest"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  isRead: boolean("is_read").notNull().default(false),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
