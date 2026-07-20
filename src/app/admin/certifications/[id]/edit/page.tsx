import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { certifications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CertificationForm } from "@/components/admin/certification-form";
import { updateCertification } from "../../actions";

export default async function EditCertificationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [row] = await db.select().from(certifications).where(eq(certifications.id, id));
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">인증 · 특허 수정</h1>
      <CertificationForm action={updateCertification.bind(null, id)} initial={row} />
    </div>
  );
}
