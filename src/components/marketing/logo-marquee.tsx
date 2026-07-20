import { publicImageUrl, type ImageBucket } from "@/lib/image-url";

export function LogoMarquee({
  logos,
  bucket,
}: {
  logos: { id: string; name: string; logoPath: string }[];
  bucket: ImageBucket;
}) {
  if (logos.length === 0) return null;

  // Duplicate the list so the CSS marquee (translateX -50%) loops seamlessly.
  const doubled = [...logos, ...logos];

  return (
    <div className="overflow-hidden">
      <div className="marquee-track gap-16 py-4">
        {doubled.map((logo, i) => (
          <div key={`${logo.id}-${i}`} className="flex h-12 w-32 shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicImageUrl(bucket, logo.logoPath) ?? undefined}
              alt={logo.name}
              className="max-h-10 w-auto object-contain opacity-70 grayscale transition-opacity hover:opacity-100 hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
