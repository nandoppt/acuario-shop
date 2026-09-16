"use client";

import Link from "next/link";
import {
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

import { useCart } from "@/components/cart/cart-context";
import type { CatalogProduct } from "@/types/catalog";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function getPrimaryImage(
  product: CatalogProduct,
) {
  return (
    product.images
      ?.filter((image) => image.is_primary)
      .sort(
        (a, b) => a.sort_order - b.sort_order,
      )[0] ??
    product.images
      ?.slice()
      .sort(
        (a, b) => a.sort_order - b.sort_order,
      )[0]
  );
}

export function CartDrawer({
  open,
  onClose,
}: CartDrawerProps) {
  const {
    items,
    products,
    itemCount,
    subtotal,
    updateQuantity,
    removeItem,
  } = useCart();

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      {/* Fondo */}

      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar carrito"
        className="absolute inset-0 h-full w-full bg-black/30 backdrop-blur-[2px]"
      />

      {/* Panel */}

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
      >
        {/* Encabezado */}

        <div className="flex items-center justify-between border-b border-border px-5 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              Tu compra
            </p>

            <h2 className="mt-1 text-xl font-semibold">
              Carrito
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="rounded-full p-2 transition-colors hover:bg-muted"
          >
            <X size={20} />
          </button>
        </div>

        {/* Contenido */}

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag
                size={28}
                className="text-primary"
                strokeWidth={1.5}
              />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Tu carrito está vacío
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
              Explora nuestros productos y
              agrega todo lo que necesites para
              tu acuario.
            </p>

            <Link
              href="/tienda"
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <>
            {/* Lista */}

            <div className="flex-1 overflow-y-auto px-5">
              <div className="divide-y divide-border">
                {items.map((item) => {
                  const product = products.find(
                    (currentProduct) =>
                      currentProduct.id ===
                      item.productId,
                  );

                  if (!product) {
                    return null;
                  }

                  const image =
                    getPrimaryImage(product);

                  const itemTotal =
                    product.price *
                    item.quantity;

                  const stock =
                    product.inventory
                      ?.quantity ?? 0;

                  return (
                    <article
                      key={item.productId}
                      className="flex gap-4 py-5"
                    >
                      {/* Imagen */}

                      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {image ? (
                          <img
                            src={image.url}
                            alt={
                              image.alt_text ??
                              product.name
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center px-2 text-center text-[11px] text-muted-foreground">
                            Imagen próximamente
                          </div>
                        )}
                      </div>

                      {/* Información */}

                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                          {product.categories
                            ?.name ??
                            "Producto"}
                        </p>

                        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          $
                          {product.price.toFixed(
                            2,
                          )}
                        </p>

                        {/* Cantidad */}

                        <div className="mt-3 flex items-center justify-between gap-3">
                          <div className="flex items-center rounded-lg border border-border">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  product.id,
                                  item.quantity -
                                    1,
                                )
                              }
                              className="p-1.5 transition-colors hover:bg-muted"
                              aria-label={`Disminuir cantidad de ${product.name}`}
                            >
                              <Minus size={14} />
                            </button>

                            <span className="min-w-8 text-center text-xs font-medium">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  product.id,
                                  item.quantity +
                                    1,
                                )
                              }
                              disabled={
                                item.quantity >=
                                stock
                              }
                              className="p-1.5 transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={`Aumentar cantidad de ${product.name}`}
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(
                                product.id,
                              )
                            }
                            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                            aria-label={`Eliminar ${product.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Total */}

                      <p className="shrink-0 self-end text-sm font-semibold">
                        $
                        {itemTotal.toFixed(2)}
                      </p>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Resumen */}

            <div className="border-t border-border bg-background px-5 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Productos
                </span>

                <span>{itemCount}</span>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="font-medium">
                  Subtotal
                </span>

                <span className="text-xl font-semibold">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Los costos de envío se calcularán
                durante el proceso de compra.
              </p>

              <Link
                href="/carrito"
                onClick={onClose}
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
              >
                Ir al carrito
              </Link>

              <Link
                href="/tienda"
                onClick={onClose}
                className="mt-2 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                Seguir comprando
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}