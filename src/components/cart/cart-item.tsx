"use client";

import {
  Minus,
  Plus,
  Trash2,
} from "lucide-react";

import { useCart } from "@/components/cart/cart-context";
import type { CatalogProduct } from "@/types/catalog";

type CartItemProps = {
  product: CatalogProduct;
  quantity: number;
};

export function CartItem({
  product,
  quantity,
}: CartItemProps) {
  const {
    updateQuantity,
    removeItem,
  } = useCart();

  const itemTotal =
    product.price * quantity;

  return (
    <article className="flex gap-4 border-b border-border py-6">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-muted">
        <span className="text-xs text-muted-foreground">
          Sin imagen
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-primary">
          {product.categories?.name ??
            "Sin categoría"}
        </p>

        <h2 className="mt-1 font-semibold">
          {product.name}
        </h2>

        {product.brand && (
          <p className="mt-1 text-sm text-muted-foreground">
            {product.brand}
          </p>
        )}

        <p className="mt-2 font-medium">
          ${product.price.toFixed(2)}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button
          type="button"
          onClick={() =>
            removeItem(product.id)
          }
          aria-label={`Eliminar ${product.name}`}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
        >
          <Trash2 size={18} />
        </button>

        <div className="flex items-center rounded-lg border border-border">
          <button
            type="button"
            onClick={() =>
              updateQuantity(
                product.id,
                quantity - 1,
              )
            }
            className="p-2 transition-colors hover:bg-muted"
            aria-label="Disminuir cantidad"
          >
            <Minus size={15} />
          </button>

          <span className="min-w-8 text-center text-sm font-medium">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() =>
              updateQuantity(
                product.id,
                quantity + 1,
              )
            }
            className="p-2 transition-colors hover:bg-muted"
            aria-label="Aumentar cantidad"
          >
            <Plus size={15} />
          </button>
        </div>


        <p className="text-sm font-semibold">
          ${itemTotal.toFixed(2)}
        </p>
      </div>
    </article>
  );
}