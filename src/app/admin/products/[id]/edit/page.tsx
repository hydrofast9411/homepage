import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { products, productCategories, manufacturers, productImages } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { ProductForm } from "@/components/admin/product-form";
import { updateProduct } from "../../actions";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [[row], categories, manufacturersList, gallery] = await Promise.all([
    db.select().from(products).where(eq(products.id, id)),
    db.select().from(productCategories).orderBy(asc(productCategories.sortOrder)),
    db.select().from(manufacturers).orderBy(asc(manufacturers.sortOrder)),
    db.select().from(productImages).where(eq(productImages.productId, id)).orderBy(asc(productImages.sortOrder)),
  ]);
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">제품 수정</h1>
      <ProductForm
        action={updateProduct.bind(null, id)}
        initial={row}
        categories={categories}
        manufacturersList={manufacturersList}
        galleryImages={gallery}
      />
    </div>
  );
}
