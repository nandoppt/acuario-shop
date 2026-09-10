"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Clock3,
  Loader2,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react";

import {
  getOrderByTrackingToken,
  requestOrderVerificationCode,
  verifyOrderVerificationCode,
} from "../order-search-actions";

type SearchResult = Awaited<
  ReturnType<typeof getOrderByTrackingToken>
>;
type VerifiedOrder = NonNullable<
  Awaited<
    ReturnType<
      typeof verifyOrderVerificationCode
    >
  >["orders"]
>[number];

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
  const [searchMode, setSearchMode] = useState<
    "tracking" | "customer"
  >("tracking");

  const [trackingToken, setTrackingToken] =
    useState("");

  const [email, setEmail] = useState("");

const [verificationCode, setVerificationCode] =
  useState("");

const [codeSent, setCodeSent] =
  useState(false);

const [customerOrders, setCustomerOrders] =
  useState<VerifiedOrder[]>([]);

const [result, setResult] =
  useState<SearchResult | null>(null);

  const [selectedOrderId, setSelectedOrderId] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleTrackingSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setResult(null);
    setCustomerOrders([]);
    setSelectedOrderId(null);

    const token = trackingToken.trim();

    if (!token) {
      setError(
        "Ingresa tu código de seguimiento.",
      );
      return;
    }

    setLoading(true);

    const response =
      await getOrderByTrackingToken(token);

    setLoading(false);

    if (!response.success) {
      setError(
        response.error ??
          "No se pudo encontrar el pedido.",
      );
      return;
    }

    setResult(response);
  };

  const handleCustomerSubmit = async (
  event: FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  setError("");
  setResult(null);
  setCustomerOrders([]);
  setSelectedOrderId(null);

  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    setError(
      "Ingresa tu correo electrónico.",
    );
    return;
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalizedEmail,
    )
  ) {
    setError(
      "Ingresa un correo electrónico válido.",
    );
    return;
  }

  setLoading(true);

  const response =
    await requestOrderVerificationCode(
      normalizedEmail,
    );

  setLoading(false);

  if (!response.success) {
    setError(
      response.error ??
        "No se pudo enviar el código.",
    );
    return;
  }

  setCodeSent(true);
  setVerificationCode("");

  setError("");
};

const handleVerificationSubmit = async (
  event: FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  setError("");
  setResult(null);
  setCustomerOrders([]);
  setSelectedOrderId(null);

  const normalizedEmail = email.trim();
  const normalizedCode =
    verificationCode.replace(/\D/g, "");

  if (!normalizedEmail) {
    setError(
      "Ingresa tu correo electrónico.",
    );
    return;
  }

  if (!/^\d{6}$/.test(normalizedCode)) {
    setError(
      "Ingresa el código de 6 dígitos.",
    );
    return;
  }

  setLoading(true);

  const response =
    await verifyOrderVerificationCode(
      normalizedEmail,
      normalizedCode,
    );

  setLoading(false);

  if (!response.success) {
    setError(
      response.error ??
        "No se pudo verificar el código.",
    );
    return;
  }

  const orders = response.orders ?? [];

  setCustomerOrders(orders);

  if (orders.length === 1) {
    setSelectedOrderId(orders[0].id);
  }
};

  const selectedCustomerOrder =
  customerOrders.find(
    (customerOrder) =>
      customerOrder.id === selectedOrderId,
  ) ?? null;

  const order =
    result?.success
      ? result.order
      : selectedCustomerOrder;

  const customer = order
    ? getRelation(order.customers)
    : null;

  const address = order
    ? getRelation(order.addresses)
    : null;

  const payment = order
    ? getRelation(order.payments)
    : null;

  const currentStatus =
    order?.status ?? null;

  const currentStatusIndex =
    currentStatus
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
            Consulta el estado de tu pedido
            utilizando tu código de seguimiento o
            verificando tu correo electrónico.
          </p>
        </div>

        <div className="mt-10 rounded-xl border bg-card p-6 shadow-sm">
          <div className="grid grid-cols-2 rounded-lg border p-1">
            <button
              type="button"
              onClick={() => {
                setSearchMode("tracking");
                setError("");
                setResult(null);
                setCustomerOrders([]);
                setSelectedOrderId(null);
                setCodeSent(false);
                setVerificationCode("");
              }}
              className={[
                "rounded-md px-3 py-2 text-sm font-medium transition",
                searchMode === "tracking"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              Código de seguimiento
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchMode("customer");
                setError("");
                setResult(null);
                setCustomerOrders([]);
                setSelectedOrderId(null);
                setCodeSent(false);
                setVerificationCode("");
              }}
              className={[
                "rounded-md px-3 py-2 text-sm font-medium transition",
                searchMode === "customer"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              Consultar mis pedidos
            </button>
          </div>

          {searchMode === "tracking" ? (
            <form
              onSubmit={handleTrackingSubmit}
              className="mt-6 space-y-5"
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
                    setTrackingToken(
                      event.target.value,
                    )
                  }
                  placeholder="Ingresa tu código de seguimiento"
                  autoComplete="off"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
                />
              </div>

              <p className="text-sm text-muted-foreground">
                Puedes encontrar este código en
                la confirmación de tu pedido.
              </p>

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
          ) : !codeSent ? (
  <form
    onSubmit={handleCustomerSubmit}
    className="mt-6 space-y-5"
  >
    <div>
      <label
        htmlFor="tracking-email"
        className="mb-2 block text-sm font-medium"
      >
        Correo electrónico
      </label>

      <input
        id="tracking-email"
        type="email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        placeholder="cliente@email.com"
        autoComplete="email"
        className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
      />
    </div>

    <p className="text-sm text-muted-foreground">
      Te enviaremos un código de verificación
      a tu correo para consultar tus pedidos.
    </p>

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
          Enviando código...
        </>
      ) : (
        <>
          <Search className="h-4 w-4" />
          Enviar código
        </>
      )}
    </button>
  </form>
) : (
  <form
    onSubmit={handleVerificationSubmit}
    className="mt-6 space-y-5"
  >
    <div>
      <label
        htmlFor="tracking-verification-code"
        className="mb-2 block text-sm font-medium"
      >
        Código de verificación
      </label>

      <input
        id="tracking-verification-code"
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={verificationCode}
        onChange={(event) =>
          setVerificationCode(
            event.target.value
              .replace(/\D/g, "")
              .slice(0, 6),
          )
        }
        placeholder="123456"
        autoComplete="one-time-code"
        className="w-full rounded-md border bg-background px-3 py-2 text-center text-lg tracking-[0.35em] outline-none transition focus:ring-2 focus:ring-ring"
      />
    </div>

    <p className="text-sm text-muted-foreground">
      Hemos enviado un código de 6 dígitos a{" "}
      <span className="font-medium text-foreground">
        {email}
      </span>
      .
    </p>

    <p className="text-sm text-muted-foreground">
      El código es válido durante 10 minutos
      y solo puede utilizarse una vez.
    </p>

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
          Verificando...
        </>
      ) : (
        <>
          <Search className="h-4 w-4" />
          Ver mis pedidos
        </>
      )}
    </button>

    <button
      type="button"
      onClick={() => {
        setCodeSent(false);
        setVerificationCode("");
        setError("");
      }}
      className="w-full text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
    >
      Cambiar correo electrónico
    </button>
  </form>
)}
        </div>

        {customerOrders.length > 1 && (
            <div className="mt-8 rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">
                Pedidos encontrados
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Selecciona el pedido que deseas
                consultar.
              </p>

              <div className="mt-5 divide-y">
                {customerOrders.map(
                  (customerOrder) => (
                    <button
                      key={customerOrder.id}
                      type="button"
                      onClick={() =>
                        setSelectedOrderId(
                          customerOrder.id,
                        )
                      }
                      className={[
                        "flex w-full items-center justify-between gap-4 py-4 text-left transition",
                        selectedOrderId ===
                        customerOrder.id
                          ? "bg-muted/50"
                          : "hover:bg-muted/30",
                      ].join(" ")}
                    >
                      <div>
                        <p className="font-medium">
                          Pedido #
                          {String(
                            customerOrder.order_number,
                          ).padStart(4, "0")}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {formatDate(
                            customerOrder.created_at,
                          )}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">
                          {formatCurrency(
                            customerOrder.total,
                          )}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {statusLabels[
                            customerOrder.status
                          ] ??
                            customerOrder.status}
                        </p>
                      </div>
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

        {order && (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Pedido
                  </p>

                  <h2 className="text-2xl font-semibold">
                    #
                    {String(
                      order.order_number,
                    ).padStart(4, "0")}
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(
                      order.created_at,
                    )}
                  </p>
                </div>

                <div className="rounded-full border px-4 py-2 text-sm font-medium">
                  {statusLabels[
                    order.status
                  ] ?? order.status}
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
                      Este pedido ya no continuará
                      con el proceso de preparación
                      y entrega.
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
                  {timeline.map(
                    (step, index) => {
                      const stepIndex =
                        statusOrder.indexOf(
                          step.status,
                        );

                      const completed =
                        currentStatusIndex >=
                        stepIndex;

                      const current =
                        currentStatus ===
                        step.status;

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
                              timeline.length -
                                1 && (
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
                    },
                  )}
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
                {order.order_items.map(
                  (item) => (
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
                    {order.shipping_cost ===
                    0
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
                    <p>
                      {address.address}
                    </p>

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