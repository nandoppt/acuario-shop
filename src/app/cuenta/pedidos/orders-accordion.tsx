"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import {
  getShippingCostLabel,
  getShippingMethodLabel,
} from "@/lib/shipping/shipping-method";
import { getOrderStatusMeta } from "@/lib/orders/order-status";

type Order = {
  id: string;
  order_number: number;
  status: string;
  subtotal: number;
  shipping_cost: number;
  shipping_method: string;
  total: number;
  created_at: string;
  order_items:
    | {
        id: string;
        product_name: string;
        unit_price: number;
        quantity: number;
        subtotal: number;
      }[]
    | null;
};

type OrdersAccordionProps = {
  orders: Order[];
};

function formatCurrency(value: number) {
  return `$${value.toFixed(2)}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-EC", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function OrdersAccordion({
  orders,
}: OrdersAccordionProps) {
  const [openOrderId, setOpenOrderId] = useState<string | null>(
    orders.length === 1 ? orders[0].id : null,
  );

  return (
    <div className="mt-10 space-y-3">
      {orders.map((order) => {
        const isOpen = openOrderId === order.id;
        const statusMeta = getOrderStatusMeta(order.status);

        return (
          <article
            key={order.id}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              onClick={() =>
                setOpenOrderId(isOpen ? null : order.id)
              }
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-muted/40 active:bg-muted/60 sm:p-6"
              aria-expanded={isOpen}
            >
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">
                  Pedido #{order.order_number}
                </p>

                <p className="mt-1 text-sm">
                  {formatDate(order.created_at)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${statusMeta.badgeClass}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusMeta.dotClass} ${order.status === "pending" ? "motion-safe:animate-pulse motion-reduce:animate-none" : ""}`}
                  />
                  {statusMeta.label}
                </span>

                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-border px-5 pb-5 sm:px-6 sm:pb-6">
                <div className="divide-y">
                  {order.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">
                          {item.product_name}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.quantity} ×{" "}
                          {formatCurrency(
                            Number(item.unit_price),
                          )}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-medium">
                        {formatCurrency(
                          Number(item.subtotal),
                        )}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t border-border pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal
                    </span>

                    <span>
                      {formatCurrency(
                        Number(order.subtotal),
                      )}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Método de envío
                    </span>

                    <span className="text-right font-medium">
                      {getShippingMethodLabel(
                        order.shipping_method,
                      )}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Costo de envío
                    </span>

                    <span className="text-right">
                      {getShippingCostLabel(
                        order.shipping_method,
                        Number(order.shipping_cost),
                      )}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-lg font-semibold">
                      {formatCurrency(
                        Number(order.total),
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}