/**
 * One-time importer for the legacy static site's two structured JSON files
 * (data/custom_cases.json, data/customer_logos.json) plus their referenced
 * images. Uploads images to Supabase Storage (resized into the same fixed
 * WebP variants the admin upload flow produces) and inserts case_studies /
 * client_logos rows. Client logos dedup per-row by name; case studies are
 * treated as a single batch (skipped entirely if the table is non-empty,
 * since several legitimate rows intentionally share a title).
 *
 * Run once after docs/sql/001_initial_schema.md has been applied:
 *   npm run db:migrate-legacy
 *
 * Reads from legacy-content/ (a copy of the old static site's assets/, data/,
 * and pdf_into_png/ folders, bundled into this project so migration doesn't
 * depend on the original hydrofast_website folder continuing to exist).
 * legacy-content/ is gitignored — it's a one-time-use local staging area;
 * once this script has been run successfully against the live DB, the images
 * live in Supabase Storage and this folder is no longer needed.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "node:fs";
import path from "node:path";
import { db } from "../src/db/client";
import { caseStudies, clientLogos } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { uploadImageVariants } from "../src/lib/image-upload";

const LEGACY_ROOT = path.resolve(__dirname, "../legacy-content");

interface LegacyCaseStudy {
  id: string;
  client: string;
  title: string;
  description: string;
  image: string;
  layout: string;
}

// data/custom_cases.json's `image` field (e.g. "custom_case_1766020000427.png")
// doesn't match the actual filenames in assets/custom_cases/ (e.g.
// "custom_case_특수선샤프트조립대차1(대우조선).png") — they were renamed on disk
// at some point after the JSON was last written. Mapped by hand from the
// legacy id (order-stable) to the correct file, verified 1:1 against the
// directory listing (17 JSON records, 17 files, same client/title grouping).
const CASE_STUDY_IMAGE_OVERRIDES: Record<string, string> = {
  new_1766020000427: "custom_case_특수선샤프트조립대차1(대우조선).png",
  new_1766020126763: "custom_case_특수선샤프트조립대차2(대우조선.png",
  new_1766020152083: "custom_case_목형자동클램프장치.png",
  new_1766020167199: "custom_case_프로펠러유압식설치장치(한화오션).png",
  new_1766020190383: "custom_case_인바프레임제어이동로봇_회전구동(한화오션).png",
  new_1766020227159: "custom_case_인바프레임제어이동로봇_상하구동(한화오션).png",
  new_1766020244491: "custom_case_선박 블록 조립용 스키딩 시스템(한화오션).png",
  new_1766020261143: "custom_case_다이아후램_커팅기1(한수원).png",
  new_1766020261683: "custom_case_다이아후램_커팅기2(한수원).png",
  new_1766020262171: "custom_case_파이프_세척장비1(한화오션).png",
  new_1766020291091: "custom_case_파이프_세척장비2(한화오션).png",
  new_1766020291559: "custom_case_탈선복구장비1(해군).png",
  new_1766020292079: "custom_case_탈선복구장비2(해군).png",
  new_1766020292539: "custom_case_스크류잭_조립해체_장치(한화오션).png",
  new_1766020365535: "custom_case_CGIS도킹시스템_로봇1(효성).png",
  new_1766020365991: "custom_case_CGIS도킹시스템_로봇2(효성).png",
  new_1766020366515: "custom_case_CGIS도킹시스템_로봇3(효성).png",
};

interface LegacyClientLogo {
  id: string;
  image: string;
}

// The legacy customer_logos.json has no display-name field — filled in by hand
// from the filenames (see docs/sql migration notes / plan §7).
const CLIENT_LOGO_NAMES: Record<string, string> = {
  "bucheoncity.png": "부천시",
  "daedong.jpg": "대동",
  "dongamarine.png": "동아마린",
  "donghaemachine.png": "동해기계",
  "doosan.png": "두산",
  "dsme.png": "DSME",
  "everdigm.png": "에버다임",
  "gscaltex.png": "GS칼텍스",
  "hanhwaocean.png": "한화오션",
  "hansungpc.png": "한성PC",
  "hdhyundai.png": "HD현대",
  "hdhyundaiheavy.png": "HD현대중공업",
  "hdhyundaiship.png": "HD현대조선",
  "hysg.png": "HYSG",
  "hyundai.png": "현대",
  "hyundaiinfracore.png": "현대인프라코어",
  "hyundaisamho.png": "현대삼호중공업",
  "incheoncity.png": "인천광역시",
  "inhauniv.png": "인하대학교",
  "kepco.png": "한국전력공사",
  "kimm.png": "한국기계연구원",
  "koreacentralpower.png": "한국중부발전",
  "koreaeastwestpower.jpg": "한국동서발전",
  "koreahydronuclear.png": "한국수력원자력",
  "koreaip.jpg": "특허청",
  "koreasouthpower.png": "한국남부발전",
  "koreawestpower.png": "한국서부발전",
  "kwanglim.png": "광림",
  "lsmtron.jpg": "LS엠트론",
  "ministryscict.png": "과학기술정보통신부",
  "ministrytie.png": "중소벤처기업부",
  "publicprocure.jpg": "조달청",
  "samsungheavy.png": "삼성중공업",
  "soosan.png": "수산중공업",
  "stxheavy.gif": "STX중공업",
  "tym.png": "TYM",
  "volvo.png": "볼보",
};

function readImageAsFile(filePath: string): File {
  const buffer = fs.readFileSync(filePath);
  return new File([buffer], path.basename(filePath));
}

async function migrateCaseStudies() {
  const jsonPath = path.join(LEGACY_ROOT, "data/custom_cases.json");
  const imagesDir = path.join(LEGACY_ROOT, "assets/custom_cases");
  const records: LegacyCaseStudy[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  // Several legitimate records intentionally share the same title (e.g. 3
  // separate CGIS robot photos) so dedup can't be keyed by title — instead
  // this whole migration is treated as a single batch: skip entirely if it
  // looks like it already ran, rather than risking partial duplicates.
  const alreadyMigrated = await db.select().from(caseStudies).limit(1);
  if (alreadyMigrated.length > 0) {
    console.log("  case_studies already has rows — skipping (delete them first to re-run this migration).");
    return;
  }

  console.log(`Migrating ${records.length} case studies...`);
  let sortOrder = 0;
  for (const record of records) {
    const filename = CASE_STUDY_IMAGE_OVERRIDES[record.id] ?? record.image;
    const imagePath = path.join(imagesDir, filename);
    let cardPath: string | null = null;
    if (fs.existsSync(imagePath)) {
      const uploaded = await uploadImageVariants("case-study-images", readImageAsFile(imagePath));
      cardPath = uploaded.cardPath;
    } else {
      console.warn(`  (missing image, skipping upload) ${filename}`);
    }

    await db.insert(caseStudies).values({
      clientName: record.client,
      titleKo: record.title,
      descriptionKo: record.description || null,
      imagePath: cardPath,
      aspectRatio: record.layout,
      isPublished: true,
      sortOrder: sortOrder++,
    });
  }
}

async function migrateClientLogos() {
  const jsonPath = path.join(LEGACY_ROOT, "data/customer_logos.json");
  const imagesDir = path.join(LEGACY_ROOT, "assets/partners");
  const records: LegacyClientLogo[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  console.log(`Migrating ${records.length} client logos...`);
  let sortOrder = 0;
  for (const record of records) {
    const name = CLIENT_LOGO_NAMES[record.image] ?? record.image.replace(/\.[a-z]+$/i, "");
    const existing = await db.select().from(clientLogos).where(eq(clientLogos.name, name));
    if (existing.length > 0) {
      sortOrder++;
      continue;
    }

    const imagePath = path.join(imagesDir, record.image);
    if (!fs.existsSync(imagePath)) {
      console.warn(`  (missing image, skipping) ${record.image}`);
      continue;
    }

    const { cardPath } = await uploadImageVariants("client-logos", readImageAsFile(imagePath));
    await db.insert(clientLogos).values({ name, logoPath: cardPath, isPublished: true, sortOrder: sortOrder++ });
  }
}

async function main() {
  if (!fs.existsSync(LEGACY_ROOT)) {
    console.error(`Legacy site not found at ${LEGACY_ROOT}. Edit LEGACY_ROOT in this script if it moved.`);
    process.exit(1);
  }
  await migrateCaseStudies();
  await migrateClientLogos();
  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
