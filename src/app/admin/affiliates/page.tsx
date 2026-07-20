import Link from "next/link";
import { db } from "@/db/client";
import { affiliates } from "@/db/schema";
import { asc } from "drizzle-orm";
import { DataTable } from "@/components/admin/data-table";
import { deleteAffiliate } from "./actions";

export default async function AffiliatesPage() {
  const rows = await db.select().from(affiliates).orderBy(asc(affiliates.sortOrder));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">관계사 ({rows.length})</h1>
      <DataTable
        rows={rows}
        basePath="/admin/affiliates"
        onDelete={deleteAffiliate}
        columns={[
          { header: "슬러그", cell: (row) => row.slug },
          { header: "이름", cell: (row) => row.nameKo },
          {
            header: "콘텐츠 섹션",
            cell: (row) => (
              <Link href={`/admin/affiliates/${row.id}/sections`} className="text-[var(--color-steel-light)]">
                섹션 관리 →
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
