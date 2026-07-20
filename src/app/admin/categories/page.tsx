import { db } from "@/db/client";
import { productCategories, businessAreas } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { DataTable } from "@/components/admin/data-table";
import { deleteCategory } from "./actions";

export default async function CategoriesPage() {
  const rows = await db
    .select({
      id: productCategories.id,
      slug: productCategories.slug,
      nameKo: productCategories.nameKo,
      sortOrder: productCategories.sortOrder,
      specSchema: productCategories.specSchema,
      businessAreaName: businessAreas.nameKo,
    })
    .from(productCategories)
    .leftJoin(businessAreas, eq(productCategories.businessAreaId, businessAreas.id))
    .orderBy(asc(productCategories.sortOrder));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">제품 분류 · 스펙 양식 ({rows.length})</h1>
      <DataTable
        rows={rows}
        basePath="/admin/categories"
        onDelete={deleteCategory}
        columns={[
          { header: "사업 분야", cell: (row) => row.businessAreaName ?? "-" },
          { header: "분류명", cell: (row) => row.nameKo },
          { header: "슬러그", cell: (row) => row.slug },
          { header: "스펙 항목 수", cell: (row) => row.specSchema.length },
          { header: "정렬순서", cell: (row) => row.sortOrder },
        ]}
      />
    </div>
  );
}
