/**
 * Seeds the 4 business areas, 2 affiliates, the 16 named overseas manufacturer
 * partners (+ HydroFast itself), a first pass at product categories with
 * hand-authored spec schemas, and the company history/certifications from the
 * brochure — so the site isn't empty on first deploy. Run once after applying
 * docs/sql/001_initial_schema.md in the Supabase SQL Editor:
 *
 *   npm run db:seed
 *
 * Safe to re-run: every insert is gated by an existence check on slug/key.
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { db } from "../src/db/client";
import {
  businessAreas,
  affiliates,
  manufacturers,
  manufacturerBusinessAreas,
  productCategories,
  historyEvents,
  certifications,
} from "../src/db/schema";
import type { SpecFieldDef } from "../src/db/schema/product-categories";
import { eq } from "drizzle-orm";

async function upsertBusinessArea(input: typeof businessAreas.$inferInsert) {
  const [existing] = await db.select().from(businessAreas).where(eq(businessAreas.slug, input.slug));
  if (existing) return existing;
  const [created] = await db.insert(businessAreas).values(input).returning();
  return created;
}

async function upsertAffiliate(input: typeof affiliates.$inferInsert) {
  const [existing] = await db.select().from(affiliates).where(eq(affiliates.slug, input.slug));
  if (existing) return existing;
  const [created] = await db.insert(affiliates).values(input).returning();
  return created;
}

async function upsertManufacturer(input: typeof manufacturers.$inferInsert) {
  const [existing] = await db.select().from(manufacturers).where(eq(manufacturers.slug, input.slug));
  if (existing) return existing;
  const [created] = await db.insert(manufacturers).values(input).returning();
  return created;
}

async function upsertCategory(input: typeof productCategories.$inferInsert) {
  const [existing] = await db.select().from(productCategories).where(eq(productCategories.slug, input.slug));
  if (existing) return existing;
  const [created] = await db.insert(productCategories).values(input).returning();
  return created;
}

function specField(partial: Partial<SpecFieldDef> & Pick<SpecFieldDef, "key" | "labelKo">): SpecFieldDef {
  return {
    labelEn: partial.labelKo,
    dataType: "text",
    required: false,
    sortOrder: 0,
    showInCardTeaser: false,
    ...partial,
  };
}

async function main() {
  console.log("Seeding business areas...");
  const boltingTorque = await upsertBusinessArea({
    slug: "bolting-torque",
    nameKo: "정밀 볼팅 & 토크 솔루션",
    nameEn: "Precision Bolting & Torque",
    summaryKo: "원자력 A등급부터 스마트팩토리까지 — 유압 텐셔닝 시스템, 스마트 토크 툴, 토크 교정 시스템",
    summaryEn: "From nuclear-grade to smart factories — hydraulic tensioning, smart torque tools, calibration systems",
    sortOrder: 1,
  });
  const fluidGas = await upsertBusinessArea({
    slug: "fluid-gas",
    nameKo: "초고압 유체·가스 시스템",
    nameEn: "High-Pressure Fluid & Gas",
    summaryKo: "최대 6,900bar, 수소 시대의 고압 코어 — 가스·수압 부스터, 초고압 밸브·피팅, 물 기반 친수 시스템",
    summaryEn: "Up to 6,900 bar — gas/hydraulic boosters, ultra-high-pressure valves & fittings, water-based systems",
    sortOrder: 2,
  });
  const hydraulicEngineering = await upsertBusinessArea({
    slug: "hydraulic-engineering",
    nameKo: "토탈 유압 시스템",
    nameEn: "Total Hydraulic Engineering",
    summaryKo: "유압 툴부터 맞춤 설계까지 End-to-End — 유압 툴(영·스웨·이), 시스템 설계·제작, ETO 맞춤 제작",
    summaryEn: "End-to-end from hydraulic tools to custom design — UK/Sweden/Italy tools, system design, ETO fabrication",
    sortOrder: 3,
  });
  const fireSafety = await upsertBusinessArea({
    slug: "fire-safety",
    nameKo: "소방·환경·산업안전 솔루션",
    nameEn: "Fire, Environment & Safety",
    summaryKo: "재난 대응부터 스마트 팜까지 — 소방차 코어 부품, 미세안개 분무 시스템, 산업안전 장비",
    summaryEn: "From disaster response to smart farms — fire truck core parts, misting systems, industrial safety gear",
    sortOrder: 4,
  });

  console.log("Seeding affiliates...");
  await upsertAffiliate({
    slug: "dongshin",
    nameKo: "(주)동신소재",
    nameEn: "DongShin Materials",
    taglineKo: "GFRP 보강근 · 경량골재 · 나노 소재 합성 — 그룹의 미래 성장 동력",
    taglineEn: "GFRP rebar, lightweight aggregate, nano-material synthesis — the group's future growth engine",
    sortOrder: 1,
  });
  await upsertAffiliate({
    slug: "efhydro",
    nameKo: "(주)이에프하이드로",
    nameEn: "EF Hydro",
    taglineKo: "리튬이온 배터리용 소화약제 EF-LBF20",
    taglineEn: "EF-LBF20 lithium-ion battery fire suppression agent",
    sortOrder: 2,
  });

  console.log("Seeding manufacturers...");
  const hydrofastSelf = await upsertManufacturer({
    slug: "hydrofast",
    name: "HydroFast",
    country: "South Korea",
    descriptionKo: "자체 설계·제작 유압 시스템 및 부품",
    descriptionEn: "In-house designed & fabricated hydraulic systems and components",
    sortOrder: 0,
  });

  const partnerBrands: { slug: string; name: string; country: string; areas: string[] }[] = [
    { slug: "rexroth", name: "Rexroth (Bosch)", country: "Germany", areas: ["hydraulic-engineering"] },
    { slug: "hydraforce", name: "HydraForce", country: "United States", areas: ["hydraulic-engineering"] },
    { slug: "gemels", name: "Gemels", country: "Italy", areas: ["hydraulic-engineering"] },
    { slug: "dynaset", name: "Dynaset", country: "Finland", areas: ["hydraulic-engineering", "fire-safety"] },
    { slug: "euroswitch", name: "Euroswitch", country: "Italy", areas: ["hydraulic-engineering"] },
    { slug: "oleoweb", name: "Oleoweb", country: "Italy", areas: ["hydraulic-engineering"] },
    { slug: "water-hydraulics", name: "The Water Hydraulics Co. Ltd", country: "United Kingdom", areas: ["fluid-gas"] },
    { slug: "moveco", name: "Moveco", country: "Italy", areas: ["hydraulic-engineering"] },
    { slug: "smart-sensor", name: "Smart Sensor", country: "South Korea", areas: ["hydraulic-engineering"] },
    { slug: "godiva", name: "Godiva", country: "United Kingdom", areas: ["fire-safety"] },
    { slug: "hale", name: "Hale", country: "United States", areas: ["fire-safety"] },
    { slug: "elkhart-brass", name: "Elkhart Brass", country: "United States", areas: ["fire-safety"] },
    { slug: "alco", name: "Alco", country: "Germany", areas: ["fire-safety"] },
    { slug: "big-fire-ventilation", name: "BIG Fire & Ventilation", country: "Germany", areas: ["fire-safety"] },
    { slug: "wlp", name: "WLP", country: "Italy", areas: ["fire-safety"] },
    { slug: "rehobot", name: "REHOBOT", country: "Sweden", areas: ["hydraulic-engineering", "bolting-torque"] },
  ];

  const areaBySlug: Record<string, typeof boltingTorque> = {
    "bolting-torque": boltingTorque,
    "fluid-gas": fluidGas,
    "hydraulic-engineering": hydraulicEngineering,
    "fire-safety": fireSafety,
  };

  for (const brand of partnerBrands) {
    const mfr = await upsertManufacturer({
      slug: brand.slug,
      name: brand.name,
      country: brand.country,
      sortOrder: 10,
    });
    for (const areaSlug of brand.areas) {
      const area = areaBySlug[areaSlug];
      await db
        .insert(manufacturerBusinessAreas)
        .values({ manufacturerId: mfr.id, businessAreaId: area.id })
        .onConflictDoNothing();
    }
  }
  await db
    .insert(manufacturerBusinessAreas)
    .values([
      { manufacturerId: hydrofastSelf.id, businessAreaId: boltingTorque.id },
      { manufacturerId: hydrofastSelf.id, businessAreaId: fluidGas.id },
      { manufacturerId: hydrofastSelf.id, businessAreaId: hydraulicEngineering.id },
      { manufacturerId: hydrofastSelf.id, businessAreaId: fireSafety.id },
    ])
    .onConflictDoNothing();

  console.log("Seeding product categories with spec schemas...");
  await upsertCategory({
    slug: "hydraulic-tensioners",
    businessAreaId: boltingTorque.id,
    nameKo: "유압 텐셔너",
    nameEn: "Hydraulic Tensioners",
    sortOrder: 1,
    specSchema: [
      specField({ key: "bolt_diameter_range", labelKo: "볼트 직경 범위", labelEn: "Bolt Diameter Range", dataType: "text", showInCardTeaser: true, sortOrder: 1 }),
      specField({ key: "max_pressure", labelKo: "최대 압력", labelEn: "Max Pressure", dataType: "unit_value", unit: "bar", showInCardTeaser: true, sortOrder: 2 }),
      specField({ key: "tensioning_force", labelKo: "텐셔닝 힘", labelEn: "Tensioning Force", dataType: "unit_value", unit: "kN", sortOrder: 3 }),
      specField({ key: "stroke", labelKo: "스트로크", labelEn: "Stroke", dataType: "unit_value", unit: "mm", sortOrder: 4 }),
    ],
  });
  await upsertCategory({
    slug: "smart-torque-tools",
    businessAreaId: boltingTorque.id,
    nameKo: "스마트 토크 툴",
    nameEn: "Smart Torque Tools",
    sortOrder: 2,
    specSchema: [
      specField({ key: "torque_range", labelKo: "토크 범위", labelEn: "Torque Range", dataType: "unit_value", unit: "N·m", showInCardTeaser: true, sortOrder: 1 }),
      specField({
        key: "drive_size",
        labelKo: "드라이브 규격",
        labelEn: "Drive Size",
        dataType: "select",
        showInCardTeaser: true,
        sortOrder: 2,
        options: [
          { value: "3/4", labelKo: "3/4인치", labelEn: '3/4"' },
          { value: "1", labelKo: "1인치", labelEn: '1"' },
          { value: "1.5", labelKo: "1.5인치", labelEn: '1.5"' },
        ],
      }),
      specField({ key: "battery_voltage", labelKo: "배터리 전압", labelEn: "Battery Voltage", dataType: "unit_value", unit: "V", sortOrder: 3 }),
    ],
  });
  await upsertCategory({
    slug: "torque-calibration-systems",
    businessAreaId: boltingTorque.id,
    nameKo: "토크 교정 시스템",
    nameEn: "Torque Calibration Systems",
    sortOrder: 3,
    specSchema: [
      specField({ key: "calibration_range", labelKo: "교정 범위", labelEn: "Calibration Range", dataType: "unit_value", unit: "N·m", showInCardTeaser: true, sortOrder: 1 }),
      specField({
        key: "standard",
        labelKo: "인증 기준",
        labelEn: "Standard",
        dataType: "select",
        showInCardTeaser: true,
        sortOrder: 2,
        options: [
          { value: "iso", labelKo: "ISO", labelEn: "ISO" },
          { value: "ukas", labelKo: "UKAS", labelEn: "UKAS" },
        ],
      }),
    ],
  });
  await upsertCategory({
    slug: "high-pressure-valves-fittings",
    businessAreaId: fluidGas.id,
    nameKo: "초고압 밸브·피팅",
    nameEn: "High-Pressure Valves & Fittings",
    sortOrder: 1,
    specSchema: [
      specField({ key: "max_pressure", labelKo: "최대 압력", labelEn: "Max Pressure", dataType: "unit_value", unit: "bar", showInCardTeaser: true, sortOrder: 1 }),
      specField({ key: "port_size", labelKo: "포트 규격", labelEn: "Port Size", dataType: "text", showInCardTeaser: true, sortOrder: 2 }),
      specField({
        key: "material",
        labelKo: "재질",
        labelEn: "Material",
        dataType: "select",
        sortOrder: 3,
        options: [
          { value: "sus316", labelKo: "SUS316", labelEn: "SUS316" },
          { value: "carbon_steel", labelKo: "탄소강", labelEn: "Carbon Steel" },
          { value: "other", labelKo: "기타", labelEn: "Other" },
        ],
      }),
    ],
  });
  await upsertCategory({
    slug: "gas-boosters-pump-units",
    businessAreaId: fluidGas.id,
    nameKo: "가스 부스터·펌프 유니트",
    nameEn: "Gas Boosters & Pump Units",
    sortOrder: 2,
    specSchema: [
      specField({ key: "max_output_pressure", labelKo: "최대 출력 압력", labelEn: "Max Output Pressure", dataType: "unit_value", unit: "bar", showInCardTeaser: true, sortOrder: 1 }),
      specField({
        key: "drive_type",
        labelKo: "구동 방식",
        labelEn: "Drive Type",
        dataType: "select",
        showInCardTeaser: true,
        sortOrder: 2,
        options: [
          { value: "air", labelKo: "에어구동", labelEn: "Air-driven" },
          { value: "electric", labelKo: "전동", labelEn: "Electric" },
        ],
      }),
      specField({ key: "flow_rate", labelKo: "유량", labelEn: "Flow Rate", dataType: "unit_value", unit: "L/min", sortOrder: 3 }),
    ],
  });
  await upsertCategory({
    slug: "pumps-motors-manifolds",
    businessAreaId: hydraulicEngineering.id,
    nameKo: "유압 펌프·모터·매니폴드",
    nameEn: "Pumps, Motors & Manifolds",
    sortOrder: 1,
    specSchema: [
      specField({ key: "displacement", labelKo: "배출량", labelEn: "Displacement", dataType: "unit_value", unit: "cc/rev", showInCardTeaser: true, sortOrder: 1 }),
      specField({ key: "max_pressure", labelKo: "최대 압력", labelEn: "Max Pressure", dataType: "unit_value", unit: "bar", showInCardTeaser: true, sortOrder: 2 }),
      specField({ key: "port_config", labelKo: "포트 구성", labelEn: "Port Configuration", dataType: "text", sortOrder: 3 }),
    ],
  });
  await upsertCategory({
    slug: "fire-pumps",
    businessAreaId: fireSafety.id,
    nameKo: "소방차용 물 펌프",
    nameEn: "Fire Pumps",
    sortOrder: 1,
    specSchema: [
      specField({ key: "flow_rate", labelKo: "유량", labelEn: "Flow Rate", dataType: "unit_value", unit: "LPM", showInCardTeaser: true, sortOrder: 1 }),
      specField({ key: "max_pressure", labelKo: "최대 압력", labelEn: "Max Pressure", dataType: "unit_value", unit: "bar", sortOrder: 2 }),
      specField({
        key: "pump_type",
        labelKo: "펌프 방식",
        labelEn: "Pump Type",
        dataType: "select",
        showInCardTeaser: true,
        sortOrder: 3,
        options: [
          { value: "centrifugal", labelKo: "원심", labelEn: "Centrifugal" },
          { value: "other", labelKo: "기타", labelEn: "Other" },
        ],
      }),
    ],
  });
  await upsertCategory({
    slug: "fire-monitors-nozzles",
    businessAreaId: fireSafety.id,
    nameKo: "방수총",
    nameEn: "Fire Monitors & Nozzles",
    sortOrder: 2,
    specSchema: [
      specField({ key: "flow_rate", labelKo: "유량", labelEn: "Flow Rate", dataType: "unit_value", unit: "LPM", showInCardTeaser: true, sortOrder: 1 }),
      specField({ key: "max_range", labelKo: "최대 사거리", labelEn: "Max Range", dataType: "unit_value", unit: "m", showInCardTeaser: true, sortOrder: 2 }),
      specField({ key: "mount_type", labelKo: "장착 방식", labelEn: "Mount Type", dataType: "text", sortOrder: 3 }),
    ],
  });
  await upsertCategory({
    slug: "misting-ventilation-systems",
    businessAreaId: fireSafety.id,
    nameKo: "미세안개·송풍 시스템",
    nameEn: "Misting & Ventilation Systems",
    sortOrder: 3,
    specSchema: [
      specField({ key: "coverage_range", labelKo: "도달 거리", labelEn: "Coverage Range", dataType: "unit_value", unit: "m", showInCardTeaser: true, sortOrder: 1 }),
      specField({ key: "power", labelKo: "구동 동력", labelEn: "Power", dataType: "text", showInCardTeaser: true, sortOrder: 2 }),
      specField({ key: "nozzle_count", labelKo: "노즐 수", labelEn: "Nozzle Count", dataType: "number", sortOrder: 3 }),
    ],
  });

  console.log("Seeding company history...");
  const historyRows: { year: number; month: number | null; titleKo: string; isHighlight?: boolean }[] = [
    { year: 1998, month: 5, titleKo: "한국하이드로훼스트 설립" },
    { year: 2010, month: 5, titleKo: "(주)하이드로훼스트 법인 변경" },
    { year: 2014, month: 1, titleKo: "(주)하이드로훼스트 기술연구소 설립" },
    { year: 2014, month: 3, titleKo: "인하대 산학협력단 해양플랜트특성화대학 연구과제 참여" },
    { year: 2016, month: 3, titleKo: "산업통상자원부 산업소재핵심기술개발사업 주관기관 선정" },
    { year: 2016, month: 7, titleKo: "산업소재핵심기술개발사업 협약 체결(6개월)" },
    { year: 2019, month: 12, titleKo: "부천시 미세먼지특화사업 컨소시엄 과제 수행" },
    { year: 2019, month: 12, titleKo: "한국소방산업협회 정회원" },
    { year: 2020, month: 3, titleKo: "소재 부품 전문 기업 자격 취득" },
    { year: 2020, month: 7, titleKo: "벤처기업 등록(KIBO)" },
    { year: 2021, month: 12, titleKo: "조선기자재협회 정회원 가입" },
    { year: 2022, month: 4, titleKo: "인천 혁신 Plus(+) 100 기업 선정(인천광역시, KIBO)" },
    { year: 2023, month: 3, titleKo: "소재부품 장비전문기업 선정" },
    { year: 2024, month: 9, titleKo: "기술혁신형 중소기업(Inno-Biz) 선정" },
    { year: 2025, month: 7, titleKo: "포스코 안전보건인증 취득" },
    { year: 2025, month: 12, titleKo: "기업수요지향기술 종합설계 경진대회 대상 수상", isHighlight: true },
    { year: 2026, month: 1, titleKo: "REXROTH CE 파트너 대리점" },
    { year: 2026, month: 4, titleKo: "중소벤처기업진흥공단 글로벌 CEO" },
  ];
  for (const [i, row] of historyRows.entries()) {
    const existing = await db.select().from(historyEvents).where(eq(historyEvents.titleKo, row.titleKo));
    if (existing.length === 0) {
      await db.insert(historyEvents).values({ ...row, isHighlight: row.isHighlight ?? false, sortOrder: i });
    }
  }

  console.log("Seeding certifications...");
  const certRows: { titleKo: string; category: "patent" | "certification" }[] = [
    { titleKo: "메탈 씰을 갖는 유압식 너트", category: "patent" },
    { titleKo: "어댑터식 유압인장너트", category: "patent" },
    { titleKo: "유압식 글랜드 팔로워를 이용한 패킹 누유방지장치", category: "patent" },
    { titleKo: "유압식 너트의 해체장치", category: "patent" },
    { titleKo: "초고압 일체형 유압유니트 및 이를 이용한 유압장치", category: "patent" },
    { titleKo: "K형 용접 이음 형상을 이용한 용접방법", category: "patent" },
    { titleKo: "경사 토치를 이용한 용접 장치", category: "patent" },
    { titleKo: "미세먼지 저감장치 및 미세먼지 저감방법", category: "patent" },
    { titleKo: "휴대용 연기차단막", category: "patent" },
    { titleKo: "가변 제어 초고압 유니트를 이용한 분무장치", category: "patent" },
    { titleKo: "공업단지 비산먼지 대응 서비스 제공 시스템", category: "patent" },
    { titleKo: "섬유 강화 플라스틱으로 이루어진 농작물 지지대", category: "patent" },
    { titleKo: "도킹장치 및 이를 이용한 도킹방법", category: "patent" },
    { titleKo: "사다리 구조체 및 소방용 사다리 구조체", category: "patent" },
    { titleKo: "물 분사장치가 장착된 이동수단", category: "patent" },
    { titleKo: "ISO 9001", category: "certification" },
    { titleKo: "ISO 14001", category: "certification" },
    { titleKo: "이노비즈", category: "certification" },
    { titleKo: "소재부품장비전문기업", category: "certification" },
    { titleKo: "벤처기업", category: "certification" },
    { titleKo: "중소기업", category: "certification" },
  ];
  for (const [i, row] of certRows.entries()) {
    const existing = await db.select().from(certifications).where(eq(certifications.titleKo, row.titleKo));
    if (existing.length === 0) {
      await db.insert(certifications).values({ ...row, sortOrder: i });
    }
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
