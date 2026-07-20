/**
 * One-time importer for the legacy static site's two structured JSON files
 * (data/custom_cases.json, data/customer_logos.json) plus their referenced
 * images. Uploads images to Supabase Storage (resized into the same fixed
 * WebP variants the admin upload flow produces) and inserts case_studies /
 * client_logos rows. Safe to re-run: skips rows that already exist by title
 * (case studies) or name (client logos).
 *
 * Run once after docs/sql/001_initial_schema.md has been applied:
 *   npm run db:migrate-legacy
 *
 * Assumes the legacy static site still lives at ../hydrofast_website
 * relative to this project (i.e. both folders are siblings under
 * 동신소재/). Adjust LEGACY_ROOT below if that's not the case.
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "node:fs";
import path from "node:path";
import { db } from "../src/db/client";
import { caseStudies, clientLogos } from "../src/db/schema";
import { eq } from "drizzle-orm";
import { uploadImageVariants } from "../src/lib/images";

const LEGACY_ROOT = path.resolve(__dirname, "../../hydrofast_website");

interface LegacyCaseStudy {
  id: string;
  client: string;
  title: string;
  description: string;
  image: string;
  layout: string;
}

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

  console.log(`Migrating ${records.length} case studies...`);
  let sortOrder = 0;
  for (const record of records) {
    const existing = await db.select().from(caseStudies).where(eq(caseStudies.titleKo, record.title));
    if (existing.length > 0) {
      sortOrder++;
      continue;
    }

    const imagePath = path.join(imagesDir, record.image);
    let cardPath: string | null = null;
    if (fs.existsSync(imagePath)) {
      const uploaded = await uploadImageVariants("case-study-images", readImageAsFile(imagePath));
      cardPath = uploaded.cardPath;
    } else {
      console.warn(`  (missing image, skipping upload) ${record.image}`);
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
