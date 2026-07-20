import { getLocale } from "next-intl/server";
import { db } from "@/db/client";
import { historyEvents, certifications } from "@/db/schema";
import { asc } from "drizzle-orm";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Timeline } from "@/components/marketing/timeline";
import { RevealGrid, RevealGridItem } from "@/components/marketing/reveal-grid";
import { AboutHero } from "@/components/marketing/about-hero";
import { Link } from "@/i18n/navigation";
import { publicImageUrl } from "@/lib/image-url";
import { getAllAreas } from "@/lib/areas";
import type { Locale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<string, { ko: string; en: string }> = {
  patent: { ko: "특허", en: "Patent" },
  certification: { ko: "인증", en: "Certification" },
  award: { ko: "수상", en: "Award" },
};

const ADDRESS_KO = "인천광역시 부평구 부평대로 283, 우림라이온스밸리 C동 610호";
const ADDRESS_EN = "C-610, Woolim Lions Valley, 283 Bupyeong-daero, Bupyeong-gu, Incheon, Korea";
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent("인천광역시 부평구 부평대로 283")}&z=16&output=embed`;

export default async function AboutPage() {
  const locale = (await getLocale()) as Locale;
  const ko = locale === "ko";

  const [history, certs, areas] = await Promise.all([
    db.select().from(historyEvents).orderBy(asc(historyEvents.sortOrder)),
    db.select().from(certifications).orderBy(asc(certifications.sortOrder)),
    getAllAreas(),
  ]);

  const profile: { label: string; value: string }[] = [
    { label: ko ? "회사명" : "Company", value: ko ? "(주)하이드로훼스트" : "Hydrofast Co., Ltd." },
    { label: ko ? "대표자" : "CEO", value: ko ? "최수성" : "Choi Su-seong" },
    { label: ko ? "설립" : "Founded", value: ko ? "1998년 5월" : "May 1998" },
    { label: ko ? "사업자등록번호" : "Business Reg.", value: "122-86-10520" },
    { label: ko ? "대표전화" : "Tel", value: "032-623-5015" },
    { label: ko ? "팩스" : "Fax", value: "032-623-5017" },
    { label: ko ? "이메일" : "Email", value: "hydrofast@hydrofast.co.kr" },
    { label: ko ? "홈페이지" : "Website", value: "www.hydrofast.co.kr" },
  ];

  const patents = certs.filter((c) => c.category === "patent");
  const certOnly = certs.filter((c) => c.category !== "patent");

  return (
    <div>
      <AboutHero
        kicker="About Us"
        title={ko ? "정밀과 파워, 유압의 모든 것" : "Precision & Power in Hydraulic"}
        tagline={ko ? "(주)하이드로훼스트 — 유압 전문 기업" : "Hydrofast Co., Ltd. — Hydraulic Specialists"}
        bgImage="/content/about/hero-bg.webp"
      />

      {/* Sticky sub-nav */}
      <div className="sticky top-[var(--nav-height)] z-30 border-b border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] gap-6 overflow-x-auto px-6 py-3 text-sm font-semibold">
          <a href="#overview" className="whitespace-nowrap text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
            {ko ? "회사 개요" : "Overview"}
          </a>
          <a href="#location" className="whitespace-nowrap text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
            {ko ? "오시는 길" : "Location"}
          </a>
          <a href="#history" className="whitespace-nowrap text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
            {ko ? "회사 연혁" : "History"}
          </a>
          <a href="#certifications" className="whitespace-nowrap text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]">
            {ko ? "특허 및 인증" : "Certifications"}
          </a>
        </div>
      </div>

      {/* Overview */}
      <section id="overview" className="scroll-mt-32">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
          <SectionHeading kicker="Overview" title={ko ? "회사 개요" : "Company Overview"} />
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div className="space-y-5 text-[var(--color-ink-soft)] leading-relaxed">
              <p>
                {ko
                  ? "(주)하이드로훼스트는 1998년 설립 이래 유압 볼팅·토크, 초고압 유체·가스, 토탈 유압 시스템, 소방·환경·산업안전, 그리고 신소재·신기술까지 — 산업 현장의 정밀과 파워를 책임지는 유압 전문 기업입니다. 90년 이상 기술력을 축적한 유럽 파트너와 함께 국제 인증 기준의 장비를 공급하고, 상담부터 설계·제작·시공·유지관리까지 하나로 연결된 토탈 솔루션을 제공합니다."
                  : "Since 1998, Hydrofast has been the hydraulic specialist behind precision and power on the industrial floor — spanning bolting & torque, ultra-high-pressure fluid & gas, total hydraulic engineering, fire/environment/safety, and advanced materials. Together with European partners carrying 90+ years of heritage, we supply internationally certified equipment and deliver one connected total solution, from consulting through design, fabrication, installation and maintenance."}
              </p>
              <p>
                {ko
                  ? "발전·석유화학·조선·중공업·플랜트 현장에서 검증된 기술력을 바탕으로 원자력 A등급 유자격과 국내 교정기관 점유율 1위, 다수의 특허·인증을 보유하고 있으며, 계열사 (주)동신소재·(주)이에프하이드로와 함께 미래 성장 동력을 키워가고 있습니다."
                  : "Proven across power, petrochemical, shipbuilding, heavy-industry and plant sites, we hold nuclear Grade-A qualification, the #1 calibration-lab share in Korea, and numerous patents and certifications — growing future engines together with affiliates DongShin Materials and EF Hydro."}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
                {[
                  { v: "1998", l: ko ? "설립" : "Founded" },
                  { v: "5", l: ko ? "핵심 사업" : "Business areas" },
                  { v: "6,900", l: ko ? "최대 압력(bar)" : "Max pressure (bar)" },
                  { v: "15+", l: ko ? "보유 특허" : "Patents" },
                ].map((s) => (
                  <div key={s.l} className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-center">
                    <div className="text-2xl font-black text-[var(--color-steel-light)]">{s.v}</div>
                    <div className="mt-1 text-xs font-medium text-[var(--color-ink-soft)]">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company profile card */}
            <div className="rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[var(--color-ink-soft)]">
                {ko ? "회사 정보" : "Company Profile"}
              </h3>
              <dl className="divide-y divide-[var(--color-border)]">
                {profile.map((row) => (
                  <div key={row.label} className="flex justify-between gap-4 py-2.5 text-sm">
                    <dt className="shrink-0 font-semibold text-[var(--color-ink-soft)]">{row.label}</dt>
                    <dd className="text-right font-medium">{row.value}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-4 py-2.5 text-sm">
                  <dt className="shrink-0 font-semibold text-[var(--color-ink-soft)]">{ko ? "주소" : "Address"}</dt>
                  <dd className="text-right font-medium">{ko ? ADDRESS_KO : ADDRESS_EN}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Business areas at a glance */}
          <div className="mt-14">
            <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-[var(--color-ink-soft)]">
              {ko ? "5대 핵심 사업" : "Five Core Businesses"}
            </h3>
            <RevealGrid className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {areas.map((a) => (
                <RevealGridItem key={a.slug}>
                  <Link
                    href={`/business/${a.slug}`}
                    className="flex h-full flex-col rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition-all hover:-translate-y-1 hover:shadow-lg"
                    style={{ borderTop: `3px solid ${a.accent}` }}
                  >
                    <span className="text-xs font-black opacity-40">{a.index}</span>
                    <span className="mt-1 text-sm font-bold leading-snug">{ko ? a.name.ko : a.name.en ?? a.name.ko}</span>
                  </Link>
                </RevealGridItem>
              ))}
            </RevealGrid>
          </div>
        </div>
      </section>

      {/* Location */}
      <section id="location" className="scroll-mt-32 bg-[var(--color-surface-alt)]">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
          <SectionHeading kicker="Location" title={ko ? "오시는 길" : "How to Find Us"} />
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)]">
              <iframe
                title={ko ? "하이드로훼스트 위치" : "Hydrofast location"}
                src={MAP_SRC}
                className="h-[420px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="flex flex-col gap-4">
              <InfoRow icon="📍" label={ko ? "주소" : "Address"} value={ko ? ADDRESS_KO : ADDRESS_EN} />
              <InfoRow icon="📞" label={ko ? "대표전화" : "Tel"} value="032-623-5015" />
              <InfoRow icon="📠" label={ko ? "팩스" : "Fax"} value="032-623-5017" />
              <InfoRow icon="✉️" label={ko ? "이메일" : "Email"} value="hydrofast@hydrofast.co.kr" />
              <InfoRow
                icon="🕘"
                label={ko ? "영업시간" : "Hours"}
                value={ko ? "평일 09:00 – 18:00 (토·일·공휴일 휴무)" : "Weekdays 09:00–18:00 (closed weekends/holidays)"}
              />
              <Link
                href="/contact"
                className="mt-2 rounded-[var(--radius-card)] bg-[var(--color-safety-orange)] px-5 py-3 text-center text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                {ko ? "견적 문의하기" : "Request a Quote"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      {history.length > 0 && (
        <section id="history" className="scroll-mt-32">
          <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
            <SectionHeading kicker="History" title={ko ? "회사 연혁" : "Company History"} align="center" />
            <Timeline events={history} locale={locale} />
          </div>
        </section>
      )}

      {/* Certifications & Patents */}
      {certs.length > 0 && (
        <section id="certifications" className="scroll-mt-32 bg-[var(--color-surface-alt)]">
          <div className="mx-auto max-w-[1400px] px-6 py-16 md:py-20">
            <SectionHeading kicker="Certifications" title={ko ? "특허 및 인증 현황" : "Patents & Certifications"} align="center" />

            {certOnly.length > 0 && (
              <div className="mb-10 flex flex-wrap justify-center gap-3">
                {certOnly.map((c) => (
                  <span
                    key={c.id}
                    className="rounded-[var(--radius-pill)] border border-[var(--color-steel-light)] bg-[var(--color-surface)] px-5 py-2 text-sm font-semibold text-[var(--color-steel-light)]"
                  >
                    {ko ? c.titleKo : c.titleEn ?? c.titleKo}
                  </span>
                ))}
              </div>
            )}

            {patents.length > 0 && (
              <RevealGrid className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {patents.map((c) => {
                  const title = ko ? c.titleKo : c.titleEn ?? c.titleKo;
                  const label = CATEGORY_LABEL[c.category]?.[ko ? "ko" : "en"] ?? c.category;
                  return (
                    <RevealGridItem key={c.id}>
                      <div className="flex h-full items-start gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                        {c.imagePath ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={publicImageUrl("site-media", c.imagePath) ?? undefined} alt={title} className="h-14 w-auto shrink-0 object-contain" />
                        ) : (
                          <span className="mt-0.5 shrink-0 rounded-[var(--radius-card)] bg-[var(--color-safety-orange)] px-2 py-1 text-[10px] font-bold uppercase text-white">
                            {label}
                          </span>
                        )}
                        <span className="text-sm font-medium leading-snug">{title}</span>
                      </div>
                    </RevealGridItem>
                  );
                })}
              </RevealGrid>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <span aria-hidden className="text-xl">{icon}</span>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-soft)]">{label}</div>
        <div className="mt-0.5 text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}
