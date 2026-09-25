"use client";

import { TrackedOrderDetails } from "./tracked-order-details";
import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  Loader2,
  Package,
  Search,
} from "lucide-react";
import {
  getOrderByTrackingToken,
  requestOrderVerificationCode,
  verifyOrderVerificationCode,
} from "../order-search-actions";
import { getOrderStatusMeta } from "@/lib/orders/order-status";

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
    setTrackingToken("");
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

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card shadow-sm">
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

        <div className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="grid grid-cols-2 rounded-xl border border-border bg-muted/40 p-1">
            <button
              type="button"
              onClick={() => {
                setSearchMode("tracking");
                setTrackingToken("");
                setError("");
                setResult(null);
                setCustomerOrders([]);
                setSelectedOrderId(null);
                setCodeSent(false);
                setVerificationCode("");
              }}
              className={[
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
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
                setTrackingToken("");
                setError("");
                setResult(null);
                setCustomerOrders([]);
                setSelectedOrderId(null);
                setCodeSent(false);
                setVerificationCode("");
              }}
              className={[
                "rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
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
                  className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
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
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
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
        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
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
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
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
        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-center text-lg tracking-[0.35em] outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
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
      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
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

    <div className="flex flex-col gap-3 text-center sm:flex-row sm:justify-center sm:gap-6">
      <button
        type="button"
        disabled={loading}
        onClick={async () => {
          setError("");
          setVerificationCode("");
          setLoading(true);

          const response =
            await requestOrderVerificationCode(
              email.trim(),
            );

          setLoading(false);

          if (!response.success) {
            setError(
              response.error ??
                "No se pudo reenviar el código.",
            );
            return;
          }

          setError("");
        }}
        className="text-sm font-medium text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? "Enviando..." : "Reenviar código"}
      </button>

      <button
        type="button"
        onClick={() => {
          setCodeSent(false);
          setVerificationCode("");
          setError("");
        }}
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        Cambiar correo electrónico
      </button>
    </div>
  </form>
)}
        </div>

        {result?.success && result.order && (
          <div className="mt-8 rounded-2xl border border-border bg-card shadow-sm">
            <div className="border-b px-6 py-5">
              <h2 className="text-lg font-semibold">
                Pedido #{String(result.order.order_number).padStart(4, "0")}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Consulta la información y el estado de tu pedido.
              </p>
            </div>

            <TrackedOrderDetails
              order={result.order}
              statusLabels={statusLabels}
              paymentLabels={paymentLabels}
              paymentStatusLabels={paymentStatusLabels}
              timeline={timeline}
              statusOrder={statusOrder}
            />

            <div className="border-t px-6 py-4">
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setTrackingToken("");
                  setError("");
                }}
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Consultar otro pedido
              </button>
            </div>
          </div>
        )}

        {customerOrders.length > 1 && (
            <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">
                Pedidos encontrados
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Selecciona el pedido que deseas
                consultar.
              </p>

              <div className="mt-5 divide-y">
                {customerOrders.length > 0 && (
  <div className="mt-8 rounded-2xl border border-border bg-card shadow-sm">
    <div className="border-b px-6 py-5">
      <h2 className="text-lg font-semibold">
        {customerOrders.length === 1
          ? "Pedido encontrado"
          : "Pedidos encontrados"}
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        {customerOrders.length === 1
          ? "Consulta la información de tu pedido."
          : "Selecciona el pedido que deseas consultar."}
      </p>
    </div>

    <div className="divide-y">
      {customerOrders.map(
        (customerOrder) => {
          const isOpen =
            selectedOrderId ===
            customerOrder.id;

          return (
            <div
              key={customerOrder.id}
            >
              <button
                type="button"
                onClick={() =>
                  setSelectedOrderId(
                    isOpen
                      ? null
                      : customerOrder.id,
                  )
                }
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-muted/30 active:bg-muted/50 md:px-6"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      Pedido #
                      {String(
                        customerOrder.order_number,
                      ).padStart(4, "0")}
                    </p>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium ${getOrderStatusMeta(customerOrder.status).badgeClass}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${getOrderStatusMeta(customerOrder.status).dotClass} ${customerOrder.status === "pending" ? "motion-safe:animate-pulse motion-reduce:animate-none" : ""}`}
                      />
                      {getOrderStatusMeta(customerOrder.status).label}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDate(
                      customerOrder.created_at,
                    )}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <p className="font-semibold">
                    {formatCurrency(
                      customerOrder.total,
                    )}
                  </p>

                  <ChevronDown
                    className={[
                      "h-5 w-5 text-muted-foreground transition-transform duration-200",
                      isOpen
                        ? "rotate-180"
                        : "",
                    ].join(" ")}
                  />
                </div>
              </button>

              {isOpen && (
                <TrackedOrderDetails
                  order={customerOrder}
                  statusLabels={
                    statusLabels
                  }
                  paymentLabels={
                    paymentLabels
                  }
                  paymentStatusLabels={
                    paymentStatusLabels
                  }
                  timeline={timeline}
                  statusOrder={
                    statusOrder
                  }
                />
              )}
            </div>
          );
        },
      )}
    </div>
  </div>
)}
              </div>
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