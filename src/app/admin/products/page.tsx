import { db } from "@/db/client";
import { products, manufacturers, productCategories } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { DataTable } from "@/components/admin/data-table";
import { publicImageUrl } from "@/lib/image-url";
import { deleteProduct } from "./actions";

export default async function ProductsPage() {
  const rows = await db
    .select({
      id: products.id,
      nameKo: products.nameKo,
      modelNo: products.modelNo,
      primaryImagePath: products.primaryImagePath,
      isPublished: products.isPublished,
      sortOrder: products.sortOrder,
      manufacturerName: manufacturers.name,
      categoryName: productCategories.nameKo,
    })
    .from(products)
    .leftJoin(manufacturers, eq(products.manufacturerId, manufacturers.id))
    .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
    .orderBy(asc(products.sortOrder));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">제품 ({rows.length})</h1>
      <DataTable
        rows={rows}
        basePath="/admin/products"
        onDelete={deleteProduct}
        columns={[
          {
            header: "이미지",
            cell: (row) =>
              row.primaryImagePath ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={publicImageUrl("product-images", row.primaryImagePath) ?? undefined}
                  alt={row.nameKo}
                  className="h-10 w-10 rounded object-cover"
                />
              ) : (
                "-"
              ),
          },
          { header: "제품명", cell: (row) => row.nameKo },
          { header: "제조사", cell: (row) => row.manufacturerName ?? "-" },
          { header: "분류", cell: (row) => row.categoryName ?? "-" },
          { header: "모델명", cell: (row) => row.modelNo ?? "-" },
          { header: "게시여부", cell: (row) => (row.isPublished ? "게시중" : "숨김") },
        ]}
      />
    </div>
  );
}
