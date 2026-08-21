import Link from "next/link";
import {
  ArrowRight,
  Package,
} from "lucide-react";

import type { Product } from "@/lib/catalog/mock-products";

const categoryNames: Record<Product["category"], string> = {
  plantas: "Plantas",
  iluminacion: "Iluminación",
  filtracion: "Filtración",
  sustratos: "Sustratos",
  co2: "CO₂",
  fertilizacion: "Fertilización",
  alimentacion: "Alimentación",
  accesorios: "Accesorios",
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount =
    product.previousPrice !== undefined &&
    product.previousPrice > product.price;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
      <Link href={`/producto/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
              <Package
                size={42}
                strokeWidth={1.2}
                className="text-primary/50"
              />

              <span className="mt-3 text-xs">
                Imagen próximamente
              </span>
            </div>
          )}

          {product.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Destacado
            </span>
          )}
        </div>
      </Link>

      <div className="p-5">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-primary">
          {categoryNames[product.category]}
        </p>

        <Link href={`/producto/${product.slug}`}>
          <h2 className="mt-2 text-lg font-semibold tracking-tight transition-colors hover:text-primary">
            {product.name}
          </h2>
        </Link>

        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            {hasDiscount && (
              <p className="text-sm text-muted-foreground line-through">
                ${product.previousPrice?.toFixed(2)}
              </p>
            )}

            <p className="text-xl font-semibold text-foreground">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <Link
            href={`/producto/${product.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-transform group-hover:translate-x-0.5"
          >
            Ver producto
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          {product.stock > 0
            ? `${product.stock} disponibles`
            : "Agotado"}
        </div>
      </div>
    </article>
  );
}