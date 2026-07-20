import { CertificationForm } from "@/components/admin/certification-form";
import { createCertification } from "../actions";

export default function NewCertificationPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-bold">인증 · 특허 추가</h1>
      <CertificationForm action={createCertification} />
    </div>
  );
}
