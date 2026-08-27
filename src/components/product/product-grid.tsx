import type { CatalogProduct } from "@/types/catalog";
import { ProductCard } from "./product-card";

type ProductGridProps = {
  products: CatalogProduct[];
};

export function ProductGrid({
  products,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center">
        <p className="font-medium">
          No encontramos productos.
        </p>

        <p className="mt-2 text-sm text-muted-foreground">
          Prueba con otra categoría.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
}