import { db } from "@/db/client";
import { siteSettings } from "@/db/schema";
import { upsertSetting, deleteSetting } from "./actions";

const SUGGESTED_KEYS = [
  "hero_kicker",
  "hero_title",
  "hero_desc",
  "stat_years",
  "stat_pressure",
  "stat_partners",
  "contact_email",
  "contact_phone",
  "contact_fax",
  "contact_address",
];

export default async function SettingsPage() {
  const rows = await db.select().from(siteSettings);
  const byKey = new Map(rows.map((r) => [r.settingKey, r]));
  const missingSuggested = SUGGESTED_KEYS.filter((k) => !byKey.has(k));

  return (
    <div>
      <h1 className="mb-2 text-xl font-bold">사이트 설정</h1>
      <p className="mb-6 text-sm text-[var(--color-ink-soft)]">
        홈페이지의 문구, 통계 수치, 연락처 등 자유 형식 텍스트를 키-값으로 관리합니다.
      </p>

      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <SettingRow key={row.settingKey} settingKey={row.settingKey} valueKo={row.valueKo} valueEn={row.valueEn} />
        ))}
        {missingSuggested.map((key) => (
          <SettingRow key={key} settingKey={key} valueKo={null} valueEn={null} />
        ))}
      </div>

      <details className="mt-6">
        <summary className="cursor-pointer text-sm text-[var(--color-steel-light)]">
          새 설정 키 추가
        </summary>
        <form action={upsertSetting} className="mt-3 flex max-w-xl flex-col gap-2 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <input
            name="settingKey"
            placeholder="설정 키 (예: hero_title)"
            required
            className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm"
          />
          <input name="valueKo" placeholder="값 (한글)" className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm" />
          <input name="valueEn" placeholder="값 (영문)" className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-3 py-2 text-sm" />
          <button type="submit" className="mt-1 rounded-[var(--radius-card)] bg-[var(--color-steel-light)] py-2 text-sm font-semibold text-white">
            추가
          </button>
        </form>
      </details>
    </div>
  );
}

function SettingRow({
  settingKey,
  valueKo,
  valueEn,
}: {
  settingKey: string;
  valueKo: string | null;
  valueEn: string | null;
}) {
  return (
    <form
      action={upsertSetting}
      className="grid grid-cols-[10rem_1fr_1fr_auto] items-center gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
    >
      <input type="hidden" name="settingKey" value={settingKey} />
      <div className="font-mono text-xs text-[var(--color-ink-soft)]">{settingKey}</div>
      <input
        name="valueKo"
        defaultValue={valueKo ?? ""}
        placeholder="한글 값"
        className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-2 py-1.5 text-sm"
      />
      <input
        name="valueEn"
        defaultValue={valueEn ?? ""}
        placeholder="영문 값"
        className="rounded-[var(--radius-card)] border border-[var(--color-border)] px-2 py-1.5 text-sm"
      />
      <div className="flex gap-2">
        <button type="submit" className="text-sm text-[var(--color-steel-light)]">
          저장
        </button>
        <button
          type="submit"
          formAction={deleteSetting.bind(null, settingKey)}
          className="text-sm text-[var(--color-safety-orange)]"
        >
          삭제
        </button>
      </div>
    </form>
  );
}
