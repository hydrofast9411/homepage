import { db } from "@/db/client";
import { caseStudies } from "@/db/schema";
import { asc } from "drizzle-orm";
import { DataTable } from "@/components/admin/data-table";
import { deleteCaseStudy } from "./actions";

export default async function CaseStudiesPage() {
  const rows = await db.select().from(caseStudies).orderBy(asc(caseStudies.sortOrder));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">제작 사례 ({rows.length})</h1>
      <DataTable
        rows={rows}
        basePath="/admin/case-studies"
        onDelete={deleteCaseStudy}
        columns={[
          { header: "고객사", cell: (row) => row.clientName },
          { header: "제목", cell: (row) => row.titleKo },
          { header: "비율", cell: (row) => row.aspectRatio },
          { header: "정렬순서", cell: (row) => row.sortOrder },
          { header: "게시여부", cell: (row) => (row.isPublished ? "게시중" : "숨김") },
        ]}
      />
    </div>
  );
}
