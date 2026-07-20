import { relations } from "drizzle-orm";
import { businessAreas } from "./business-areas";
import { productCategories } from "./product-categories";
import { manufacturers, manufacturerBusinessAreas } from "./manufacturers";
import { products, productImages } from "./products";
import { caseStudies } from "./case-studies";
import { clientLogos } from "./client-logos";
import { historyEvents } from "./history-events";
import { certifications } from "./certifications";
import { affiliates, affiliateSections } from "./affiliates";
import { siteSettings } from "./site-settings";
import { inquiries } from "./inquiries";

export * from "./business-areas";
export * from "./product-categories";
export * from "./manufacturers";
export * from "./products";
export * from "./case-studies";
export * from "./client-logos";
export * from "./history-events";
export * from "./certifications";
export * from "./affiliates";
export * from "./site-settings";
export * from "./inquiries";

export const businessAreasRelations = relations(businessAreas, ({ many }) => ({
  categories: many(productCategories),
  products: many(products),
  caseStudies: many(caseStudies),
  manufacturerLinks: many(manufacturerBusinessAreas),
}));

export const productCategoriesRelations = relations(productCategories, ({ one, many }) => ({
  businessArea: one(businessAreas, {
    fields: [productCategories.businessAreaId],
    references: [businessAreas.id],
  }),
  products: many(products),
}));

export const manufacturersRelations = relations(manufacturers, ({ many }) => ({
  products: many(products),
  businessAreaLinks: many(manufacturerBusinessAreas),
}));

export const manufacturerBusinessAreasRelations = relations(manufacturerBusinessAreas, ({ one }) => ({
  manufacturer: one(manufacturers, {
    fields: [manufacturerBusinessAreas.manufacturerId],
    references: [manufacturers.id],
  }),
  businessArea: one(businessAreas, {
    fields: [manufacturerBusinessAreas.businessAreaId],
    references: [businessAreas.id],
  }),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  manufacturer: one(manufacturers, {
    fields: [products.manufacturerId],
    references: [manufacturers.id],
  }),
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  businessArea: one(businessAreas, {
    fields: [products.businessAreaId],
    references: [businessAreas.id],
  }),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const caseStudiesRelations = relations(caseStudies, ({ one }) => ({
  businessArea: one(businessAreas, {
    fields: [caseStudies.businessAreaId],
    references: [businessAreas.id],
  }),
}));

export const affiliatesRelations = relations(affiliates, ({ many }) => ({
  sections: many(affiliateSections),
}));

export const affiliateSectionsRelations = relations(affiliateSections, ({ one }) => ({
  affiliate: one(affiliates, {
    fields: [affiliateSections.affiliateId],
    references: [affiliates.id],
  }),
}));

// Re-exported for schema registration in the Drizzle client.
export const schema = {
  businessAreas,
  productCategories,
  manufacturers,
  manufacturerBusinessAreas,
  products,
  productImages,
  caseStudies,
  clientLogos,
  historyEvents,
  certifications,
  affiliates,
  affiliateSections,
  siteSettings,
  inquiries,
};
