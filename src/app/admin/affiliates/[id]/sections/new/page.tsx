import { AffiliateSectionForm } from "@/components/admin/affiliate-section-form";
import { createAffiliateSection } from "../actions";

export default async function NewAffiliateSectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">섹션 추가</h1>
      <AffiliateSectionForm action={createAffiliateSection.bind(null, id)} />
    </div>
  );
}
