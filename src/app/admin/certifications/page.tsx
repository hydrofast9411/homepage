import { db } from "@/db/client";
import { certifications } from "@/db/schema";
import { asc } from "drizzle-orm";
import { DataTable } from "@/components/admin/data-table";
import { deleteCertification } from "./actions";

const CATEGORY_LABELS: Record<string, string> = {
  patent: "특허",
  certification: "인증",
  award: "수상",
};

export default async function CertificationsPage() {
  const rows = await db.select().from(certifications).orderBy(asc(certifications.sortOrder));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">인증 · 특허 ({rows.length})</h1>
      <DataTable
        rows={rows}
        basePath="/admin/certifications"
        onDelete={deleteCertification}
        columns={[
          { header: "구분", cell: (row) => CATEGORY_LABELS[row.category] ?? row.category },
          { header: "제목", cell: (row) => row.titleKo },
          { header: "발급기관", cell: (row) => row.issuingBodyKo ?? "-" },
          { header: "번호", cell: (row) => row.certNumber ?? "-" },
          { header: "정렬순서", cell: (row) => row.sortOrder },
        ]}
      />
    </div>
  );
}
