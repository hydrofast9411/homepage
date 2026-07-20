import "server-only";
import sharp from "sharp";
import { randomUUID } from "crypto";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { ImageBucket } from "@/lib/image-url";

export type { ImageBucket };
export { publicImageUrl } from "@/lib/image-url";

/**
 * Server-only. Resizes an uploaded image into fixed-width WebP variants and
 * stores them in Supabase Storage, returning the path of the primary ("card")
 * variant to save on the owning row. We resize at upload time rather than
 * relying on Vercel's on-demand image optimizer, to stay clear of the Hobby
 * plan's 1,000-images/month optimization cap as the catalog grows.
 */
export async function uploadImageVariants(
  bucket: ImageBucket,
  file: File
): Promise<{ thumbnailPath: string; cardPath: string; detailPath: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const id = randomUUID();

  const variants = [
    { name: "thumb", width: 400 },
    { name: "card", width: 800 },
    { name: "detail", width: 1600 },
  ] as const;

  const supabase = createServiceRoleClient();
  const paths: Record<string, string> = {};

  for (const variant of variants) {
    const resized = await sharp(buffer)
      .resize({ width: variant.width, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const path = `${id}/${variant.name}.webp`;
    const { error } = await supabase.storage.from(bucket).upload(path, resized, {
      contentType: "image/webp",
      upsert: false,
    });
    if (error) {
      throw new Error(`Failed to upload ${variant.name} variant to ${bucket}: ${error.message}`);
    }
    paths[variant.name] = path;
  }

  return {
    thumbnailPath: paths.thumb,
    cardPath: paths.card,
    detailPath: paths.detail,
  };
}

export async function deleteImageVariants(bucket: ImageBucket, cardPath: string) {
  const id = cardPath.split("/")[0];
  const supabase = createServiceRoleClient();
  await supabase.storage.from(bucket).remove([`${id}/thumb.webp`, `${id}/card.webp`, `${id}/detail.webp`]);
}
