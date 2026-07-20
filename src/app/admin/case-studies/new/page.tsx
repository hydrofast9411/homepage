import { db } from "@/db/client";
import { businessAreas } from "@/db/schema";
import { asc } from "drizzle-orm";
import { CaseStudyForm } from "@/components/admin/case-study-form";
import { createCaseStudy } from "../actions";

export default async function NewCaseStudyPage() {
  const areas = await db.select().from(businessAreas).orderBy(asc(businessAreas.sortOrder));

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">제작 사례 추가</h1>
      <CaseStudyForm action={createCaseStudy} businessAreas={areas} />
    </div>
  );
}
