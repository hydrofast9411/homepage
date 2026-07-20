import { db } from "@/db/client";
import { inquiries } from "@/db/schema";
import { desc } from "drizzle-orm";
import { DeleteButton } from "@/components/admin/delete-button";
import { markInquiryRead, deleteInquiry } from "./actions";

export default async function InquiriesPage() {
  const rows = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">문의 내역 ({rows.length})</h1>
      <div className="flex flex-col gap-3">
        {rows.length === 0 && <p className="text-sm text-[var(--color-ink-soft)]">문의 내역이 없습니다.</p>}
        {rows.map((row) => (
          <div
            key={row.id}
            className={`rounded-[var(--radius-card)] border p-4 ${
              row.isRead
                ? "border-[var(--color-border)] bg-[var(--color-surface)]"
                : "border-[var(--color-safety-orange)] bg-[var(--color-surface)]"
            }`}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-semibold">
                {row.name} {row.company && <span className="text-[var(--color-ink-soft)]">· {row.company}</span>}
              </div>
              <div className="text-xs text-[var(--color-ink-soft)]">
                {new Date(row.createdAt).toLocaleString("ko-KR")}
              </div>
            </div>
            <div className="mb-2 text-xs text-[var(--color-ink-soft)]">
              {row.email}
              {row.phone && ` · ${row.phone}`}
              {row.businessAreaInterest && ` · 관심분야: ${row.businessAreaInterest}`}
            </div>
            <p className="mb-3 whitespace-pre-wrap text-sm">{row.message}</p>
            <div className="flex gap-3 text-sm">
              <form action={markInquiryRead.bind(null, row.id, !row.isRead)}>
                <button type="submit" className="text-[var(--color-steel-light)]">
                  {row.isRead ? "미확인으로 표시" : "확인 완료로 표시"}
                </button>
              </form>
              <DeleteButton id={row.id} onDelete={deleteInquiry} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
