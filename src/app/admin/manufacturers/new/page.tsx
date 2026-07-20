import { db } from "@/db/client";
import { businessAreas } from "@/db/schema";
import { asc } from "drizzle-orm";
import { ManufacturerForm } from "@/components/admin/manufacturer-form";
import { createManufacturer } from "../actions";

export default async function NewManufacturerPage() {
  const areas = await db.select().from(businessAreas).orderBy(asc(businessAreas.sortOrder));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">제조사 · 파트너 추가</h1>
      <ManufacturerForm action={createManufacturer} businessAreas={areas} />
    </div>
  );
}
