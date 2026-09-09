"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  Loader2,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react";

import { getOrderByTrackingToken } from "../order-search-actions";

type SearchResult = Awaited<
  ReturnType<typeof getOrderByTrackingToken>
>;

const statusLabels: Record<string, string> = {
  pending: "Pedido recibido",
  confirmed: "Pedido confirmado",
  preparing: "Preparando pedido",
  shipped: "Pedido enviado",
  delivered: "Pedido entregado",
  cancelled: "Pedido cancelado",
};

const paymentLabels: Record<string, string> = {
  transferencia: "Transferencia bancaria",
  efectivo: "Efectivo",
  payphone: "PayPhone",
};

const paymentStatusLabels: Record<string, string> = {
  pending: "Pendiente",
  waiting_verification: "Esperando verificación",
  paid: "Pagado",
  rejected: "Rechazado",
  refunded: "Reembolsado",
};

const timeline = [
  {
    status: "pending",
    label: "Pedido recibido",
    description: "Hemos recibido tu pedido.",
  },
  {
    status: "confirmed",
    label: "Pedido confirmado",
    description: "El pedido ha sido confirmado.",
  },
  {
    status: "preparing",
    label: "Preparando",
    description: "Estamos preparando tus productos.",
  },
  {
    status: "shipped",
    label: "Enviado",
    description: "Tu pedido está en camino.",
  },
  {
    status: "delivered",
    label: "Entregado",
    description: "El pedido ha sido entregado.",
  },
];

const statusOrder = [
  "pending",
  "confirmed",
  "preparing",
  "shipped",
  "delivered",
];

function formatCurrency(value: number | null | undefined) {
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

export default function OrderTrackingPage() {
  const [trackingToken, setTrackingToken] = useState("");
  const [result, setResult] = useState<SearchResult | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setResult(null);

    const token = trackingToken.trim();

    if (!token) {
      setError("Ingresa tu código de seguimiento.");
      return;
    }

    setLoading(true);

    const response = await getOrderByTrackingToken(token);

    setLoading(false);

    if (!response.success) {
      setError(response.error ?? "No se pudo encontrar el pedido.");
      return;
    }

    setResult(response);
  };

  const order = result?.success ? result.order : null;

  const customer = order
    ? getRelation(order.customers)
    : null;

  const address = order
    ? getRelation(order.addresses)
    : null;

  const payment = order
    ? getRelation(order.payments)
    : null;

  const currentStatus = order?.status ?? null;

  const currentStatusIndex = currentStatus
    ? statusOrder.indexOf(currentStatus)
    : -1;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border bg-background">
            <Package className="h-6 w-6" />
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            Seguimiento de pedido
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Consulta el estado de tu pedido utilizando el código
            de seguimiento que recibiste al realizar tu compra.
          </p>
        </div>

        <div className="mt-10 rounded-xl border bg-card p-6 shadow-sm">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="tracking-token"
                className="mb-2 block text-sm font-medium"
              >
                Código de seguimiento
              </label>

              <input
                id="tracking-token"
                type="text"
                value={trackingToken}
                onChange={(event) =>
                  setTrackingToken(event.target.value)
                }
                placeholder="Ingresa tu código de seguimiento"
                autoComplete="off"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              />
            </div>

            {error && (
              <div
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Consultando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Consultar pedido
                </>
              )}
            </button>
          </form>
        </div>

        {order && (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pedido
                  </p>

                  <h2 className="text-2xl font-semibold">
                    #{String(order.order_number).padStart(4, "0")}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="rounded-full border px-4 py-2 text-sm font-medium">
                  {statusLabels[order.status] ??
                    order.status}
                </div>
              </div>
            </div>

            {order.status === "cancelled" ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                <div className="flex items-start gap-3">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />

                  <div>
                    <h3 className="font-semibold">
                      Pedido cancelado
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Este pedido ya no continuará con el proceso
                      de preparación y entrega.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold">
                  Estado del pedido
                </h3>

                <div className="mt-6 space-y-6">
                  {timeline.map((step, index) => {
                    const stepIndex = statusOrder.indexOf(
                      step.status,
                    );

                    const completed =
                      currentStatusIndex >= stepIndex;

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

                          {index < timeline.length - 1 && (
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
                              current
                                ? "text-foreground"
                                : completed
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

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5" />

                <h3 className="text-lg font-semibold">
                  Resumen del pedido
                </h3>
              </div>

              <div className="mt-5 divide-y">
                {order.order_items.map((item) => (
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
                        {formatCurrency(item.unit_price)}
                      </p>
                    </div>

                    <p className="font-medium">
                      {formatCurrency(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Subtotal
                  </span>

                  <span>
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Envío
                  </span>

                  <span>
                    {order.shipping_cost === 0
                      ? "Gratis"
                      : formatCurrency(order.shipping_cost)}
                  </span>
                </div>

                <div className="flex justify-between pt-2 text-base font-semibold">
                  <span>Total</span>

                  <span>
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {payment && (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-semibold">
                  Información de pago
                </h3>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      Método
                    </span>

                    <span className="text-right">
                      {paymentLabels[payment.payment_method] ??
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
                      ] ?? payment.payment_status}
                    </span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">
                      Monto
                    </span>

                    <span>
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {customer && address && (
              <div className="rounded-xl border bg-card p-6 shadow-sm">
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
                      {address.city}, {address.province}
                    </p>

                    {address.reference && (
                      <p className="mt-1 text-muted-foreground">
                        Referencia: {address.reference}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
        </div>
      </div>
    </main>
  );
}