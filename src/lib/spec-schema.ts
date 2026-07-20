import { z } from "zod";
import type { SpecFieldDef } from "@/db/schema/product-categories";

/**
 * Converts a product category's admin-defined spec_schema into a Zod object
 * schema, so a product's `specs` JSONB can be validated the same way on the
 * client (react-hook-form) and again inside the Server Action before writing
 * to the DB — validation is real, not cosmetic, even though the field set
 * itself is data, not code.
 */
export function buildSpecZodSchema(fields: SpecFieldDef[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let schema: z.ZodTypeAny;

    switch (field.dataType) {
      case "number":
      case "unit_value":
        schema = z.coerce.number();
        break;
      case "boolean":
        schema = z.coerce.boolean();
        break;
      case "select": {
        const values = (field.options ?? []).map((o) => o.value);
        schema = values.length > 0 ? z.enum(values as [string, ...string[]]) : z.string();
        break;
      }
      case "text":
      default:
        schema = z.string();
        break;
    }

    shape[field.key] = field.required ? schema : schema.optional().nullable();
  }

  return z.object(shape);
}

/** Parses a product's raw `specs` FormData entries against its category's schema. */
export function parseSpecsFromFormData(
  fields: SpecFieldDef[],
  formData: FormData
): Record<string, string | number | boolean> {
  const raw: Record<string, unknown> = {};
  for (const field of fields) {
    const value = formData.get(`spec_${field.key}`);
    if (field.dataType === "boolean") {
      raw[field.key] = value === "on";
    } else if (value !== null && value !== "") {
      raw[field.key] = value;
    }
  }
  return buildSpecZodSchema(fields).parse(raw) as Record<string, string | number | boolean>;
}
