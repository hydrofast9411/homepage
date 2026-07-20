import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { affiliateSections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AffiliateSectionForm } from "@/components/admin/affiliate-section-form";
import { updateAffiliateSection } from "../../actions";

export default async function EditAffiliateSectionPage({
  params,
}: {
  params: Promise<{ id: string; sectionId: string }>;
}) {
  const { id, sectionId } = await params;
  const [row] = await db.select().from(affiliateSections).where(eq(affiliateSections.id, sectionId));
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">섹션 수정</h1>
      <AffiliateSectionForm action={updateAffiliateSection.bind(null, id, sectionId)} initial={row} />
    </div>
  );
}
