"use client";

import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/cart-context";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function CartButton() {
  const { itemCount } = useCart();

  const [open, setOpen] = useState(false);
  const [countAnimating, setCountAnimating] =
    useState(false);

  useEffect(() => {
    if (itemCount === 0) {
      return;
    }

    setCountAnimating(true);

    const timeout = window.setTimeout(() => {
      setCountAnimating(false);
    }, 250);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [itemCount]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Carrito con ${itemCount} productos`}
        aria-expanded={open}
        className="relative inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-muted"
      >
        <ShoppingCart size={20} />

        {itemCount > 0 && (
          <span
            className={[
              "absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground",
              "transition-transform duration-200",
              countAnimating
                ? "scale-125"
                : "scale-100",
            ].join(" ")}
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>

      <CartDrawer
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}