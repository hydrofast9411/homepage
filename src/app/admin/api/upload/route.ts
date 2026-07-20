import { NextResponse } from "next/server";
import { uploadImageVariants } from "@/lib/images";

// Admin-only image upload used by the BlockEditor (business-area content blocks).
// Access is gated by the /admin middleware (src/proxy.ts → updateSession), which
// redirects unauthenticated requests to /admin/login before this handler runs.
// Uploads to the site-media bucket and returns the card-size variant path, which
// is what gets stored inside content_json image references.
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
  }

  try {
    const { cardPath } = await uploadImageVariants("site-media", file);
    return NextResponse.json({ path: cardPath });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
