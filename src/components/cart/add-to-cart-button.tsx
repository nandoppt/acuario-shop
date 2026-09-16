"use client";

import Link from "next/link";
import {
  Check,
  ShoppingCart,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useCart } from "@/components/cart/cart-context";

type AddToCartButtonProps = {
  productId: string;
  productName?: string;
  disabled?: boolean;
};

export function AddToCartButton({
  productId,
  productName = "Producto",
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  const [added, setAdded] = useState(false);
  const [notificationVisible, setNotificationVisible] =
    useState(false);

  function handleAddToCart() {
    if (disabled) {
      return;
    }

    addItem(productId);

    setAdded(true);
    setNotificationVisible(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1800);

    window.setTimeout(() => {
      setNotificationVisible(false);
    }, 4000);
  }

  useEffect(() => {
    return () => {
      setNotificationVisible(false);
    };
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={disabled}
        className={[
          "inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-medium text-primary-foreground",
          "transition-all duration-300",
          "hover:-translate-y-0.5 hover:opacity-90",
          "active:scale-[0.98]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          added
            ? "bg-primary/90"
            : "bg-primary",
        ].join(" ")}
      >
        {added ? (
          <>
            <Check
              size={20}
              className="animate-in zoom-in duration-200"
            />

            Agregado al carrito
          </>
        ) : (
          <>
            <ShoppingCart size={20} />

            {disabled
              ? "Producto agotado"
              : "Agregar al carrito"}
          </>
        )}
      </button>

      {notificationVisible && (
        <div className="fixed bottom-5 right-5 z-[60] w-[calc(100%-2.5rem)] max-w-sm animate-in slide-in-from-right-5 fade-in duration-300">
          <div className="rounded-2xl border border-border bg-background p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Check size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  Producto agregado
                </p>

                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {productName}
                </p>

                <Link
                  href="/carrito"
                  className="mt-3 inline-flex text-sm font-medium text-primary transition-colors hover:underline"
                >
                  Ver carrito
                </Link>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNotificationVisible(false)
                }
                aria-label="Cerrar notificación"
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}