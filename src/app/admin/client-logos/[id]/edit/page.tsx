import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { clientLogos } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ClientLogoForm } from "@/components/admin/client-logo-form";
import { updateClientLogo } from "../../actions";

export default async function EditClientLogoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [row] = await db.select().from(clientLogos).where(eq(clientLogos.id, id));
  if (!row) notFound();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">고객사 로고 수정</h1>
      <ClientLogoForm action={updateClientLogo.bind(null, id)} initial={row} />
    </div>
  );
}
