/**
 * Rich, brochure-derived content for the 5 headline business areas.
 *
 * The DB-backed `business_areas` table (see src/db/schema) only models a name +
 * summary + a flat category list, which can't express the company brochure's
 * multi-section layout (feature blocks, spec tables, side-by-side comparisons,
 * captioned galleries). Rather than over-fit the schema, the marketing detail
 * pages render from this hand-authored module, sourced 1:1 from
 * legacy-content/pdf_into_png (the print brochure). Images live under
 * /public/content/** so these pages have no runtime dependency on the CMS or on
 * Supabase Storage.
 *
 * Korean is the source of truth; `en` is provided for headings/captions and
 * falls back to `ko` in the renderer when omitted.
 */

export type Loc = { ko: string; en?: string };
export type ContentImage = { src: string; caption?: Loc };

export type ContentBlock =
  | {
      kind: "feature";
      badge?: Loc;
      title: Loc;
      body?: Loc;
      pills?: Loc[];
      images?: ContentImage[];
      imageLayout?: "row" | "grid" | "single";
      reverse?: boolean;
    }
  | { kind: "gallery"; title?: Loc; subtitle?: Loc; columns?: 2 | 3 | 4; images: ContentImage[] }
  | { kind: "specTable"; title?: Loc; headers: Loc[]; rows: Loc[][] }
  | {
      kind: "compare";
      title?: Loc;
      note?: Loc;
      left: { title: Loc; rows: { label: Loc; value: Loc }[] };
      right: { title: Loc; highlight?: boolean; rows: { label: Loc; value: Loc }[] };
    }
  | { kind: "bullets"; title?: Loc; items: Loc[] }
  | { kind: "brands"; title?: Loc; items: { name: string; country?: string }[] }
  | { kind: "figure"; title?: Loc; src: string; caption?: Loc };

export type ContentSection = { heading?: Loc; kicker?: Loc; blocks: ContentBlock[] };

export interface BusinessAreaContent {
  slug: string;
  order: number;
  accent: string;
  index: string; // "01".."05"
  name: Loc;
  nameEn: string; // the italic english subtitle used on the brochure index
  tagline: Loc;
  summary: Loc;
  heroImage: string;
  cardImage: string;
  sections: ContentSection[];
}

const b = (src: string, caption?: Loc): ContentImage => ({ src, caption });

export const BUSINESS_AREAS: BusinessAreaContent[] = [
  // ─────────────────────────────────────────────────────────── 01
  {
    slug: "bolting-torque",
    order: 1,
    accent: "#eb3a03",
    index: "01",
    name: { ko: "정밀 볼팅 & 토크 솔루션", en: "Precision Bolting & Torque" },
    nameEn: "Precision Bolting & Torque",
    tagline: {
      ko: "툴 선정 – 시공 – FMS까지 하나로 묶은 유압 볼팅 & 토크 시스템",
      en: "Tool selection, installation and FMS monitoring — one integrated bolting & torque system",
    },
    summary: {
      ko: "발전·석유화학·중공업·플랜트 현장을 위한 정밀 토크 장비와 국제 인증 교정 시스템, 원자력 A등급 유압 텐셔닝을 공급합니다.",
      en: "Precision torque tooling, internationally certified calibration systems, and nuclear-grade hydraulic tensioning for power, petrochemical and heavy industry.",
    },
    heroImage: "/content/bolting/precision_torque1.webp",
    cardImage: "/content/bolting/smart_factory_torque_management1.webp",
    sections: [
      {
        blocks: [
          {
            kind: "feature",
            badge: { ko: "국내 교정기관 점유율 1위", en: "#1 Calibration Share in Korea" },
            title: {
              ko: "글로벌 정밀 토크 기술 — 국내 최대 토크 장비 및 교정 시스템 공급",
              en: "Global precision torque technology — Korea's largest torque equipment & calibration supply",
            },
            body: {
              ko: "90년 이상 기술력을 축적한 유럽 기반 파트너와 함께 국제 인증(ISO/UKAS) 기준으로 검·교정 장비 및 다양한 토크 툴을 활용하여 고객 맞춤 솔루션을 제공합니다.",
              en: "Together with European partners carrying 90+ years of engineering heritage, we deliver ISO/UKAS-certified inspection & calibration equipment and a full range of torque tools tailored to each customer.",
            },
            images: [
              b("/content/bolting/precision_torque1.webp"),
              b("/content/bolting/precision_torque2.webp", { ko: "스마트 토크 툴", en: "Smart torque tools" }),
              b("/content/bolting/precision_torque3.webp", { ko: "토크 교정 시스템", en: "Torque calibration system" }),
            ],
            imageLayout: "row",
          },
          {
            kind: "feature",
            badge: { ko: "Industry 4.0 시대 최적의 파트너", en: "Optimized for Industry 4.0" },
            title: { ko: "조립라인 최적화 토크 시스템", en: "Assembly-line-optimized torque systems" },
            body: {
              ko: "세계 최초 토크 장비 파트너와 Industry 4.0 시대에 맞춰 디지털 제어와 무선 기술을 결합함으로써, 스마트 조립 공정의 품질을 표준화하고 고객 맞춤형 스마트 팩토리 솔루션을 제공합니다.",
              en: "Combining digital control and wireless technology with the partner that pioneered torque equipment, we standardize smart-assembly quality and deliver bespoke smart-factory solutions.",
            },
            images: [
              b("/content/bolting/smart_factory_torque_management1.webp"),
              b("/content/bolting/smart_factory_torque_management2.webp"),
              b("/content/bolting/smart_factory_torque_management3.webp"),
              b("/content/bolting/smart_factory_torque_management4.webp", {
                ko: "스마트 팩토리 토크 매니지먼트 시스템",
                en: "Smart-factory torque management system",
              }),
            ],
            imageLayout: "grid",
            reverse: true,
          },
          {
            kind: "feature",
            badge: { ko: "원자력 A등급 유자격 업체", en: "Nuclear Grade-A Qualified" },
            title: {
              ko: "현장 맞춤 설계 기반 가장 안전한 유압 텐셔닝 시스템",
              en: "Site-engineered, safest-in-class hydraulic tensioning",
            },
            body: {
              ko: "다양한 현장 조건에 맞춘 설계와 초고압 유압 기술을 결합해, 볼팅 작업을 빠르고 정밀하며 안전하게 수행하는 볼트 텐셔닝 시스템(볼트 텐셔너, CamNut, 유압볼트)을 제공합니다.",
              en: "Pairing condition-specific design with ultra-high-pressure hydraulics, we supply bolt tensioning systems (bolt tensioners, CamNut, hydraulic bolts) that make bolting fast, precise and safe.",
            },
            images: [
              b("/content/bolting/auto_adjustment_tensioning_device.webp", {
                ko: "자동 보정식 텐셔닝 장치",
                en: "Auto-adjusting tensioning device",
              }),
              b("/content/bolting/custom_fit_tensioning_solution1.webp"),
              b("/content/bolting/custom_fit_tensioning_solution2.webp", {
                ko: "현장 맞춤 텐셔닝 솔루션",
                en: "Custom-fit tensioning solution",
              }),
            ],
            imageLayout: "row",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────── 02
  {
    slug: "fluid-gas",
    order: 2,
    accent: "#1d6fd6",
    index: "02",
    name: { ko: "초고압 유체·가스 시스템", en: "High-Pressure Fluid & Gas" },
    nameEn: "High-Pressure Fluid & Gas",
    tagline: {
      ko: "초고압·고순도 가스·유압·수압 종합 솔루션 제공",
      en: "Integrated ultra-high-pressure gas, hydraulic and water-pressure solutions",
    },
    summary: {
      ko: "현장 에어만으로 최대 4,000bar 증압, 6,900bar급 밸브·피팅, 그리고 국내 최초의 물 기반 친환경 고압 시스템까지 — 수소 시대의 고압 코어를 공급합니다.",
      en: "Boosting to 4,000 bar on shop air alone, 6,900 bar-class valves & fittings, and Korea's first water-based high-pressure system — the high-pressure core for the hydrogen era.",
    },
    heroImage: "/content/fluidgas/hydrogas_main1.jpg",
    cardImage: "/content/fluidgas/hydrogas_main2.webp",
    sections: [
      {
        blocks: [
          {
            kind: "feature",
            badge: { ko: "에어구동 최대 4,000Bar", en: "Air-driven up to 4,000 bar" },
            title: { ko: "초고압 가스·수압 솔루션", en: "Ultra-high-pressure gas & water-pressure solutions" },
            body: {
              ko: "현장 에어만으로 고순도 가스와 초고압 유체를 증압 가능하며, 작업이 어려운 환경에서도 신뢰성 높은 초고압 시스템을 제공합니다.",
              en: "Boosts high-purity gas and ultra-high-pressure fluid using only shop air, delivering reliable high-pressure systems even in demanding environments.",
            },
            images: [
              b("/content/fluidgas/hydrogas_main1.jpg"),
              b("/content/fluidgas/hydrogas_unit1.jpg", { ko: "가스 부스터 유니트", en: "Gas booster unit" }),
              b("/content/fluidgas/hydrogas_unit2.webp", { ko: "펌프 유니트", en: "Pump unit" }),
            ],
            imageLayout: "row",
          },
          {
            kind: "feature",
            badge: { ko: "최대 6,900Bar 밸브", en: "Valves up to 6,900 bar" },
            title: { ko: "초고압 밸브·튜빙·피팅 컴포넌트", en: "Ultra-high-pressure valves, tubing & fittings" },
            body: {
              ko: "초고압에서도 안정적인 제어가 가능한 밸브·피팅류를 제공해 고압 시스템의 안전성과 우수한 내구성을 확보합니다.",
              en: "Valves and fittings that stay in stable control even at extreme pressure, securing the safety and durability of high-pressure systems.",
            },
            pills: [
              { ko: "정밀 제어", en: "Precision control" },
              { ko: "현장 맞춤 설계", en: "Site-specific design" },
            ],
            images: [
              b("/content/fluidgas/hydrogas_main2.webp"),
              b("/content/fluidgas/hydrogas_application_waterfriendly_nitrogen_gas_controller.webp", {
                ko: "질소압력 자동화 조정 장치",
                en: "Automated nitrogen-pressure controller",
              }),
            ],
            imageLayout: "row",
            reverse: true,
          },
          {
            kind: "feature",
            badge: { ko: "친환경 수압 기술", en: "Eco-friendly water-pressure tech" },
            title: { ko: "국내 최초 물 기반 고압 친수 시스템", en: "Korea's first water-based high-pressure system" },
            body: {
              ko: "작동유 대신 물을 사용하는 국내 최초의 수문용 실린더 및 펌프를 적용하여, 기름을 쓰지 않아 누유로 인한 오염 우려가 없으며 유지관리 부담을 낮춘 친환경 수압 솔루션을 제공합니다.",
              en: "Korea's first floodgate cylinders and pumps that run on water instead of hydraulic oil — no oil means no leak contamination and lower maintenance, for a genuinely eco-friendly pressure solution.",
            },
            images: [
              b("/content/fluidgas/hydrogas_application_waterfriendly1.jpg"),
              b("/content/fluidgas/hydrogas_application_waterfriendly2.jpg"),
              b("/content/fluidgas/hydrogas_application_waterfriendly3.webp", {
                ko: "이동형 친수 시스템",
                en: "Mobile water-pressure system",
              }),
            ],
            imageLayout: "row",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────── 03
  {
    slug: "hydraulic-engineering",
    order: 3,
    accent: "#2f9e44",
    index: "03",
    name: { ko: "토탈 유압 시스템", en: "Total Hydraulic Engineering" },
    nameEn: "Total Hydraulic Engineering",
    tagline: {
      ko: "유압 툴부터 맞춤 설계·제작까지 End-to-End",
      en: "End-to-end, from hydraulic tools to custom design & fabrication",
    },
    summary: {
      ko: "영국·스웨덴·이탈리아 유압 툴 2,000여 종, 펌프·밸브·매니폴드·센서 기반 2D·3D 시스템 설계·제작, 그리고 ETO 맞춤 제작까지 중공업·건설·플랜트 현장을 지원합니다.",
      en: "2,000+ UK/Sweden/Italy hydraulic tools, 2D·3D system design & fabrication around pumps, valves, manifolds and sensors, plus ETO custom builds for heavy industry, construction and plant sites.",
    },
    heroImage: "/content/hydraulic/hydraulic_tools1.jpg",
    cardImage: "/content/hydraulic/hydraulic_system1.webp",
    sections: [
      {
        kicker: { ko: "유압 툴", en: "Hydraulic Tools" },
        heading: { ko: "유압 툴 개요", en: "Hydraulic tools overview" },
        blocks: [
          {
            kind: "feature",
            badge: { ko: "영국산 British Engineering", en: "British Engineering" },
            title: {
              ko: "플랜트·중공업용 고압 유압·볼팅·리프팅 토탈 솔루션",
              en: "High-pressure hydraulic, bolting & lifting total solution for plant and heavy industry",
            },
            body: {
              ko: "2,000여 종의 실린더·펌프·토크/텐셔닝 장비로 다양한 중공업·인프라 현장의 중량물 작업을 지원하며, 대형 구조물 동조 리프팅부터 특수 플랜지 체결·수압 테스트까지 프로젝트별 맞춤 설계를 제공합니다.",
              en: "With 2,000+ cylinders, pumps and torque/tensioning tools we support heavy-load work across industry and infrastructure — from synchronized lifting of large structures to special flange make-up and pressure testing, all designed per project.",
            },
            images: [
              b("/content/hydraulic/hydraulic_tools1.jpg"),
              b("/content/hydraulic/hydraulic_tools2.jpg"),
              b("/content/hydraulic/hydraulic_tools3.jpg"),
            ],
            imageLayout: "row",
          },
          {
            kind: "feature",
            badge: { ko: "고품질 ↑ 내구성 ↑ 경량화 ↑", en: "Quality ↑ Durability ↑ Lightweight ↑" },
            title: { ko: "스웨덴 초고압 기술 기반 경량 제품 공급", en: "Swedish ultra-high-pressure, lightweight product line" },
            body: {
              ko: "자동차·산업 설비 유지보수, 생산라인 정비, 원전 해체 등에서 우수한 내구성과 신뢰성을 갖춘 경량화된 초고압(3,000bar) 제품들로 장기 운용 비용을 최소화합니다.",
              en: "Lightweight 3,000-bar products with proven durability and reliability for automotive/industrial maintenance, production-line service and nuclear decommissioning — minimizing long-term operating cost.",
            },
            images: [
              b("/content/hydraulic/hydraulic_tools_application_car_maintenance.webp", {
                ko: "자동차 정비 전동 툴",
                en: "Automotive service power tool",
              }),
              b("/content/hydraulic/hydraulic_tools_application_heavy_lifting1.webp", {
                ko: "중량물 리프팅",
                en: "Heavy-load lifting",
              }),
            ],
            imageLayout: "row",
            reverse: true,
          },
          {
            kind: "feature",
            badge: { ko: "전문성 & 다양성", en: "Expertise & Range" },
            title: { ko: "이탈리아 포터블 유압·전동 절단·파쇄 전문 솔루션", en: "Italian portable hydraulic/electric cutting & breaking tools" },
            body: {
              ko: "유압·전동 구동의 절단·파쇄 툴을 중심으로 협소·제한된 작업 환경에서도 강력한 성능을 발휘하며, 금속 절단부터 콘크리트 파쇄까지 다목적 현장 작업을 지원합니다.",
              en: "Hydraulic and electric cutting/breaking tools that deliver strong performance even in tight, restricted spaces — supporting everything from metal cutting to concrete breaking.",
            },
            images: [
              b("/content/hydraulic/hydraulic_tools_application_battery_cutter1.webp", {
                ko: "배터리 유압 커터",
                en: "Battery hydraulic cutter",
              }),
              b("/content/hydraulic/hydraulic_tools_application_nuclear_plant_disassemble.webp", {
                ko: "원자력 해체용 클램프 장치",
                en: "Nuclear-decommissioning clamp",
              }),
            ],
            imageLayout: "row",
          },
          {
            kind: "gallery",
            title: { ko: "유압 툴 적용 사례", en: "Hydraulic tools in the field" },
            columns: 3,
            images: [
              b("/content/hydraulic/hydraulic_tools_application_battery_cutter2.webp", {
                ko: "배터리 유압 커터",
                en: "Battery hydraulic cutter",
              }),
              b("/content/hydraulic/hydraulic_tools_application_heavy_lifting2.webp", {
                ko: "중량물 리프팅",
                en: "Heavy-load lifting",
              }),
              b("/content/hydraulic/hydraulic_tools_application_car_maintenance.webp", {
                ko: "자동차 정비 전동 툴",
                en: "Automotive service tool",
              }),
            ],
          },
        ],
      },
      {
        kicker: { ko: "시스템 설계 & 제작", en: "System Design & Build" },
        heading: { ko: "유압 시스템 (설계 & 제작)", en: "Hydraulic systems (design & build)" },
        blocks: [
          {
            kind: "feature",
            title: { ko: "유압·제어 컴포넌트 토탈 솔루션", en: "Hydraulic & control component total solution" },
            body: {
              ko: "유압펌프·카트리지 밸브·매니폴드·압력&레벨 센서 및 유압·공압·수압 장비 등 폭넓은 제품군을 기반으로, 2D·3D 설계·제작, 컨트롤 시스템 구성, 비례제어 포함 시스템 구축 등 다양한 현장 요구를 해결하는 유압 기술 중심 솔루션을 제공합니다.",
              en: "Built on a broad range of hydraulic pumps, cartridge valves, manifolds, pressure/level sensors and hydraulic/pneumatic/water equipment, we deliver 2D·3D design & build, control-system integration and proportional-control systems.",
            },
            pills: [
              { ko: "펌프", en: "Pumps" },
              { ko: "밸브", en: "Valves" },
              { ko: "매니폴드", en: "Manifolds" },
              { ko: "센서", en: "Sensors" },
              { ko: "구동장치", en: "Actuators" },
            ],
            images: [
              b("/content/hydraulic/hydraulic_system1.webp"),
              b("/content/hydraulic/hydraulic_system_manifold1.webp"),
              b("/content/hydraulic/hydraulic_system_manifold2.webp"),
              b("/content/hydraulic/hydraulic_system_design2.webp", { ko: "2D·3D 시스템 설계", en: "2D·3D system design" }),
            ],
            imageLayout: "grid",
          },
          {
            kind: "brands",
            title: { ko: "구성품 파트너", en: "Component partners" },
            items: [
              { name: "HydraForce", country: "🇺🇸" },
              { name: "Rexroth (Bosch)", country: "🇩🇪" },
              { name: "Gemels", country: "🇮🇹" },
              { name: "Dynaset", country: "🇫🇮" },
              { name: "Euroswitch", country: "🇮🇹" },
              { name: "Oleoweb", country: "🇮🇹" },
              { name: "The Water Hydraulics Co.", country: "🇬🇧" },
              { name: "Moveco", country: "🇮🇹" },
              { name: "Smart Sensor", country: "🇰🇷" },
            ],
          },
          {
            kind: "gallery",
            title: { ko: "맞춤 설계·제작", en: "Custom design & fabrication" },
            columns: 4,
            images: [
              b("/content/hydraulic/system_application1.jpg", { ko: "트랙터용 트랜스미션", en: "Tractor transmission" }),
              b("/content/hydraulic/system_application2.jpg", { ko: "지게차용 트랜스미션", en: "Forklift transmission" }),
              b("/content/hydraulic/system_application3.jpg", { ko: "유압펌프·모터·밸브", en: "Pump / motor / valve" }),
              b("/content/hydraulic/system_application4.jpg", { ko: "크레인 제어 시스템", en: "Crane control system" }),
            ],
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────── 04
  {
    slug: "fire-safety",
    order: 4,
    accent: "#d62828",
    index: "04",
    name: { ko: "소방·환경·산업안전 솔루션", en: "Fire, Environment & Safety" },
    nameEn: "Fire, Environment & Safety",
    tagline: {
      ko: "재난 대응부터 스마트 팜까지 — 소방차 코어 부품·미세안개 분무 시스템·산업안전 장비",
      en: "From disaster response to smart farms — fire-truck core parts, misting systems and industrial safety gear",
    },
    summary: {
      ko: "소방차의 심장인 물 펌프·방수총·송풍기부터, 전기세를 90% 절감하는 유압구동 미세안개 분무 시스템, 그리고 방폭 조명·리프팅백·호스 핸들링까지 공급합니다.",
      en: "From the fire truck's heart — water pumps, monitors and blowers — to a hydraulic misting system that cuts power cost by 90%, plus explosion-proof lighting, lift bags and hose handling.",
    },
    heroImage: "/content/fire/other_products.jpg",
    cardImage: "/content/fire/other_lightings1.webp",
    sections: [
      {
        kicker: { ko: "소방차 코어 부품", en: "Fire-truck Core Parts" },
        heading: { ko: "소방 전문 부품 솔루션", en: "Firefighting component solutions" },
        blocks: [
          {
            kind: "feature",
            badge: { ko: "소방차용 물 펌프", en: "Fire-truck water pumps" },
            title: { ko: "원심 물 펌프 (GODIVA · HALE)", en: "Centrifugal water pumps (GODIVA · HALE)" },
            body: {
              ko: "재난(화재) 현장의 필수 요소인 소방차의 핵심 부품을 소방차 제조 업체에 공급합니다. 물 펌프 용량 500LPM ~ 20,000LPM (소방차의 최대 용량).",
              en: "We supply fire-truck OEMs with the core component of disaster response — water pumps rated 500 to 20,000 LPM, the maximum for fire apparatus.",
            },
            images: [
              b("/content/fire/pumps.webp", { ko: "소방차용 원심 물 펌프 (500~20,000 LPM)", en: "Centrifugal fire pumps (500–20,000 LPM)" }),
            ],
            imageLayout: "single",
          },
          {
            kind: "specTable",
            title: { ko: "방수총 (Fire Monitors)", en: "Fire monitors" },
            headers: [
              { ko: "구분", en: "Type" },
              { ko: "브랜드", en: "Brand" },
              { ko: "분당 유량", en: "Flow" },
              { ko: "최대 사거리", en: "Range" },
            ],
            rows: [
              [
                { ko: "일반·공항용 소방차 방수총", en: "Fire-truck / airport monitor" },
                { ko: "Elkhart Brass 🇺🇸" },
                { ko: "3,000 ~ 4,000 LPM" },
                { ko: "100 m" },
              ],
              [
                { ko: "소방선 방수총", en: "Fire-boat monitor" },
                { ko: "Alco 🇩🇪" },
                { ko: "최대 60,000 LPM", en: "up to 60,000 LPM" },
                { ko: "200 m" },
              ],
            ],
          },
          {
            kind: "gallery",
            title: { ko: "방수총 라인업", en: "Monitor lineup" },
            subtitle: {
              ko: "주요 고객: 현대에버다임 · 현대로템 · 우리특장 · 한서정공 · 진우SMC",
              en: "Key customers: Hyundai Everdigm, Hyundai Rotem, Woori, Hanseo, Jinwoo SMC",
            },
            columns: 3,
            images: [
              b("/content/fire/monitor-airport.webp", { ko: "일반·공항용 · 3,000~4,000 LPM · 100m", en: "Airport/truck · 3,000–4,000 LPM · 100 m" }),
              b("/content/fire/monitor-boat.webp", { ko: "소방선용 · 최대 60,000 LPM · 200m", en: "Fireboat · up to 60,000 LPM · 200 m" }),
              b("/content/fire/monitors.webp", { ko: "방수총 유닛 (Elkhart Brass · Alco)", en: "Monitor units (Elkhart Brass · Alco)" }),
            ],
          },
          {
            kind: "feature",
            badge: { ko: "터널 화재·분진 대응", en: "Tunnel fire & dust control" },
            title: { ko: "송풍기 · 분진 미세먼지 시스템 (BIG · WLP)", en: "Ventilation & dust-suppression systems (BIG · WLP)" },
            body: {
              ko: "터널 화재용 연기 배풍·송풍(200M 이상, BIG 🇩🇪)과, 화재현장·공사장 먼지 비산방지용 안개분사 및 물 송풍(도달 150m·340° 회전, WLP 🇮🇹), 저압용 물펌프(DYNASET 🇫🇮)를 공급합니다.",
              en: "Tunnel smoke-extraction blowers (200 m+, BIG 🇩🇪), fog/water blowers for fire-scene and construction dust suppression (150 m reach, 340° rotation, WLP 🇮🇹), and low-pressure water pumps (DYNASET 🇫🇮).",
            },
            images: [
              b("/content/fire/tunnel-fire.webp", { ko: "터널 화재용 송풍 (BIG)", en: "Tunnel fire ventilation (BIG)" }),
              b("/content/fire/blower-units.webp", { ko: "차량 탑재형 송풍 유닛", en: "Truck-mounted blower units" }),
            ],
            imageLayout: "row",
          },
          {
            kind: "gallery",
            columns: 3,
            images: [
              b("/content/fire/fog-jet.webp", { ko: "분진·미세먼지 안개분사 (WLP)", en: "Dust-suppression fog jet (WLP)" }),
              b("/content/fire/range-diagram.webp", { ko: "도달 150m · 확산 340°", en: "150 m reach · 340° spread" }),
              b("/content/fire/lowpump.webp", { ko: "저압용 물펌프 (DYNASET)", en: "Low-pressure water pump (DYNASET)" }),
            ],
          },
        ],
      },
      {
        kicker: { ko: "환경 · 스마트 방제", en: "Environment · Smart Control" },
        heading: { ko: "유압구동 미세안개 분무 시스템", en: "Hydraulic-driven fine-mist spray system" },
        blocks: [
          {
            kind: "feature",
            title: { ko: "온습도 조절, 물·농약·영양/탈취제 무인방제", en: "Unmanned control of temperature/humidity, water, agrochemicals and deodorizers" },
            body: {
              ko: "유압 구동 방식으로 고압 미세안개를 분사해 온습도 조절과 무인 방제를 수행합니다. 기계부 외 구성품은 단순 교체로 유지보수가 간편합니다.",
              en: "Hydraulic drive sprays high-pressure fine mist for climate control and unmanned crop protection; all parts outside the machine core are simple drop-in replacements.",
            },
            images: [
              b("/content/fire/misting-equipment.webp", { ko: "컨트롤 유닛 · 펌프 · 노즐 피팅", en: "Control unit · pump · nozzle fittings" }),
            ],
            imageLayout: "single",
          },
          {
            kind: "specTable",
            title: { ko: "사양 구분", en: "Specifications" },
            headers: [
              { ko: "사양 구분", en: "Spec" },
              { ko: "3HP" },
              { ko: "15HP" },
            ],
            rows: [
              [{ ko: "사이즈 (cm)", en: "Size (cm)" }, { ko: "755 × 655 × 1192" }, { ko: "1,290 × 1,196 × 1,550" }],
              [{ ko: "펌프 전원 & 마력", en: "Power & HP" }, { ko: "220V 단상 · 3HP (2.2kW)", en: "220V 1ph · 3HP (2.2kW)" }, { ko: "380V 3상 · 15HP (11kW)", en: "380V 3ph · 15HP (11kW)" }],
              [{ ko: "펌프 토출 압력", en: "Discharge pressure" }, { ko: "MAX 90 bar" }, { ko: "MAX 90 bar" }],
              [{ ko: "펌프 토출 직경", en: "Discharge dia." }, { ko: "약 8mm", en: "approx. 8mm" }, { ko: '1/2" (12.7mm)' }],
              [{ ko: "노즐 수 (분사량 0.12L)", en: "Nozzles (0.12L)" }, { ko: "60개", en: "60" }, { ko: "1,700개", en: "1,700" }],
              [{ ko: "노즐 수 (분사량 0.08L)", en: "Nozzles (0.08L)" }, { ko: "90개", en: "90" }, { ko: "2,100개", en: "2,100" }],
            ],
          },
          {
            kind: "bullets",
            title: { ko: "핵심 기능 및 특징", en: "Key features" },
            items: [
              { ko: "가변성 — 압력 변동 가능", en: "Variable — adjustable pressure" },
              { ko: "분사 시간 및 분사량 세팅 가능", en: "Programmable spray time & volume" },
              { ko: "고압식 노즐 분사", en: "High-pressure nozzle spray" },
              { ko: "유압 구동에 의한 분사 방식", en: "Hydraulic-drive spray" },
              { ko: "노즐 공통: 연결 직경 3~5mm · 분사 압력 20~70kg/cm² · 액적 크기 30~50µm", en: "Nozzle: 3–5mm connection · 20–70kg/cm² · 30–50µm droplet" },
            ],
          },
          {
            kind: "compare",
            title: { ko: "전기세 비교", en: "Power-cost comparison" },
            note: { ko: "기성 에어 컴프레셔 방식 분사 시스템 대비 10배 절감 효과", en: "10× cheaper to run than conventional air-compressor spray systems" },
            left: {
              title: { ko: "타사 (Competitor)", en: "Competitor" },
              rows: [
                { label: { ko: "마력 (Horsepower)", en: "Horsepower" }, value: { ko: "30 HP" } },
                { label: { ko: "계수 (Coefficient)", en: "Coefficient" }, value: { ko: "0.75" } },
                { label: { ko: "시간당 전력", en: "Power / hr" }, value: { ko: "22.35 kW" } },
                { label: { ko: "시간당 전기세", en: "Cost / hr" }, value: { ko: "8,046 원", en: "₩8,046" } },
              ],
            },
            right: {
              title: { ko: "당사 (HYDROFAST)", en: "HYDROFAST" },
              highlight: true,
              rows: [
                { label: { ko: "마력 (Horsepower)", en: "Horsepower" }, value: { ko: "3 HP" } },
                { label: { ko: "계수 (Coefficient)", en: "Coefficient" }, value: { ko: "동일", en: "same" } },
                { label: { ko: "시간당 전력", en: "Power / hr" }, value: { ko: "2.235 kW" } },
                { label: { ko: "시간당 전기세", en: "Cost / hr" }, value: { ko: "805 원 (90%↓)", en: "₩805 (−90%)" } },
              ],
            },
          },
          {
            kind: "gallery",
            title: { ko: "열화상 분석 — 안개 분사 전·후", en: "Thermal analysis — before & after misting" },
            columns: 3,
            images: [
              b("/content/fire/misting-thermal.webp", { ko: "분사 전 → 2~3분 경과 → 정지 3분 후 (냉감 잔류)", en: "Before → after 2–3 min → 3 min after stop" }),
            ],
          },
          {
            kind: "gallery",
            title: { ko: "현장 맞춤 스마트 무인방제", en: "Site-tuned smart unmanned control" },
            subtitle: {
              ko: "대규모 동시 분사 · 소규모 부분 분사 · 분사 시간/빈도 자동조절 · 농작물별 분사 위치 세팅",
              en: "Large-scale or partial spraying, auto time/frequency control, crop-specific nozzle placement",
            },
            columns: 4,
            images: [
              b("/content/fire/app-1.webp", { ko: "영양 스마트팜 (고추)", en: "Yeongyang smart farm (pepper)" }),
              b("/content/fire/app-2.webp", { ko: "영양 스마트팜 (고추)", en: "Yeongyang smart farm (pepper)" }),
              b("/content/fire/app-3.webp", { ko: "성주 비닐하우스 (참외)", en: "Seongju greenhouse (melon)" }),
              b("/content/fire/app-4.webp", { ko: "하동 스마트팜 (방울토마토)", en: "Hadong smart farm (tomato)" }),
              b("/content/fire/app-5.webp", { ko: "보은 하우스 (대추)", en: "Boeun greenhouse (jujube)" }),
              b("/content/fire/app-6.webp", { ko: "역곡 하수처리장 (악취 제거)", en: "Yeokgok sewage plant (odor control)" }),
              b("/content/fire/app-7.webp", { ko: "어린이 야외학습 공간 (온도 저감)", en: "Outdoor learning space (cooling)" }),
            ],
          },
        ],
      },
      {
        kicker: { ko: "산업안전 장비", en: "Industrial Safety" },
        heading: { ko: "그 외 기타 제품", en: "Other products" },
        blocks: [
          {
            kind: "feature",
            badge: { ko: "IP방수 · 방폭 · KC 인증", en: "IP-rated · Ex-proof · KC certified" },
            title: { ko: "전문 현장용 고성능 작업 조명", en: "High-performance work lighting" },
            body: {
              ko: "현장에서 요구되는 밝기·안전 기준을 충족하는 방폭등, 360° 작업등, 라인 조명까지 폭넓은 제품군으로 다양한 작업 환경에 맞는 조명 구성을 지원합니다.",
              en: "Explosion-proof lamps, 360° work lights and line lighting that meet site brightness and safety standards across a wide product range.",
            },
            images: [
              b("/content/fire/other_lightings1.webp"),
              b("/content/fire/other_lightings2.webp"),
              b("/content/fire/other_lightings13.webp"),
            ],
            imageLayout: "row",
          },
          {
            kind: "feature",
            badge: { ko: "중량물 · 공간확보 · 최소높이 2.5cm", en: "Heavy loads · min. height 2.5cm" },
            title: { ko: "협소한 현장 리프팅 전용 장비 (리프팅백)", en: "Lifting bags for confined spaces" },
            body: {
              ko: "스웨덴 기술력을 기반으로 산업 현장에서 중량물 리프팅 작업 및 공간 확보를 위한 에어구동 장비를 제공합니다.",
              en: "Swedish-engineered air-driven equipment for heavy-load lifting and clearance creation on industrial sites.",
            },
            images: [
              b("/content/fire/other_lift_bag2.webp"),
              b("/content/fire/other_lift_bag3.webp"),
            ],
            imageLayout: "row",
            reverse: true,
          },
          {
            kind: "feature",
            badge: { ko: "고압 호스 컨트롤", en: "High-pressure hose control" },
            title: { ko: "소방·산업용 장거리 호스 배치·회수 보조 솔루션", en: "Long-distance hose deployment & recovery" },
            body: {
              ko: "화재현장·플랜트·토목공사 등 장거리 호스 운용이 필요한 환경에서 호스 이송·회수를 기계적으로 보조하여 작업자의 신체 부담을 줄이고 인력 의존도를 낮추며, 다양한 지형에서 안정적으로 운용 가능한 견고한 설계로 현장 대응 효율과 안전성을 높입니다.",
              en: "Mechanically assists hose deployment and recovery over long distances at fire scenes, plants and civil sites — reducing worker strain and manpower dependence with a rugged design for varied terrain.",
            },
            images: [
              b("/content/fire/other_hose_mobility1.webp"),
              b("/content/fire/other_hose_mobility2.webp"),
            ],
            imageLayout: "row",
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────── 05
  {
    slug: "advanced-materials",
    order: 5,
    accent: "#7c3aed",
    index: "05",
    name: { ko: "신소재·신기술 (계열사)", en: "Advanced Materials & Technology" },
    nameEn: "Advanced Materials & Technology",
    tagline: {
      ko: "그룹의 미래 성장 동력 — GFRP 보강근 · 경량골재 · 나노 소재 합성 · 배터리 소화약제",
      en: "The group's future growth engine — GFRP rebar, lightweight aggregate, nano synthesis, battery fire suppression",
    },
    summary: {
      ko: "계열사 (주)동신소재의 GFRP 보강근·경량골재·나노 소재 합성 기술과, (주)이에프하이드로의 리튬이온 배터리용 소화약제 EF-LBF20을 소개합니다.",
      en: "The GFRP rebar, lightweight aggregate and nano-synthesis of affiliate DongShin Materials, and EF-LBF20 lithium-ion battery fire suppression from affiliate EF Hydro.",
    },
    heroImage: "/content/materials/GFRP_Rebar_main.webp",
    cardImage: "/content/materials/nano_main.webp",
    sections: [
      {
        kicker: { ko: "(주)동신소재 · DongShin Materials", en: "DongShin Materials" },
        heading: { ko: "GFRP 보강근 (유리섬유강화플라스틱)", en: "GFRP rebar (glass-fiber reinforced plastic)" },
        blocks: [
          {
            kind: "feature",
            title: { ko: "녹부식 없이 강하고 가벼운 건축·토목 구조용 철근 대체제", en: "A rust-free, strong, lightweight rebar replacement for construction & civil works" },
            body: {
              ko: "원재료는 부식저항성이 강한 유리섬유 75~80%(E-CR 글라스)와 내구성 높은 열경화성 수지 20~25%(비닐 에스터 또는 에폭시)로 구성됩니다.",
              en: "Made of 75–80% corrosion-resistant glass fiber (E-CR glass) and 20–25% durable thermoset resin (vinyl ester or epoxy).",
            },
            images: [
              b("/content/materials/GFRP_Rebar_main.webp", { ko: "규사 코팅 GFRP 보강근", en: "Silica-coated GFRP rebar" }),
            ],
            imageLayout: "single",
          },
          {
            kind: "bullets",
            title: { ko: "특장점", en: "Advantages" },
            items: [
              { ko: "녹·부식 ZERO / 전도성 ZERO / 열전도 낮음", en: "Zero rust / zero conductivity / low thermal transfer" },
              { ko: "인장강도 철근 대비 2~3배 (400–600 vs 800–1,200MPa)", en: "2–3× the tensile strength of steel (400–600 vs 800–1,200 MPa)" },
              { ko: "무게 철근 대비 ¼ — 시공속도 향상, 물류·인건·중장비 비용 절감", en: "¼ the weight of steel — faster install, lower logistics/labor/equipment cost" },
              { ko: "탄소배출 65~75% 저감 — 한국도로공사·국가철도공단·한국전력공사·군청 적용 확대 중", en: "65–75% lower carbon — adoption expanding across KEC, KR, KEPCO and municipalities" },
              { ko: "철근보다 낮은 판매가격 (안정적인 원재료 기반)", en: "Priced below steel rebar, on a stable raw-material base" },
            ],
          },
          {
            kind: "bullets",
            title: { ko: "시장 & 경쟁력", en: "Market & competitiveness" },
            items: [
              { ko: "국내시장 5.4조원 중 1% 미만 대체 중 — 5년 이내 10% 대체 예상", en: "Under 1% of Korea's ₩5.4T rebar market today — ~10% expected within 5 years" },
              { ko: "해외시장 북미 교량 500개 이상 적용 완료, 아람코 선두로 중동 확대 중", en: "500+ North American bridges completed; expanding in the Middle East led by Aramco" },
              { ko: "국내 30여 개 제조사 중 국가기준 만족 4개 — 당사 품질·가격경쟁력 TOP", en: "Only 4 of ~30 Korean makers meet national standards — we lead on quality and price" },
            ],
          },
          {
            kind: "gallery",
            title: { ko: "적용분야", en: "Applications" },
            columns: 4,
            images: [
              b("/content/materials/GFRP_application1.webp", { ko: "공장·물류·데이터 센터", en: "Factory / logistics / data center" }),
              b("/content/materials/GFRP_application2.webp", { ko: "송전 철탑기초", en: "Transmission-tower foundation" }),
              b("/content/materials/GFRP_application3.webp", { ko: "단독주택·모듈러 하우스", en: "Housing / modular" }),
              b("/content/materials/GFRP_application4.webp", { ko: "항구·해양구조물", en: "Port / marine structure" }),
              b("/content/materials/GFRP_application5.webp", { ko: "고가·교량·방호벽", en: "Overpass / bridge / barrier" }),
              b("/content/materials/GFRP_application6.webp", { ko: "옹벽·콘크리트 궤도", en: "Retaining wall / concrete track" }),
              b("/content/materials/GFRP_application7.webp", { ko: "고층 빌딩기초", en: "High-rise foundation" }),
              b("/content/materials/GFRP_application8.webp", { ko: "댐 건설·유지보수", en: "Dam construction / repair" }),
              b("/content/materials/GFRP_application9.webp", { ko: "도로·고속도로", en: "Road / highway" }),
              b("/content/materials/GFRP_application10.webp", { ko: "프리캐스트 (PC)", en: "Precast (PC)" }),
              b("/content/materials/GFRP_application11.webp", { ko: "원형 구조물", en: "Circular structure" }),
              b("/content/materials/GFRP_application12.webp", { ko: "해상풍력·태양광 기초", en: "Offshore wind / solar foundation" }),
            ],
          },
        ],
      },
      {
        kicker: { ko: "(주)동신소재 · DongShin Materials", en: "DongShin Materials" },
        heading: { ko: "경량골재", en: "Lightweight aggregate" },
        blocks: [
          {
            kind: "feature",
            title: { ko: "레드머드(RED MUD) 기반 고강도 경량골재", en: "High-strength lightweight aggregate from red mud" },
            body: {
              ko: "정부·공공기관 탄소중립 실천과제로 고강도·경량 자재가 필수이나, 현재 국내에서 사용되는 경량골재의 100%는 수입에 의존하고 있습니다. 레드머드(RED MUD)와 특수 혼화재를 결합해 수입산 대비 공사비를 절감합니다.",
              en: "Carbon-neutrality mandates demand high-strength lightweight materials, yet 100% of Korea's lightweight aggregate is imported. Combining red mud with a special admixture cuts construction cost versus imports.",
            },
            images: [
              b("/content/materials/lightweight_aggregate_main.webp"),
              b("/content/materials/lightweight_aggregate_application.webp"),
            ],
            imageLayout: "row",
          },
          {
            kind: "specTable",
            title: { ko: "제품 특성", en: "Product properties" },
            headers: [
              { ko: "항목", en: "Item" },
              { ko: "시험기준", en: "KS standard" },
              { ko: "당사제품", en: "Ours" },
              { ko: "비고", en: "Note" },
            ],
            rows: [
              [{ ko: "비중", en: "Specific gravity" }, { ko: "1" }, { ko: "0.4 ~ 0.6" }, { ko: "물에 뜰 정도의 경량", en: "Light enough to float" }],
              [{ ko: "강도", en: "Strength" }, { ko: "98–245 kg/cm²" }, { ko: "258 ~ 303 /cm²" }, { ko: "KS 시험기준 상회", en: "Exceeds KS" }],
              [{ ko: "방음", en: "Sound reduction" }, { ko: "30db 감소", en: "−30 dB" }, { ko: "43db 감소", en: "−43 dB" }, { ko: "KS 시험기준 상회", en: "Exceeds KS" }],
              [{ ko: "단열", en: "Insulation" }, { ko: "100" }, { ko: "480" }, { ko: "KS 대비 4배 높음", en: "4× the KS baseline" }],
            ],
          },
          {
            kind: "bullets",
            title: { ko: "특장점", en: "Advantages" },
            items: [
              { ko: "단열·방음·친환경·흡수·불변·내구성·경량·고강도·재활용·내화·공간증대·비용절감", en: "Insulation, soundproofing, eco-friendly, absorbent, stable, durable, light, strong, recyclable, fire-resistant, space-gaining, cost-saving" },
              { ko: "벽돌 1,200°C 30분 가열 시 표면 3mm만 열전도 (일반 벽돌은 5분 내 전이)", en: "At 1,200°C for 30 min only 3 mm conducts heat (ordinary brick ignites within 5 min)" },
              { ko: "RED MUD 라돈 테스트 32.1Bq — 기준치 148Bq보다 낮아 안전성 입증", en: "Red-mud radon test at 32.1 Bq, well below the 148 Bq limit" },
            ],
          },
        ],
      },
      {
        kicker: { ko: "(주)동신소재 · DongShin Materials", en: "DongShin Materials" },
        heading: { ko: "보유 기술 — 나노 소재 합성", en: "Core technology — nano synthesis" },
        blocks: [
          {
            kind: "feature",
            title: { ko: "나노 소재 합성 기술", en: "Nano-material synthesis" },
            body: {
              ko: "일반 물질·고분자에 나노 물질을 합성해 기능이 향상되고, 소형화되며, 수명이 연장된 고부가가치 산업 제품을 만듭니다. 확장성 있는 독자기술로 화학약품 없는 친환경 방식이며 100% 자체 연구개발입니다.",
              en: "Synthesizing nano materials into base substances and polymers yields higher-function, smaller, longer-life, high-value industrial products — a scalable, chemical-free, fully in-house technology.",
            },
            images: [
              b("/content/materials/nano_main.webp"),
              b("/content/materials/nano_material_producct.webp"),
            ],
            imageLayout: "row",
          },
          {
            kind: "bullets",
            title: { ko: "기술 사양", en: "Technical spec" },
            items: [
              { ko: "입자크기: 최소 1~10nm, 그 이상 자유 선택 — 균일성·분포도·분산성 조절 가능", en: "Particle size 1–10 nm and up — controllable uniformity, distribution and dispersion" },
              { ko: "순도: ~99.99% 고순도", en: "Purity up to ~99.99%" },
              { ko: "생산성: 시간당 최소 2kg, 최대 100kg (나노 입자 + 담채)", en: "Throughput 2–100 kg/hr (nanoparticle + carrier)" },
              { ko: "당사 합성 공법: 저가·친환경·단순공정·결정면 조절 가능·균일성·생산성·혼합제조 가능", en: "Our process: low-cost, eco-friendly, simple, crystal-face-controllable, uniform, productive, mixable" },
            ],
          },
          {
            kind: "gallery",
            title: { ko: "상용 및 개발 제품", en: "Commercial & development products" },
            columns: 4,
            images: [
              b("/content/materials/nano_application1.webp", { ko: "2차 전지 · 촉매 · 도료", en: "Batteries · catalysts · coatings" }),
              b("/content/materials/nano_application2.webp", { ko: "화장품 · 전자파 차폐 · 방열", en: "Cosmetics · EMI shielding · heat dissipation" }),
            ],
          },
        ],
      },
      {
        kicker: { ko: "(주)이에프하이드로 · EF Hydro", en: "EF Hydro" },
        heading: { ko: "리튬이온 배터리용 소화약제 — EF-LBF20", en: "Lithium-ion battery fire suppressant — EF-LBF20" },
        blocks: [
          {
            kind: "feature",
            title: { ko: "열 폭주 초기 화재까지 대응하는 배터리 전용 소화약제", en: "A battery-specific agent that stops even thermal-runaway ignition" },
            body: {
              ko: "리튬이온 배터리 화재는 주변 구성품·전해액·전기 파트가 모두 타기 때문에 A·B·C·D형 화재 특성을 모두 가지지만, 열 폭주 초기 화재에 대응 가능한 시중 소화 약제는 없었습니다. EF-LBF20은 질식+냉각+탈취 효과로 약제가 화재 근원 표면에 유리처럼 용해되어 화재물을 덮고 산소를 차단하며, 높은 비열로 열에너지를 흡수해 재발화를 방지합니다.",
              en: "Li-ion fires carry Class A/B/C/D characteristics at once, yet no market agent could handle thermal-runaway ignition. EF-LBF20 smothers, cools and deodorizes — melting glass-like over the fuel source to cut oxygen, and absorbing heat via high specific heat to prevent re-ignition.",
            },
            images: [
              b("/content/efhydro/lithium-ion-battery-fire-extinguisher_main.webp"),
              b("/content/efhydro/thermal_runway.webp", { ko: "리튬이온 배터리의 열폭주", en: "Li-ion thermal runaway" }),
            ],
            imageLayout: "row",
          },
          {
            kind: "bullets",
            title: { ko: "전 화재등급 대응 (A · B · C · D)", en: "Covers all fire classes (A · B · C · D)" },
            items: [
              { ko: "A 일반화재 — 나무·천·종이", en: "A — ordinary combustibles (wood, cloth, paper)" },
              { ko: "B 유류화재 — 기름·페인트 등 가연성 물질", en: "B — flammable liquids (oil, paint)" },
              { ko: "C 전기화재 — 전기 제품", en: "C — electrical fires" },
              { ko: "D 금속화재 — 금속", en: "D — metal fires" },
            ],
          },
          {
            kind: "feature",
            badge: { ko: "네덜란드 기준 NTA 8133 통과", en: "Passed NTA 8133 (Netherlands)" },
            title: { ko: "소화 반복 성공 — 1~3분 내 소화 후 재발화 없음", en: "Repeatable extinguishing — out in 1–3 min, no re-ignition" },
            body: {
              ko: "네덜란드 기준(NTA 8133)에 따른 반복 시험에서 1~3분 내 소화에 성공하고 재발화가 발생하지 않음을 입증했습니다.",
              en: "Repeated testing to NTA 8133 confirmed extinguishing within 1–3 minutes with no subsequent re-ignition.",
            },
            images: [
              b("/content/efhydro/test1-1.webp"),
              b("/content/efhydro/test1-3.webp"),
              b("/content/efhydro/test2-2.webp"),
              b("/content/efhydro/test2_analysis.webp", { ko: "배터리 셀 온도 분석", en: "Battery cell temperature analysis" }),
            ],
            imageLayout: "grid",
            reverse: true,
          },
          {
            kind: "gallery",
            title: { ko: "적용분야", en: "Applications" },
            columns: 2,
            images: [
              b("/content/efhydro/fire_extinguishing_applications.webp", {
                ko: "데이터센터·ESS · 전기차·충전소 · 재생에너지 발전소 · 배터리 제조시설",
                en: "Data centers/ESS · EV & charging · renewable plants · battery factories",
              }),
              b("/content/efhydro/ABCD_fire_extinguisher.webp", { ko: "ABCD 겸용 소화기", en: "ABCD-class extinguisher" }),
            ],
          },
        ],
      },
    ],
  },
];

export function getBusinessArea(slug: string): BusinessAreaContent | undefined {
  return BUSINESS_AREAS.find((a) => a.slug === slug);
}
