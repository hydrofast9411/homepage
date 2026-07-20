import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { caseStudies, businessAreas } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { CaseStudyForm } from "@/components/admin/case-study-form";
import { updateCaseStudy } from "../../actions";

export default async function EditCaseStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [[row], areas] = await Promise.all([
    db.select().from(caseStudies).where(eq(caseStudies.id, id)),
    db.select().from(businessAreas).orderBy(asc(businessAreas.sortOrder)),
  ]);
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">제작 사례 수정</h1>
      <CaseStudyForm action={updateCaseStudy.bind(null, id)} initial={row} businessAreas={areas} />
    </div>
  );
}
