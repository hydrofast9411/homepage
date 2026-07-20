import { pgTable, uuid, text, integer, date } from "drizzle-orm/pg-core";

export type CertificationCategory = "patent" | "certification" | "award";

export const certifications = pgTable("certifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  titleKo: text("title_ko").notNull(),
  titleEn: text("title_en"),
  issuingBodyKo: text("issuing_body_ko"),
  issuingBodyEn: text("issuing_body_en"),
  certNumber: text("cert_number"),
  issueDate: date("issue_date"),
  imagePath: text("image_path"),
  category: text("category").$type<CertificationCategory>().notNull().default("certification"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Certification = typeof certifications.$inferSelect;
export type NewCertification = typeof certifications.$inferInsert;
