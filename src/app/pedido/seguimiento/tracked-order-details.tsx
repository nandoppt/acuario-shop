"use client";

import {
  Check,
  Clock3,
  Truck,
  XCircle,
} from "lucide-react";

type TrackedOrderDetailsProps = {
  order: any;
  statusLabels: Record<string, string>;
  paymentLabels: Record<string, string>;
  paymentStatusLabels: Record<string, string>;
  timeline: {
    status: string;
    label: string;
    description: string;
  }[];
  statusOrder: string[];
};

function formatCurrency(
  value: number | null | undefined,
) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(value ?? 0);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

function getRelation<T>(
  relation: T | T[] | null | undefined,
): T | null {
  if (!relation) {
    return null;
  }

  return Array.isArray(relation)
    ? relation[0] ?? null
    : relation;
}

export function TrackedOrderDetails({
  order,
  statusLabels,
  paymentLabels,
  paymentStatusLabels,
  timeline,
  statusOrder,
}: TrackedOrderDetailsProps) {
  const customer = getRelation(order.customers);
  const address = getRelation(order.addresses);
  const payment = getRelation(order.payments);

  const currentStatus = order.status ?? null;

  const currentStatusIndex = currentStatus
    ? statusOrder.indexOf(currentStatus)
    : -1;

  return (
    <div className="border-t border-border">
      <div className="space-y-6 p-5 md:p-6">
        {order.status === "cancelled" ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

              <div>
                <h3 className="font-semibold">
                  Pedido cancelado
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Este pedido ya no continuará
                  con el proceso de preparación
                  y entrega.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border bg-background p-5">
            <h3 className="text-lg font-semibold">
              Estado del pedido
            </h3>

            <div className="mt-6 space-y-6">
              {timeline.map((step, index) => {
                const stepIndex =
                  statusOrder.indexOf(
                    step.status,
                  );

                const completed =
                  currentStatusIndex >=
                  stepIndex;

                const current =
                  currentStatus === step.status;

                return (
                  <div
                    key={step.status}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={[
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                          completed
                            ? "bg-primary text-primary-foreground"
                            : "bg-background text-muted-foreground",
                        ].join(" ")}
                      >
                        {completed ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Clock3 className="h-4 w-4" />
                        )}
                      </div>

                      {index <
                        timeline.length - 1 && (
                        <div
                          className={[
                            "mt-2 h-8 w-px",
                            currentStatusIndex >
                            stepIndex
                              ? "bg-primary"
                              : "bg-border",
                          ].join(" ")}
                        />
                      )}
                    </div>

                    <div className="pb-2">
                      <p
                        className={[
                          "font-medium",
                          current ||
                          completed
                            ? "text-foreground"
                            : "text-muted-foreground",
                        ].join(" ")}
                      >
                        {step.label}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {step.description}
                      </p>

                      {current && (
                        <p className="mt-2 text-xs font-medium text-muted-foreground">
                          Estado actual
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Resumen */}

        <div className="rounded-xl border bg-background p-5">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5" />

            <h3 className="text-lg font-semibold">
              Resumen del pedido
            </h3>
          </div>

          <div className="mt-5 divide-y">
            {order.order_items.map(
              (item: any) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-medium">
                      {item.product_name}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.quantity} ×{" "}
                      {formatCurrency(
                        item.unit_price,
                      )}
                    </p>
                  </div>

                  <p className="font-medium">
                    {formatCurrency(
                      item.subtotal,
                    )}
                  </p>
                </div>
              ),
            )}
          </div>

          <div className="mt-4 space-y-2 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span>
                {formatCurrency(
                  order.subtotal,
                )}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Envío
              </span>

              <span>
                {order.shipping_cost === 0
                  ? "Gratis"
                  : formatCurrency(
                      order.shipping_cost,
                    )}
              </span>
            </div>

            <div className="flex justify-between pt-2 text-base font-semibold">
              <span>Total</span>

              <span>
                {formatCurrency(
                  order.total,
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Pago */}

        {payment && (
          <div className="rounded-xl border bg-background p-5">
            <h3 className="text-lg font-semibold">
              Información de pago
            </h3>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  Método
                </span>

                <span className="text-right">
                  {paymentLabels[
                    payment.payment_method
                  ] ??
                    payment.payment_method}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  Estado
                </span>

                <span className="text-right font-medium">
                  {paymentStatusLabels[
                    payment.payment_status
                  ] ??
                    payment.payment_status}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  Monto
                </span>

                <span>
                  {formatCurrency(
                    payment.amount,
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Entrega */}

        {customer && address && (
          <div className="rounded-xl border bg-background p-5">
            <h3 className="text-lg font-semibold">
              Datos de entrega
            </h3>

            <div className="mt-4 space-y-1 text-sm">
              <p className="font-medium">
                {customer.first_name}{" "}
                {customer.last_name}
              </p>

              <p className="text-muted-foreground">
                {customer.email}
              </p>

              {customer.phone && (
                <p className="text-muted-foreground">
                  {customer.phone}
                </p>
              )}

              <div className="pt-3">
                <p>{address.address}</p>

                <p className="text-muted-foreground">
                  {address.city},{" "}
                  {address.province}
                </p>

                {address.reference && (
                  <p className="mt-1 text-muted-foreground">
                    Referencia:{" "}
                    {address.reference}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}