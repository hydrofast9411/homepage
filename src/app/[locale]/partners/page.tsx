import { getTranslations } from "next-intl/server";
import { db } from "@/db/client";
import { manufacturers } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { SectionHeading } from "@/components/marketing/section-heading";
import { PartnerCard } from "@/components/marketing/partner-card";
import { RevealGrid, RevealGridItem } from "@/components/marketing/reveal-grid";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const t = await getTranslations("partners");
  const rows = await db.select().from(manufacturers).where(eq(manufacturers.isActive, true)).orderBy(asc(manufacturers.sortOrder));

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16">
      <SectionHeading title={t("sectionTitle")} sub={t("sectionSub")} />
      <RevealGrid className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {rows.map((m) => (
          <RevealGridItem key={m.id}>
            <PartnerCard manufacturer={m} />
          </RevealGridItem>
        ))}
      </RevealGrid>
    </div>
  );
}
