import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { productCategories, businessAreas } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { CategoryForm } from "@/components/admin/category-form";
import { updateCategory } from "../../actions";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [[row], areas] = await Promise.all([
    db.select().from(productCategories).where(eq(productCategories.id, id)),
    db.select().from(businessAreas).orderBy(asc(businessAreas.sortOrder)),
  ]);
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">제품 분류 수정</h1>
      <CategoryForm action={updateCategory.bind(null, id)} initial={row} businessAreas={areas} />
    </div>
  );
}
