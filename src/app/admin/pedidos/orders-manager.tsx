"use client";
import Link from "next/link";

import {
  CheckCircle2,
  Clock3,
  CreditCard,
  Package,
  User,
} from "lucide-react";

type Order = {
  id: string;
  order_number: number;
  status: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  notes: string | null;
  created_at: string;

  customers: {
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
  } | null;

  addresses: {
    province: string;
    city: string;
    address: string;
    reference: string | null;
  } | null;

  order_items: {
    id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
  }[];

  payments: {
    id: string;
    payment_method: string;
    payment_status: string;
    amount: number;
    transaction_reference: string | null;
    created_at: string;
  } | null;
};

type Props = {
  orders: Order[];
};

function formatCurrency(
  value: number,
) {
  return `$${Number(value).toFixed(2)}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  const formatter = new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone: "America/Guayaquil",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    },
  );

  const parts = formatter.formatToParts(date);

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("day")}-${get("month")}-${get("year")} ${get("hour")}:${get("minute")}`;
}

function getOrderStatusLabel(
  status: string,
) {
  const labels: Record<
    string,
    string
  > = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    preparing: "Preparando",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };

  return labels[status] ?? status;
}

function getPaymentStatusLabel(
  status: string,
) {
  const labels: Record<
    string,
    string
  > = {
    pending: "Pendiente",
    waiting_verification:
      "Por verificar",
    paid: "Pagado",
    rejected: "Rechazado",
    refunded: "Reembolsado",
  };

  return labels[status] ?? status;
}

function getPaymentMethodLabel(
  method: string,
) {
  const labels: Record<
    string,
    string
  > = {
    transferencia:
      "Transferencia / QR",
    efectivo: "Efectivo",
    payphone: "PayPhone",
  };

  return labels[method] ?? method;
}

function orderStatusClass(
  status: string,
) {
  if (status === "confirmed") {
    return "bg-primary/10 text-primary";
  }

  if (status === "cancelled") {
    return "bg-destructive/10 text-destructive";
  }

  return "bg-secondary text-foreground";
}

function paymentStatusClass(
  status: string,
) {
  if (status === "paid") {
    return "bg-primary/10 text-primary";
  }

  if (
    status ===
    "waiting_verification"
  ) {
    return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
  }

  if (status === "rejected") {
    return "bg-destructive/10 text-destructive";
  }

  return "bg-secondary text-foreground";
}

export function OrdersManager({
  orders,
}: Props) {
  const pendingOrders =
    orders.filter(
      (order) =>
        order.status === "pending",
    ).length;

  const paidOrders =
    orders.filter(
      (order) =>
        order.payments
          ?.payment_status === "paid",
    ).length;

  const totalOrders =
    orders.length;

  return (
    <div className="space-y-6">

      {/* Estadísticas */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Pendientes
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {pendingOrders}
              </p>
            </div>

            <Clock3
              className="text-primary"
              size={24}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Pagados
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {paidOrders}
              </p>
            </div>

            <CheckCircle2
              className="text-primary"
              size={24}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total pedidos
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {totalOrders}
              </p>
            </div>

            <Package
              className="text-primary"
              size={24}
            />
          </div>
        </div>
      </div>

      {/* Pedidos */}

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Package
            className="mx-auto text-primary"
            size={40}
          />

          <h2 className="mt-4 text-xl font-semibold">
            No hay pedidos
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Los pedidos realizados desde la
            tienda aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const customer =
              order.customers;

            const payment =
              order.payments;

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-border bg-card p-6"
              >

                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                  {/* Información */}

                  <div className="min-w-0">

                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold">
                        Pedido #
                        {String(
                          order.order_number,
                        ).padStart(4, "0")}
                      </h2>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${orderStatusClass(
                          order.status,
                        )}`}
                      >
                        {getOrderStatusLabel(
                          order.status,
                        )}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(
                        order.created_at,
                      )}
                    </p>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">

                      {/* Cliente */}

                      <div className="flex gap-3">
                        <User
                          size={18}
                          className="mt-0.5 shrink-0 text-primary"
                        />

                        <div>
                          <p className="text-sm font-medium">
                            {customer
                              ? `${customer.first_name} ${customer.last_name}`
                              : "Cliente"}
                          </p>

                          {customer?.email && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {customer.email}
                            </p>
                          )}

                          {customer?.phone && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              {customer.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Pago */}

                      <div className="flex gap-3">
                        <CreditCard
                          size={18}
                          className="mt-0.5 shrink-0 text-primary"
                        />

                        <div>
                          <p className="text-sm font-medium">
                            {payment
                              ? getPaymentMethodLabel(
                                  payment.payment_method,
                                )
                              : "Sin pago"}
                          </p>

                          {payment && (
                            <span
                              className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${paymentStatusClass(
                                payment.payment_status,
                              )}`}
                            >
                              {getPaymentStatusLabel(
                                payment.payment_status,
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total */}

                  <div className="shrink-0 lg:text-right">
                    <p className="text-sm text-muted-foreground">
                      Total
                    </p>

                    <p className="mt-1 text-3xl font-semibold">
                      {formatCurrency(
                        order.total,
                      )}
                    </p>
                  </div>
                </div>

                {/* Productos */}

                <div className="mt-6 border-t border-border pt-5">
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                    Productos
                  </p>

                  <div className="space-y-2">
                    {order.order_items.map(
                      (item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 rounded-xl bg-muted/30 px-4 py-3 text-sm"
                        >
                          <div>
                            <span className="font-medium">
                              {item.product_name}
                            </span>

                            <span className="ml-2 text-muted-foreground">
                              × {item.quantity}
                            </span>
                          </div>

                          <span className="font-medium">
                            {formatCurrency(
                              item.subtotal,
                            )}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
                <div className="mt-5 flex justify-end border-t border-border pt-5">
                <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="inline-flex items-center rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition hover:bg-muted"
                >
                    Ver pedido
                </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}