"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  PackageCheck,
  Truck,
} from "lucide-react";

import { updateOrderStatus } from "./order-actions";

type Props = {
  orderId: string;
  currentStatus: string;
};

const nextStatuses: Record<
  string,
  {
    status: string;
    label: string;
    description: string;
    icon: typeof CheckCircle2;
  }
> = {
  confirmed: {
    status: "preparing",
    label: "Marcar como preparando",
    description:
      "Indica que el pedido está siendo preparado.",
    icon: PackageCheck,
  },

  preparing: {
    status: "shipped",
    label: "Marcar como enviado",
    description:
      "Indica que el pedido ya salió a entrega.",
    icon: Truck,
  },

  shipped: {
    status: "delivered",
    label: "Marcar como entregado",
    description:
      "Indica que el cliente recibió el pedido.",
    icon: CheckCircle2,
  },
};

const statusLabels: Record<
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

export function OrderStatusControl({
  orderId,
  currentStatus,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const next =
    nextStatuses[currentStatus];

  if (!next) {
    return null;
  }

  const Icon = next.icon;

  async function handleUpdate() {
    const confirmed =
      window.confirm(
        `¿Cambiar el pedido a "${statusLabels[next.status]}"?`,
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError(null);

    const result =
      await updateOrderStatus(
        orderId,
        next.status,
      );

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Siguiente estado
      </p>

      <p className="mt-2 text-lg font-semibold">
        {statusLabels[next.status]}
      </p>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {next.description}
      </p>

      <button
        type="button"
        onClick={handleUpdate}
        disabled={loading}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Actualizando...
          </>
        ) : (
          <>
            <Icon size={18} />
            {next.label}
          </>
        )}
      </button>

      {error && (
        <div className="mt-3 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}