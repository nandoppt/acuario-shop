import Link from "next/link";
import {
  ArrowRight,
  Package,
} from "lucide-react";

import type { CatalogProduct } from "@/types/catalog";

type ProductCardProps = {
  product: CatalogProduct;
};

export function ProductCard({
  product,
}: ProductCardProps) {
  const hasDiscount =
    product.compare_at_price !== null &&
    product.compare_at_price > product.price;

  const stock =
    product.inventory?.quantity ?? 0;

  const primaryImage =
    product.images
      ?.filter((image) => image.is_primary)
      .sort(
        (a, b) => a.sort_order - b.sort_order,
      )[0] ??
    product.images
      ?.slice()
      .sort(
        (a, b) => a.sort_order - b.sort_order,
      )[0];

  return (
<article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-card shadow-[0_1px_2px_rgb(20_35_28/4%)] transition duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5">      <Link href={`/producto/${product.slug}`}>
        <div className="relative aspect-[5/4] overflow-hidden bg-muted/70">
          {primaryImage ? (
            <img
              src={primaryImage.url}
              alt={
                primaryImage.alt_text ??
                product.name
              }
              className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.035]"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
              <Package
                size={36}
                strokeWidth={1.2}
                className="text-primary/50"
              />

              <span className="mt-2 text-xs">
                Imagen próximamente
              </span>
            </div>
          )}

          {product.is_featured && (
            <span className="absolute left-3 top-3 rounded-full bg-primary/95 px-2.5 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm">
              Destacado
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3.5 sm:p-4">
        <p className="text-[11px] font-medium uppercase tracking-[0.13em] text-primary">
          {product.categories?.name ??
            "Sin categoría"}
        </p>

        <Link href={`/producto/${product.slug}`}>
          <h2 className="mt-1.5 line-clamp-2 min-h-10 text-[15px] font-semibold leading-5 tracking-tight transition-colors hover:text-primary">
            {product.name}
          </h2>
        </Link>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div>
            {hasDiscount && (
              <p className="text-xs text-muted-foreground line-through">
                $
                {product.compare_at_price?.toFixed(
                  2,
                )}
              </p>
            )}

            <p className="text-lg font-semibold leading-5 tracking-tight text-foreground">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <Link
            href={`/producto/${product.slug}`}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            Ver producto
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="mt-3 border-t border-border/70 pt-2.5 text-[11px] text-muted-foreground">
          {stock > 0
            ? `${stock} disponibles`
            : "Agotado"}
        </div>
      </div>
    </article>
  );
}