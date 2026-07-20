import { AffiliateForm } from "@/components/admin/affiliate-form";
import { createAffiliate } from "../actions";

export default function NewAffiliatePage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">관계사 추가</h1>
      <AffiliateForm action={createAffiliate} />
    </div>
  );
}
