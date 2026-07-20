import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { affiliates, affiliateSections } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { DataTable } from "@/components/admin/data-table";
import { deleteAffiliateSection } from "./actions";

export default async function AffiliateSectionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [affiliate] = await db.select().from(affiliates).where(eq(affiliates.id, id));
  if (!affiliate) notFound();

  const rows = await db
    .select()
    .from(affiliateSections)
    .where(eq(affiliateSections.affiliateId, id))
    .orderBy(asc(affiliateSections.sortOrder));

  return (
    <div>
      <h1 className="mb-1 text-xl font-bold">{affiliate.nameKo} — 콘텐츠 섹션</h1>
      <p className="mb-6 text-sm text-[var(--color-ink-soft)]">
        관계사 상세페이지를 구성하는 반복형 콘텐츠 블록입니다. ({rows.length}개)
      </p>
      <DataTable
        rows={rows}
        basePath={`/admin/affiliates/${id}/sections`}
        onDelete={deleteAffiliateSection.bind(null, id)}
        columns={[
          { header: "섹션 키", cell: (row) => row.sectionKey },
          { header: "제목", cell: (row) => row.headingKo ?? "-" },
          { header: "레이아웃", cell: (row) => row.layoutVariant ?? "-" },
          { header: "정렬순서", cell: (row) => row.sortOrder },
        ]}
      />
    </div>
  );
}
