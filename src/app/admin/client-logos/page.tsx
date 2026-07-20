import { db } from "@/db/client";
import { clientLogos } from "@/db/schema";
import { asc } from "drizzle-orm";
import { DataTable } from "@/components/admin/data-table";
import { publicImageUrl } from "@/lib/images";
import { deleteClientLogo } from "./actions";

export default async function ClientLogosPage() {
  const rows = await db.select().from(clientLogos).orderBy(asc(clientLogos.sortOrder));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">고객사 로고 ({rows.length})</h1>
      <DataTable
        rows={rows}
        basePath="/admin/client-logos"
        onDelete={deleteClientLogo}
        columns={[
          {
            header: "로고",
            cell: (row) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={publicImageUrl("client-logos", row.logoPath) ?? undefined}
                alt={row.name}
                className="h-10 w-auto object-contain"
              />
            ),
          },
          { header: "이름", cell: (row) => row.name },
          { header: "정렬순서", cell: (row) => row.sortOrder },
          { header: "게시여부", cell: (row) => (row.isPublished ? "게시중" : "숨김") },
        ]}
      />
    </div>
  );
}
