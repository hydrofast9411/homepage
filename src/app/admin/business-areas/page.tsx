import { db } from "@/db/client";
import { businessAreas } from "@/db/schema";
import { asc } from "drizzle-orm";
import { DataTable } from "@/components/admin/data-table";
import { deleteBusinessArea } from "./actions";

export default async function BusinessAreasPage() {
  const rows = await db.select().from(businessAreas).orderBy(asc(businessAreas.sortOrder));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">사업 분야 ({rows.length})</h1>
      <DataTable
        rows={rows}
        basePath="/admin/business-areas"
        onDelete={deleteBusinessArea}
        columns={[
          { header: "슬러그", cell: (row) => row.slug },
          { header: "이름 (한글)", cell: (row) => row.nameKo },
          { header: "이름 (영문)", cell: (row) => row.nameEn ?? "-" },
          { header: "정렬순서", cell: (row) => row.sortOrder },
        ]}
      />
    </div>
  );
}
