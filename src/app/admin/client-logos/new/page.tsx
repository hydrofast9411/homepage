import { ClientLogoForm } from "@/components/admin/client-logo-form";
import { createClientLogo } from "../actions";

export default function NewClientLogoPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">고객사 로고 추가</h1>
      <ClientLogoForm action={createClientLogo} />
    </div>
  );
}
