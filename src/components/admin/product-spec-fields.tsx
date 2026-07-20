"use client";

import type { SpecFieldDef } from "@/db/schema/product-categories";

/**
 * Renders one input per field in a category's spec_schema, in sort order.
 * Field name is `spec_<key>` so the Server Action (lib/spec-schema.ts ->
 * parseSpecsFromFormData) can read it back out generically for any category.
 */
export function ProductSpecFields({
  fields,
  initialSpecs = {},
}: {
  fields: SpecFieldDef[];
  initialSpecs?: Record<string, string | number | boolean>;
}) {
  if (fields.length === 0) {
    return (
      <p className="text-sm text-[var(--color-ink-soft)]">
        분류를 선택하면 해당 분류의 스펙 입력란이 표시됩니다.
      </p>
    );
  }

  const sorted = [...fields].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="grid grid-cols-2 gap-4">
      {sorted.map((field) => {
        const name = `spec_${field.key}`;
        const initial = initialSpecs[field.key];

        if (field.dataType === "boolean") {
          return (
            <label key={field.key} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name={name} defaultChecked={Boolean(initial)} />
              {field.labelKo}
              {field.required && <span className="text-[var(--color-safety-orange)]">*</span>}
            </label>
          );
        }

        if (field.dataType === "select") {
          return (
            <div key={field.key}>
              <label className="mb-1 block text-sm font-medium">
                {field.labelKo}
                {field.required && <span className="text-[var(--color-safety-orange)]">*</span>}
              </label>
              <select
                name={name}
                defaultValue={initial !== undefined ? String(initial) : ""}
                required={field.required}
                className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
              >
                <option value="">선택</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.labelKo}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        return (
          <div key={field.key}>
            <label className="mb-1 block text-sm font-medium">
              {field.labelKo}
              {field.required && <span className="text-[var(--color-safety-orange)]">*</span>}
              {field.unit && <span className="text-[var(--color-ink-soft)]"> ({field.unit})</span>}
            </label>
            <input
              type={field.dataType === "number" || field.dataType === "unit_value" ? "number" : "text"}
              step="any"
              name={name}
              defaultValue={initial !== undefined ? String(initial) : ""}
              required={field.required}
              className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
            />
          </div>
        );
      })}
    </div>
  );
}
