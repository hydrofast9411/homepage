import { db } from "@/db/client";
import { businessAreas } from "@/db/schema";
import { asc } from "drizzle-orm";
import { CategoryForm } from "@/components/admin/category-form";
import { createCategory } from "../actions";

export default async function NewCategoryPage() {
  const areas = await db.select().from(businessAreas).orderBy(asc(businessAreas.sortOrder));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">제품 분류 추가</h1>
      <CategoryForm action={createCategory} businessAreas={areas} />
    </div>
  );
}
