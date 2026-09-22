"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useCart } from "@/components/cart/cart-context";
import type { ShippingCalculation } from "@/lib/shipping/calculate-shipping";

type CartSummaryProps = {
  checkout?: boolean;
  shipping?: ShippingCalculation | null;
};

export function CartSummary({
  checkout = false,
  shipping = null,
}: CartSummaryProps) {
  const { subtotal, itemCount } = useCart();

  const shippingCost =
    shipping?.cost ?? null;

  const total =
    shippingCost !== null
      ? subtotal + shippingCost
      : null;

  return (
    <aside className="rounded-2xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold">
        Resumen del pedido
      </h2>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Productos
          </span>

          <span className="font-medium">
            {itemCount}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">
            Subtotal
          </span>

          <span>
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {checkout && (
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Costo de envío
            </span>

            <span className="font-medium">
              {shipping?.status === "free"
                ? "Gratis"
                : shippingCost !== null
                  ? `$${shippingCost.toFixed(2)}`
                  : "Por confirmar"}
            </span>
          </div>
        )}

        {checkout && shipping?.status === "free" && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-5 text-emerald-800">
            Envío gratis en compras de $
            {shipping.free_shipping_minimum.toFixed(2)} o más.
            Aplican restricciones según zona de entrega.
          </div>
        )}
      </div>

      <div className="my-6 h-px bg-border" />

      <div className="flex items-center justify-between">
        <span className="font-medium">
          Total
        </span>

        <span className="text-2xl font-semibold tracking-tight">
          {!checkout
            ? `$${subtotal.toFixed(2)}`
            : total !== null
              ? `$${total.toFixed(2)}`
              : "Por confirmar"}
        </span>
      </div>

      {checkout && shipping?.status === "confirm" && (
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          El costo de envío será confirmado antes de
          finalizar la entrega.
        </p>
      )}

      {!checkout && (
        <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
          Los costos de envío se calcularán durante el
          proceso de compra.
        </p>
      )}

      <Link
        href={checkout ? "/tienda" : "/checkout"}
        className={
          checkout
            ? "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3.5 font-medium text-foreground transition hover:bg-muted"
            : "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
        }
      >
        <ArrowLeft size={17} />

        {checkout
          ? "Continuar comprando"
          : "Continuar compra"}
      </Link>
    </aside>
  );
}