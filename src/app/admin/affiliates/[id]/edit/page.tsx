import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { affiliates } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AffiliateForm } from "@/components/admin/affiliate-form";
import { updateAffiliate } from "../../actions";

export default async function EditAffiliatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [row] = await db.select().from(affiliates).where(eq(affiliates.id, id));
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">관계사 수정</h1>
      <AffiliateForm action={updateAffiliate.bind(null, id)} initial={row} />
    </div>
  );
}
