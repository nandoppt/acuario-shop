"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { useCart } from "@/components/cart/cart-context";

export function CartButton() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/carrito"
      aria-label={`Carrito con ${itemCount} productos`}
      className="relative inline-flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-muted"
    >
      <ShoppingCart size={20} />

      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}