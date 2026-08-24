"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";

import { useCart } from "@/components/cart/cart-context";

type AddToCartButtonProps = {
  productId: string;
  disabled?: boolean;
};

export function AddToCartButton({
  productId,
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (disabled) {
      return;
    }

    addItem(productId);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {added ? (
        <>
          <Check size={20} />
          Agregado al carrito
        </>
      ) : (
        <>
          <ShoppingCart size={20} />
          {disabled ? "Producto agotado" : "Agregar al carrito"}
        </>
      )}
    </button>
  );
}