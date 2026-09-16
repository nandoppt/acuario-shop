"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

type Order = {
  id: string;
  order_number: number;
  status: string;
  subtotal: number;
  shipping_cost: number;
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
              className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-muted/40 sm:p-6"
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
                <span className="inline-flex rounded-full border border-border px-3 py-1 text-xs font-medium capitalize">
                  {order.status}
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

                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Envío
                    </span>

                    <span>
                      {formatCurrency(
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