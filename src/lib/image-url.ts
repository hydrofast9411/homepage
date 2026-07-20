// Client-safe. Deliberately kept separate from lib/images.ts (which pulls in
// sharp + the Supabase service-role client, both server-only) so admin form
// components can compute preview/display URLs without dragging server-only
// code into the client bundle.

export type ImageBucket =
  | "product-images"
  | "case-study-images"
  | "client-logos"
  | "partner-logos"
  | "site-media";

export function publicImageUrl(bucket: ImageBucket, path: string | null | undefined) {
  if (!path) return null;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

/**
 * Resolves an image reference stored in business-area content. A reference is
 * either an absolute public asset path ("/content/…", seeded from the brochure)
 * or an "http…" URL — used as-is — or a bare Supabase Storage path in the
 * site-media bucket (produced by admin uploads), resolved to a full public URL.
 */
export function contentImageUrl(src: string | null | undefined): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("/") || src.startsWith("http")) return src;
  return publicImageUrl("site-media", src) ?? undefined;
}
