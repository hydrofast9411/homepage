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
