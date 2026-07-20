import { getTranslations } from "next-intl/server";
import { db } from "@/db/client";
import { businessAreas } from "@/db/schema";
import { asc } from "drizzle-orm";
import { ContactForm } from "@/components/marketing/contact-form";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const t = await getTranslations("contactPage");
  const tFooter = await getTranslations("footer");
  const areas = await db.select().from(businessAreas).orderBy(asc(businessAreas.sortOrder));

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight" dangerouslySetInnerHTML={{ __html: t("title") }} />
      <p className="mt-3 text-[var(--color-ink-soft)]">{t("sub")}</p>

      <div className="mt-10">
        <ContactForm businessAreas={areas} />
      </div>

      <div className="mt-10 border-t border-[var(--color-border)] pt-6 text-sm text-[var(--color-ink-soft)]">
        <p>{tFooter("phone")}</p>
        <p>{tFooter("email")}</p>
        <p>{tFooter("address")}</p>
        <p className="mt-2">{tFooter("businessHours")}</p>
      </div>
    </div>
  );
}
