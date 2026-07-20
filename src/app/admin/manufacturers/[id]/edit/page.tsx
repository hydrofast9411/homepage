import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { manufacturers, businessAreas, manufacturerBusinessAreas } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { ManufacturerForm } from "@/components/admin/manufacturer-form";
import { updateManufacturer } from "../../actions";

export default async function EditManufacturerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [[row], areas, links] = await Promise.all([
    db.select().from(manufacturers).where(eq(manufacturers.id, id)),
    db.select().from(businessAreas).orderBy(asc(businessAreas.sortOrder)),
    db
      .select({ businessAreaId: manufacturerBusinessAreas.businessAreaId })
      .from(manufacturerBusinessAreas)
      .where(eq(manufacturerBusinessAreas.manufacturerId, id)),
  ]);
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">제조사 · 파트너 수정</h1>
      <ManufacturerForm
        action={updateManufacturer.bind(null, id)}
        initial={row}
        businessAreas={areas}
        selectedBusinessAreaIds={links.map((l) => l.businessAreaId)}
      />
    </div>
  );
}
