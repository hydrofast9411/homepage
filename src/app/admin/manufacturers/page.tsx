import { db } from "@/db/client";
import { manufacturers } from "@/db/schema";
import { asc } from "drizzle-orm";
import { DataTable } from "@/components/admin/data-table";
import { publicImageUrl } from "@/lib/image-url";
import { deleteManufacturer } from "./actions";

export default async function ManufacturersPage() {
  const rows = await db.select().from(manufacturers).orderBy(asc(manufacturers.sortOrder));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">제조사 · 파트너 ({rows.length})</h1>
      <DataTable
        rows={rows}
        basePath="/admin/manufacturers"
        onDelete={deleteManufacturer}
        columns={[
          {
            header: "로고",
            cell: (row) =>
              row.logoPath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={publicImageUrl("partner-logos", row.logoPath) ?? undefined}
                  alt={row.name}
                  className="h-8 w-auto object-contain"
                />
              ) : (
                "-"
              ),
          },
          { header: "이름", cell: (row) => row.name },
          { header: "국가", cell: (row) => row.country ?? "-" },
          { header: "상태", cell: (row) => (row.isActive ? "활성" : "비활성") },
          { header: "정렬순서", cell: (row) => row.sortOrder },
        ]}
      />
    </div>
  );
}
