import { BusinessAreaForm } from "@/components/admin/business-area-form";
import { createBusinessArea } from "../actions";

export default function NewBusinessAreaPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">사업 분야 추가</h1>
      <BusinessAreaForm action={createBusinessArea} />
    </div>
  );
}
