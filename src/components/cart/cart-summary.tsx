"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useCart } from "@/components/cart/cart-context";

type CartSummaryProps = {
  checkout?: boolean;
};

export function CartSummary({
  checkout = false,
}: CartSummaryProps) {
  const { subtotal, itemCount } = useCart();

  return (
    <aside className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold">
        Resumen del pedido
      </h2>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Productos
          </span>

          <span>{itemCount}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Subtotal
          </span>

          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="my-6 h-px bg-border" />

      <div className="flex items-center justify-between">
        <span className="font-medium">
          Total
        </span>

        <span className="text-2xl font-semibold">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      <Link
        href={checkout ? "/tienda" : "/checkout"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
      >
        {checkout
          ? "Continuar comprando"
          : "Continuar compra"}

        <ArrowRight size={18} />
      </Link>

      <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
        Los costos de envío se calcularán durante el proceso de compra.
      </p>
    </aside>
  );
}