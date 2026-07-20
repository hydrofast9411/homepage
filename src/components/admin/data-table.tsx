import Link from "next/link";
import { DeleteButton } from "./delete-button";

export interface DataTableColumn<T> {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
}

/**
 * Generic list/create/edit/delete table used by every admin section. Each
 * entity's page.tsx fetches its own rows via Drizzle and passes them here
 * with a small column definition + the delete Server Action for that entity.
 */
export function DataTable<T extends { id: string }>({
  rows,
  columns,
  basePath,
  onDelete,
  newLabel = "새로 추가",
  emptyLabel = "등록된 항목이 없습니다.",
}: {
  rows: T[];
  columns: DataTableColumn<T>[];
  basePath: string;
  onDelete: (id: string) => Promise<void>;
  newLabel?: string;
  emptyLabel?: string;
}) {
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Link
          href={`${basePath}/new`}
          className="rounded-[var(--radius-card)] bg-[var(--color-steel-light)] px-4 py-2 text-sm font-semibold text-white"
        >
          {newLabel}
        </Link>
      </div>
      <div className="overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-ink-soft)]">
              {columns.map((col) => (
                <th key={col.header} className={`px-4 py-3 font-medium ${col.className ?? ""}`}>
                  {col.header}
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-[var(--color-ink-soft)]">
                  {emptyLabel}
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--color-border)] last:border-0">
                {columns.map((col) => (
                  <td key={col.header} className={`px-4 py-3 ${col.className ?? ""}`}>
                    {col.cell(row)}
                  </td>
                ))}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link href={`${basePath}/${row.id}/edit`} className="text-[var(--color-steel-light)] mr-3">
                    수정
                  </Link>
                  <DeleteButton id={row.id} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
