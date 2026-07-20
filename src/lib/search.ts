import type { SpecFieldDef } from "@/db/schema/product-categories";

/**
 * Builds the denormalized `products.search_text` value written on every
 * create/update. Concatenates bilingual name/description, manufacturer and
 * category names, model number, and the flattened *values* (not keys) of
 * `specs` — so a keyword like "6900" or a select option's label matches too.
 * Indexed with a pg_trgm GIN index (see docs/sql/001_initial_schema.md);
 * Postgres has no Korean stemmer, so trigram similarity is used instead of
 * native tsvector full-text search.
 */
export function buildSearchText(input: {
  nameKo: string;
  nameEn?: string | null;
  shortDescriptionKo?: string | null;
  shortDescriptionEn?: string | null;
  modelNo?: string | null;
  manufacturerName?: string | null;
  categoryNameKo?: string | null;
  categoryNameEn?: string | null;
  specs: Record<string, string | number | boolean>;
  specSchema: SpecFieldDef[];
}) {
  const specValues = input.specSchema
    .map((field) => {
      const value = input.specs[field.key];
      if (value === undefined || value === null || value === "") return null;
      if (field.dataType === "select") {
        const option = field.options?.find((o) => o.value === String(value));
        return [value, option?.labelKo, option?.labelEn].filter(Boolean).join(" ");
      }
      return String(value);
    })
    .filter(Boolean);

  return [
    input.nameKo,
    input.nameEn,
    input.shortDescriptionKo,
    input.shortDescriptionEn,
    input.modelNo,
    input.manufacturerName,
    input.categoryNameKo,
    input.categoryNameEn,
    ...specValues,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
