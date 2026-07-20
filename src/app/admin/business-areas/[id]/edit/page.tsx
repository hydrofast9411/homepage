import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { businessAreas } from "@/db/schema";
import { eq } from "drizzle-orm";
import { BusinessAreaForm } from "@/components/admin/business-area-form";
import { updateBusinessArea } from "../../actions";

export default async function EditBusinessAreaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [row] = await db.select().from(businessAreas).where(eq(businessAreas.id, id));
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">사업 분야 수정</h1>
      <BusinessAreaForm action={updateBusinessArea.bind(null, id)} initial={row} />
    </div>
  );
}
