"use client";

import { useState, type ChangeEvent, type JSX } from "react";
import { publicImageUrl } from "@/lib/image-url";
import type {
  Loc,
  ContentImage,
  ContentBlock,
  ContentSection,
} from "@/content/business-areas";

/* ------------------------------------------------------------------ */
/* Shared class strings (kept identical to the sibling admin forms)    */
/* ------------------------------------------------------------------ */

const INPUT = "w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm";
const INPUT_SM = "w-full rounded-[var(--radius-card)] border border-[var(--color-border)] px-2 py-1.5 text-sm";
const LABEL = "mb-1 block text-xs font-medium";
const DEL_BTN = "text-xs text-[var(--color-safety-orange)]";
const ADD_BTN = "mt-2 text-xs text-[var(--color-steel-light)]";
const MOVE_BTN = "text-[var(--color-ink-soft)]";

/* ------------------------------------------------------------------ */
/* Narrowed block aliases                                              */
/* ------------------------------------------------------------------ */

type FeatureBlock = Extract<ContentBlock, { kind: "feature" }>;
type GalleryBlock = Extract<ContentBlock, { kind: "gallery" }>;
type SpecTableBlock = Extract<ContentBlock, { kind: "specTable" }>;
type CompareBlock = Extract<ContentBlock, { kind: "compare" }>;
type BulletsBlock = Extract<ContentBlock, { kind: "bullets" }>;
type BrandsBlock = Extract<ContentBlock, { kind: "brands" }>;
type FigureBlock = Extract<ContentBlock, { kind: "figure" }>;
type CompareRow = { label: Loc; value: Loc };

/* ------------------------------------------------------------------ */
/* Empty-value factories                                              */
/* ------------------------------------------------------------------ */

function emptyLoc(): Loc {
  return { ko: "" };
}

function emptyImage(): ContentImage {
  return { src: "" };
}

function emptyBlock(kind: ContentBlock["kind"]): ContentBlock {
  switch (kind) {
    case "feature":
      return { kind: "feature", title: emptyLoc(), imageLayout: "row" };
    case "gallery":
      return { kind: "gallery", columns: 3, images: [] };
    case "specTable":
      return { kind: "specTable", headers: [emptyLoc()], rows: [] };
    case "compare":
      return {
        kind: "compare",
        left: { title: emptyLoc(), rows: [] },
        right: { title: emptyLoc(), rows: [] },
      };
    case "bullets":
      return { kind: "bullets", items: [] };
    case "brands":
      return { kind: "brands", items: [] };
    case "figure":
      return { kind: "figure", src: "" };
  }
}

const BLOCK_KINDS: { kind: ContentBlock["kind"]; label: string }[] = [
  { kind: "feature", label: "특징" },
  { kind: "gallery", label: "갤러리" },
  { kind: "specTable", label: "사양 표" },
  { kind: "compare", label: "비교" },
  { kind: "bullets", label: "불릿 목록" },
  { kind: "brands", label: "브랜드" },
  { kind: "figure", label: "이미지(단일)" },
];

function kindLabel(kind: ContentBlock["kind"]): string {
  return BLOCK_KINDS.find((k) => k.kind === kind)?.label ?? kind;
}

/* Move an item within an array immutably; returns the same array on no-op. */
function moved<T>(arr: T[], index: number, dir: -1 | 1): T[] {
  const target = index + dir;
  if (target < 0 || target >= arr.length) return arr;
  const next = [...arr];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/* ================================================================== */
/* Reusable Loc + Image inputs                                        */
/* ================================================================== */

function LocInput({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: Loc;
  onChange: (v: Loc) => void;
}) {
  return (
    <div>
      {label && <label className={LABEL}>{label}</label>}
      <div className="flex gap-2">
        <div className="flex-1">
          <span className="mb-0.5 block text-[10px] text-[var(--color-ink-soft)]">KO</span>
          <input
            value={value.ko}
            onChange={(e) => onChange({ ...value, ko: e.target.value })}
            className={INPUT_SM}
          />
        </div>
        <div className="flex-1">
          <span className="mb-0.5 block text-[10px] text-[var(--color-ink-soft)]">EN</span>
          <input
            value={value.en ?? ""}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            className={INPUT_SM}
          />
        </div>
      </div>
    </div>
  );
}

function LocTextarea({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: Loc;
  onChange: (v: Loc) => void;
}) {
  return (
    <div>
      {label && <label className={LABEL}>{label}</label>}
      <div className="flex gap-2">
        <div className="flex-1">
          <span className="mb-0.5 block text-[10px] text-[var(--color-ink-soft)]">KO</span>
          <textarea
            value={value.ko}
            onChange={(e) => onChange({ ...value, ko: e.target.value })}
            rows={3}
            className={INPUT}
          />
        </div>
        <div className="flex-1">
          <span className="mb-0.5 block text-[10px] text-[var(--color-ink-soft)]">EN</span>
          <textarea
            value={value.en ?? ""}
            onChange={(e) => onChange({ ...value, en: e.target.value })}
            rows={3}
            className={INPUT}
          />
        </div>
      </div>
    </div>
  );
}

function ImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Absolute public paths render as-is; storage paths resolve through Supabase.
  const preview = value ? (value.startsWith("/") ? value : publicImageUrl("site-media", value)) : null;

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/admin/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("업로드에 실패했습니다.");
      const data = (await res.json()) as { path: string };
      onChange(data.path);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div className="flex gap-3">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="" className="h-16 w-16 shrink-0 rounded object-cover" />
      ) : (
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded border border-dashed border-[var(--color-border)] text-[10px] text-[var(--color-ink-soft)]">
          미리보기
        </div>
      )}
      <div className="flex-1">
        <input type="file" accept="image/*" onChange={handleFile} className="w-full text-xs" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/content/... 또는 스토리지 경로"
          className={`${INPUT_SM} mt-1`}
        />
        {uploading && <p className="mt-1 text-xs text-[var(--color-ink-soft)]">업로드 중...</p>}
        {error && <p className="mt-1 text-xs text-[var(--color-safety-orange)]">{error}</p>}
      </div>
    </div>
  );
}

/* A vertical list of Loc values with add / remove. */
function LocListEditor({
  label,
  addLabel,
  items,
  onChange,
}: {
  label: string;
  addLabel: string;
  items: Loc[];
  onChange: (v: Loc[]) => void;
}) {
  return (
    <div>
      <label className={LABEL}>{label}</label>
      <div className="flex flex-col gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1">
              <LocInput value={item} onChange={(v) => onChange(items.map((it, idx) => (idx === i ? v : it)))} />
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className={`${DEL_BTN} pb-1.5`}
            >
              삭제
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...items, emptyLoc()])} className={ADD_BTN}>
        {addLabel}
      </button>
    </div>
  );
}

/* A list of captioned images with add / remove / reorder. */
function ImageListEditor({
  images,
  onChange,
}: {
  images: ContentImage[];
  onChange: (v: ContentImage[]) => void;
}) {
  function update(i: number, patch: Partial<ContentImage>) {
    onChange(images.map((img, idx) => (idx === i ? { ...img, ...patch } : img)));
  }
  return (
    <div>
      <label className={LABEL}>이미지 목록</label>
      <div className="flex flex-col gap-3">
        {images.map((img, i) => (
          <div key={i} className="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[var(--color-ink-soft)]">이미지 {i + 1}</span>
              <div className="flex gap-2 text-xs">
                <button type="button" onClick={() => onChange(moved(images, i, -1))} className={MOVE_BTN}>
                  ↑
                </button>
                <button type="button" onClick={() => onChange(moved(images, i, 1))} className={MOVE_BTN}>
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                  className={DEL_BTN}
                >
                  삭제
                </button>
              </div>
            </div>
            <ImageField value={img.src} onChange={(src) => update(i, { src })} />
            <div className="mt-2">
              <LocInput label="캡션 (선택)" value={img.caption ?? emptyLoc()} onChange={(caption) => update(i, { caption })} />
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={() => onChange([...images, emptyImage()])} className={ADD_BTN}>
        + 이미지 추가
      </button>
    </div>
  );
}

/* ================================================================== */
/* Per-kind block editors                                            */
/* ================================================================== */

function FeatureEditor({ block, onChange }: { block: FeatureBlock; onChange: (b: FeatureBlock) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <LocInput label="배지 (선택)" value={block.badge ?? emptyLoc()} onChange={(badge) => onChange({ ...block, badge })} />
      <LocInput label="제목" value={block.title} onChange={(title) => onChange({ ...block, title })} />
      <LocTextarea label="본문 (선택)" value={block.body ?? emptyLoc()} onChange={(body) => onChange({ ...block, body })} />
      <LocListEditor
        label="필 (강조 태그, 선택)"
        addLabel="+ 필 추가"
        items={block.pills ?? []}
        onChange={(pills) => onChange({ ...block, pills })}
      />
      <ImageListEditor images={block.images ?? []} onChange={(images) => onChange({ ...block, images })} />
      <div className="flex items-end gap-4">
        <div>
          <label className={LABEL}>이미지 배치</label>
          <select
            value={block.imageLayout ?? "row"}
            onChange={(e) => onChange({ ...block, imageLayout: e.target.value as FeatureBlock["imageLayout"] })}
            className={INPUT_SM}
          >
            <option value="row">가로 (row)</option>
            <option value="grid">그리드 (grid)</option>
            <option value="single">단일 (single)</option>
          </select>
        </div>
        <label className="flex items-center gap-2 pb-1.5 text-xs">
          <input
            type="checkbox"
            checked={block.reverse ?? false}
            onChange={(e) => onChange({ ...block, reverse: e.target.checked })}
          />
          좌우 반전 (reverse)
        </label>
      </div>
    </div>
  );
}

function GalleryEditor({ block, onChange }: { block: GalleryBlock; onChange: (b: GalleryBlock) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <LocInput label="제목 (선택)" value={block.title ?? emptyLoc()} onChange={(title) => onChange({ ...block, title })} />
      <LocInput label="부제 (선택)" value={block.subtitle ?? emptyLoc()} onChange={(subtitle) => onChange({ ...block, subtitle })} />
      <div>
        <label className={LABEL}>열 수</label>
        <select
          value={String(block.columns ?? 3)}
          onChange={(e) => onChange({ ...block, columns: Number(e.target.value) as GalleryBlock["columns"] })}
          className={INPUT_SM}
        >
          <option value="2">2열</option>
          <option value="3">3열</option>
          <option value="4">4열</option>
        </select>
      </div>
      <ImageListEditor images={block.images} onChange={(images) => onChange({ ...block, images })} />
    </div>
  );
}

function SpecTableEditor({ block, onChange }: { block: SpecTableBlock; onChange: (b: SpecTableBlock) => void }) {
  const colCount = block.headers.length;

  function setHeader(c: number, value: Loc) {
    onChange({ ...block, headers: block.headers.map((h, idx) => (idx === c ? value : h)) });
  }
  function setCell(r: number, c: number, value: Loc) {
    onChange({
      ...block,
      rows: block.rows.map((row, ri) => (ri === r ? row.map((cell, ci) => (ci === c ? value : cell)) : row)),
    });
  }
  function addColumn() {
    onChange({
      ...block,
      headers: [...block.headers, emptyLoc()],
      rows: block.rows.map((row) => [...row, emptyLoc()]),
    });
  }
  function deleteColumn(c: number) {
    onChange({
      ...block,
      headers: block.headers.filter((_, idx) => idx !== c),
      rows: block.rows.map((row) => row.filter((_, idx) => idx !== c)),
    });
  }
  function addRow() {
    onChange({ ...block, rows: [...block.rows, block.headers.map(() => emptyLoc())] });
  }
  function deleteRow(r: number) {
    onChange({ ...block, rows: block.rows.filter((_, idx) => idx !== r) });
  }

  return (
    <div className="flex flex-col gap-3">
      <LocInput label="제목 (선택)" value={block.title ?? emptyLoc()} onChange={(title) => onChange({ ...block, title })} />

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className={LABEL}>헤더 (열)</label>
          <button type="button" onClick={addColumn} className="text-xs text-[var(--color-steel-light)]">
            + 열 추가
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {block.headers.map((h, c) => (
            <div key={c} className="flex items-end gap-2">
              <div className="flex-1">
                <LocInput value={h} onChange={(v) => setHeader(c, v)} />
              </div>
              <button
                type="button"
                onClick={() => deleteColumn(c)}
                disabled={colCount <= 1}
                className={`${DEL_BTN} pb-1.5 disabled:opacity-40`}
              >
                열 삭제
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <label className={LABEL}>행 (데이터)</label>
          <button type="button" onClick={addRow} className="text-xs text-[var(--color-steel-light)]">
            + 행 추가
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {block.rows.map((row, r) => (
            <div key={r} className="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-[var(--color-ink-soft)]">행 {r + 1}</span>
                <button type="button" onClick={() => deleteRow(r)} className={DEL_BTN}>
                  행 삭제
                </button>
              </div>
              <div className="grid gap-2 md:grid-cols-2">
                {row.map((cell, c) => (
                  <LocInput
                    key={c}
                    label={block.headers[c]?.ko || `열 ${c + 1}`}
                    value={cell}
                    onChange={(v) => setCell(r, c, v)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CompareRowsEditor({
  rows,
  onChange,
}: {
  rows: CompareRow[];
  onChange: (r: CompareRow[]) => void;
}) {
  function update(i: number, patch: Partial<CompareRow>) {
    onChange(rows.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }
  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, i) => (
        <div key={i} className="rounded-[var(--radius-card)] border border-[var(--color-border)] p-2">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] text-[var(--color-ink-soft)]">항목 {i + 1}</span>
            <button type="button" onClick={() => onChange(rows.filter((_, idx) => idx !== i))} className={DEL_BTN}>
              삭제
            </button>
          </div>
          <LocInput label="라벨" value={row.label} onChange={(label) => update(i, { label })} />
          <div className="mt-1">
            <LocInput label="값" value={row.value} onChange={(value) => update(i, { value })} />
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...rows, { label: emptyLoc(), value: emptyLoc() }])} className={ADD_BTN}>
        + 행 추가
      </button>
    </div>
  );
}

function CompareEditor({ block, onChange }: { block: CompareBlock; onChange: (b: CompareBlock) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <LocInput label="제목 (선택)" value={block.title ?? emptyLoc()} onChange={(title) => onChange({ ...block, title })} />
      <LocInput label="비고 (선택)" value={block.note ?? emptyLoc()} onChange={(note) => onChange({ ...block, note })} />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
          <span className="mb-2 block text-xs font-semibold">왼쪽</span>
          <LocInput label="제목" value={block.left.title} onChange={(title) => onChange({ ...block, left: { ...block.left, title } })} />
          <div className="mt-2">
            <CompareRowsEditor rows={block.left.rows} onChange={(rows) => onChange({ ...block, left: { ...block.left, rows } })} />
          </div>
        </div>
        <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] p-3">
          <span className="mb-2 block text-xs font-semibold">오른쪽</span>
          <LocInput label="제목" value={block.right.title} onChange={(title) => onChange({ ...block, right: { ...block.right, title } })} />
          <label className="mt-2 flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={block.right.highlight ?? false}
              onChange={(e) => onChange({ ...block, right: { ...block.right, highlight: e.target.checked } })}
            />
            강조 표시 (highlight)
          </label>
          <div className="mt-2">
            <CompareRowsEditor rows={block.right.rows} onChange={(rows) => onChange({ ...block, right: { ...block.right, rows } })} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BulletsEditor({ block, onChange }: { block: BulletsBlock; onChange: (b: BulletsBlock) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <LocInput label="제목 (선택)" value={block.title ?? emptyLoc()} onChange={(title) => onChange({ ...block, title })} />
      <LocListEditor
        label="항목"
        addLabel="+ 항목 추가"
        items={block.items}
        onChange={(items) => onChange({ ...block, items })}
      />
    </div>
  );
}

function BrandsEditor({ block, onChange }: { block: BrandsBlock; onChange: (b: BrandsBlock) => void }) {
  function update(i: number, patch: Partial<{ name: string; country?: string }>) {
    onChange({ ...block, items: block.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  }
  return (
    <div className="flex flex-col gap-3">
      <LocInput label="제목 (선택)" value={block.title ?? emptyLoc()} onChange={(title) => onChange({ ...block, title })} />
      <div>
        <label className={LABEL}>브랜드 목록</label>
        <div className="flex flex-col gap-2">
          {block.items.map((it, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={it.name}
                onChange={(e) => update(i, { name: e.target.value })}
                placeholder="브랜드명"
                className={INPUT_SM}
              />
              <input
                value={it.country ?? ""}
                onChange={(e) => update(i, { country: e.target.value })}
                placeholder="국가 (예: 🇩🇪)"
                className={INPUT_SM}
              />
              <button
                type="button"
                onClick={() => onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) })}
                className={DEL_BTN}
              >
                삭제
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...block, items: [...block.items, { name: "" }] })}
          className={ADD_BTN}
        >
          + 브랜드 추가
        </button>
      </div>
    </div>
  );
}

function FigureEditor({ block, onChange }: { block: FigureBlock; onChange: (b: FigureBlock) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <LocInput label="제목 (선택)" value={block.title ?? emptyLoc()} onChange={(title) => onChange({ ...block, title })} />
      <div>
        <label className={LABEL}>이미지</label>
        <ImageField value={block.src} onChange={(src) => onChange({ ...block, src })} />
      </div>
      <LocInput label="캡션 (선택)" value={block.caption ?? emptyLoc()} onChange={(caption) => onChange({ ...block, caption })} />
    </div>
  );
}

function BlockBody({ block, onChange }: { block: ContentBlock; onChange: (b: ContentBlock) => void }) {
  switch (block.kind) {
    case "feature":
      return <FeatureEditor block={block} onChange={onChange} />;
    case "gallery":
      return <GalleryEditor block={block} onChange={onChange} />;
    case "specTable":
      return <SpecTableEditor block={block} onChange={onChange} />;
    case "compare":
      return <CompareEditor block={block} onChange={onChange} />;
    case "bullets":
      return <BulletsEditor block={block} onChange={onChange} />;
    case "brands":
      return <BrandsEditor block={block} onChange={onChange} />;
    case "figure":
      return <FigureEditor block={block} onChange={onChange} />;
  }
}

/* ================================================================== */
/* Blocks list within a section                                      */
/* ================================================================== */

function BlocksEditor({
  blocks,
  onChange,
}: {
  blocks: ContentBlock[];
  onChange: (b: ContentBlock[]) => void;
}) {
  return (
    <div>
      <div className="flex flex-col gap-3">
        {blocks.map((block, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-ink-soft)]">
                블록 {i + 1} · {kindLabel(block.kind)}
              </span>
              <div className="flex gap-2 text-xs">
                <button type="button" onClick={() => onChange(moved(blocks, i, -1))} className={MOVE_BTN}>
                  ↑
                </button>
                <button type="button" onClick={() => onChange(moved(blocks, i, 1))} className={MOVE_BTN}>
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onChange(blocks.filter((_, idx) => idx !== i))}
                  className={DEL_BTN}
                >
                  삭제
                </button>
              </div>
            </div>
            <BlockBody block={block} onChange={(nb) => onChange(blocks.map((b, idx) => (idx === i ? nb : b)))} />
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className="self-center text-xs text-[var(--color-ink-soft)]">+ 블록 추가:</span>
        {BLOCK_KINDS.map((k) => (
          <button
            key={k.kind}
            type="button"
            onClick={() => onChange([...blocks, emptyBlock(k.kind)])}
            className="rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-ink-soft)] hover:border-[var(--color-steel-light)] hover:text-[var(--color-ink)]"
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* Top-level: sections                                               */
/* ================================================================== */

export function BlockEditor({ name, initial }: { name: string; initial: ContentSection[] }): JSX.Element {
  const [sections, setSections] = useState<ContentSection[]>(initial);

  function updateSection(i: number, patch: Partial<ContentSection>) {
    setSections((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }
  function addSection() {
    setSections((prev) => [...prev, { blocks: [] }]);
  }
  function removeSection(i: number) {
    setSections((prev) => prev.filter((_, idx) => idx !== i));
  }
  function moveSection(i: number, dir: -1 | 1) {
    setSections((prev) => moved(prev, i, dir));
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(sections)} />

      <div className="flex flex-col gap-4">
        {sections.map((section, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--color-ink-soft)]">섹션 {i + 1}</span>
              <div className="flex gap-2 text-xs">
                <button type="button" onClick={() => moveSection(i, -1)} className={MOVE_BTN}>
                  ↑
                </button>
                <button type="button" onClick={() => moveSection(i, 1)} className={MOVE_BTN}>
                  ↓
                </button>
                <button type="button" onClick={() => removeSection(i)} className={DEL_BTN}>
                  섹션 삭제
                </button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <LocInput
                label="키커 (선택)"
                value={section.kicker ?? emptyLoc()}
                onChange={(kicker) => updateSection(i, { kicker })}
              />
              <LocInput
                label="제목 (선택)"
                value={section.heading ?? emptyLoc()}
                onChange={(heading) => updateSection(i, { heading })}
              />
            </div>

            <div className="mt-4 border-t border-[var(--color-border)] pt-4">
              <BlocksEditor blocks={section.blocks} onChange={(blocks) => updateSection(i, { blocks })} />
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSection}
        className="mt-4 rounded-[var(--radius-card)] border border-dashed border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-ink-soft)] hover:border-[var(--color-steel-light)] hover:text-[var(--color-ink)]"
      >
        + 섹션 추가
      </button>
    </div>
  );
}
