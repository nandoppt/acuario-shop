import Link from "next/link";
import { ArrowLeft, Package, Truck } from "lucide-react";

import { getProductBySlug } from "@/lib/catalog/mock-products";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = getProductBySlug(slug);

  if (!product) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
        <div className="text-center">
          <Package className="mx-auto text-primary" size={48} />

          <h1 className="mt-5 text-3xl font-semibold">
            Producto no encontrado
          </h1>

          <p className="mt-3 text-muted-foreground">
            El producto que buscas no está disponible.
          </p>

          <Link
            href="/tienda"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground"
          >
            <ArrowLeft size={18} />
            Volver a la tienda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={16} />
          Volver a la tienda
        </Link>

        <div className="mt-10 grid gap-12 lg:grid-cols-2">
          {/* Imagen */}
          <div className="overflow-hidden rounded-3xl border border-border bg-muted">
            <div className="flex aspect-square flex-col items-center justify-center text-muted-foreground">
              <Package
                size={72}
                strokeWidth={1}
                className="text-primary/50"
              />

              <p className="mt-4 text-sm">
                Imagen próximamente
              </p>
            </div>
          </div>

          {/* Información */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              {product.category}
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              {product.name}
            </h1>

            {product.brand && (
              <p className="mt-3 text-sm text-muted-foreground">
                Marca: {product.brand}
              </p>
            )}

            <div className="mt-8">
              <p className="text-3xl font-semibold">
                ${product.price.toFixed(2)}
              </p>

              {product.previousPrice && (
                <p className="mt-1 text-sm text-muted-foreground line-through">
                  ${product.previousPrice.toFixed(2)}
                </p>
              )}
            </div>

            <div className="my-8 h-px bg-border" />

            <p className="text-base leading-8 text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                <Package
                  size={20}
                  className="text-primary"
                />

                <div>
                  <p className="text-sm font-medium">
                    Disponibilidad
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {product.stock > 0
                      ? `${product.stock} unidades disponibles`
                      : "Agotado"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-border p-4">
                <Truck
                  size={20}
                  className="text-primary"
                />

                <div>
                  <p className="text-sm font-medium">
                    Envíos en Ecuador
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Consulta disponibilidad y cobertura.
                  </p>
                </div>
              </div>
            </div>

            <AddToCartButton
              productId={product.id}
              disabled={product.stock === 0}
            />
          </div>
        </div>
      </section>
    </main>
  );
}