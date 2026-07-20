"use client";

import { useState } from "react";
import type { SpecFieldDef, SpecFieldDataType, SpecFieldOption } from "@/db/schema/product-categories";

const DATA_TYPES: { value: SpecFieldDataType; label: string }[] = [
  { value: "text", label: "텍스트" },
  { value: "number", label: "숫자" },
  { value: "unit_value", label: "숫자 + 단위 (예: 6900 bar)" },
  { value: "select", label: "선택 목록" },
  { value: "boolean", label: "예/아니오" },
];

function emptyField(sortOrder: number): SpecFieldDef {
  return {
    key: "",
    labelKo: "",
    labelEn: "",
    dataType: "text",
    unit: "",
    options: [],
    required: false,
    sortOrder,
    showInCardTeaser: false,
  };
}

/**
 * The centerpiece of the admin: lets a non-technical admin define, per
 * product category, exactly which spec fields a product has (key, bilingual
 * label, data type, unit, select options, required, and whether it should
 * surface as the card-search teaser). Serializes to a hidden JSON input that
 * the category form submits alongside its other fields.
 */
export function SpecFieldBuilder({ name, initial }: { name: string; initial: SpecFieldDef[] }) {
  const [fields, setFields] = useState<SpecFieldDef[]>(initial.length > 0 ? initial : []);

  function update(index: number, patch: Partial<SpecFieldDef>) {
    setFields((prev) => prev.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function addField() {
    setFields((prev) => [...prev, emptyField(prev.length)]);
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index).map((f, i) => ({ ...f, sortOrder: i })));
  }

  function moveField(index: number, dir: -1 | 1) {
    setFields((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((f, i) => ({ ...f, sortOrder: i }));
    });
  }

  function updateOptions(index: number, options: SpecFieldOption[]) {
    update(index, { options });
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(fields)} />
      <div className="flex flex-col gap-4">
        {fields.map((field, index) => (
          <div
            key={index}
            className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-ink-soft)]">항목 {index + 1}</span>
              <div className="flex gap-2 text-xs">
                <button type="button" onClick={() => moveField(index, -1)} className="text-[var(--color-ink-soft)]">
                  ↑
                </button>
                <button type="button" onClick={() => moveField(index, 1)} className="text-[var(--color-ink-soft)]">
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="text-[var(--color-safety-orange)]"
                >
                  삭제
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium">키 (영문, 고유값)</label>
                <input
                  value={field.key}
                  onChange={(e) => update(index, { key: e.target.value.trim() })}
                  placeholder="max_pressure"
                  className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">라벨 (한글)</label>
                <input
                  value={field.labelKo}
                  onChange={(e) => update(index, { labelKo: e.target.value })}
                  placeholder="정격압력"
                  className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">라벨 (영문)</label>
                <input
                  value={field.labelEn ?? ""}
                  onChange={(e) => update(index, { labelEn: e.target.value })}
                  placeholder="Pressure Rating"
                  className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-2 py-1.5 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium">타입</label>
                <select
                  value={field.dataType}
                  onChange={(e) => update(index, { dataType: e.target.value as SpecFieldDataType })}
                  className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-2 py-1.5 text-sm"
                >
                  {DATA_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {field.dataType === "unit_value" && (
                <div>
                  <label className="mb-1 block text-xs font-medium">단위</label>
                  <input
                    value={field.unit ?? ""}
                    onChange={(e) => update(index, { unit: e.target.value })}
                    placeholder="bar"
                    className="w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-2 py-1.5 text-sm"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 self-end pb-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => update(index, { required: e.target.checked })}
                />
                필수 입력
              </label>
              <label className="flex items-center gap-2 self-end pb-1.5 text-xs">
                <input
                  type="checkbox"
                  checked={field.showInCardTeaser}
                  onChange={(e) => update(index, { showInCardTeaser: e.target.checked })}
                />
                검색 카드에 표시
              </label>
            </div>

            {field.dataType === "select" && (
              <div className="mt-3 border-t border-[var(--color-border)] pt-3">
                <SelectOptionsEditor
                  options={field.options ?? []}
                  onChange={(opts) => updateOptions(index, opts)}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addField}
        className="mt-4 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-steel-light)] hover:text-[var(--color-ink)]"
      >
        + 스펙 항목 추가
      </button>
    </div>
  );
}

function SelectOptionsEditor({
  options,
  onChange,
}: {
  options: SpecFieldOption[];
  onChange: (options: SpecFieldOption[]) => void;
}) {
  function addOption() {
    onChange([...options, { value: "", labelKo: "", labelEn: "" }]);
  }
  function updateOption(i: number, patch: Partial<SpecFieldOption>) {
    onChange(options.map((o, idx) => (idx === i ? { ...o, ...patch } : o)));
  }
  function removeOption(i: number) {
    onChange(options.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      <label className="mb-2 block text-xs font-medium">선택 목록 항목</label>
      <div className="flex flex-col gap-2">
        {options.map((opt, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={opt.value}
              onChange={(e) => updateOption(i, { value: e.target.value })}
              placeholder="값 (예: centrifugal)"
              className="w-1/3 rounded-[var(--radius-card)] border border-[var(--color-border)] px-2 py-1 text-xs"
            />
            <input
              value={opt.labelKo}
              onChange={(e) => updateOption(i, { labelKo: e.target.value })}
              placeholder="표시명 (한글)"
              className="w-1/3 rounded-[var(--radius-card)] border border-[var(--color-border)] px-2 py-1 text-xs"
            />
            <input
              value={opt.labelEn ?? ""}
              onChange={(e) => updateOption(i, { labelEn: e.target.value })}
              placeholder="표시명 (영문)"
              className="w-1/3 rounded-[var(--radius-card)] border border-[var(--color-border)] px-2 py-1 text-xs"
            />
            <button type="button" onClick={() => removeOption(i)} className="text-[var(--color-safety-orange)] text-xs">
              삭제
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addOption} className="mt-2 text-xs text-[var(--color-steel-light)]">
        + 선택 항목 추가
      </button>
    </div>
  );
}
