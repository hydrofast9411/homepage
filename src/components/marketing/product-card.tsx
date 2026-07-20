import { Link } from "@/i18n/navigation";
import { publicImageUrl } from "@/lib/image-url";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  manufacturerName: string | null;
  primaryImagePath: string | null;
  teaser: string | null;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)] transition-all hover:-translate-y-1 hover:border-[var(--color-steel-light)] hover:shadow-lg"
    >
      <div className="relative flex h-40 w-full items-center justify-center overflow-hidden bg-[var(--color-surface-alt)]">
        {product.primaryImagePath ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={publicImageUrl("product-images", product.primaryImagePath) ?? undefined}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-xs text-[var(--color-ink-soft)]">No Image</span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {product.manufacturerName && (
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--color-steel-light)]">
            {product.manufacturerName}
          </span>
        )}
        <h3 className="mt-1 text-sm font-bold leading-snug">{product.name}</h3>
        {product.teaser && <p className="mt-2 text-xs text-[var(--color-ink-soft)]">{product.teaser}</p>}
      </div>
    </Link>
  );
}
