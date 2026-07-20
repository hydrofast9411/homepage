import { db } from "@/db/client";
import { historyEvents } from "@/db/schema";
import { asc } from "drizzle-orm";
import { DataTable } from "@/components/admin/data-table";
import { deleteHistoryEvent } from "./actions";

export default async function HistoryPage() {
  const rows = await db.select().from(historyEvents).orderBy(asc(historyEvents.sortOrder));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">회사 연혁 ({rows.length})</h1>
      <DataTable
        rows={rows}
        basePath="/admin/history"
        onDelete={deleteHistoryEvent}
        columns={[
          { header: "연월", cell: (row) => `${row.year}${row.month ? `.${String(row.month).padStart(2, "0")}` : ""}` },
          { header: "제목", cell: (row) => row.titleKo },
          { header: "강조", cell: (row) => (row.isHighlight ? "★" : "") },
          { header: "정렬순서", cell: (row) => row.sortOrder },
        ]}
      />
    </div>
  );
}
