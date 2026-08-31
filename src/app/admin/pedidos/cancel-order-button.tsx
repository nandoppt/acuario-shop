"use client";

import { useState } from "react";
import {
  Ban,
  Loader2,
} from "lucide-react";

import { cancelOrder } from "./order-actions";

type Props = {
  orderId: string;
  orderNumber: number;
};

export function CancelOrderButton({
  orderId,
  orderNumber,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleCancel() {
    const confirmed =
      window.confirm(
        `¿Cancelar el pedido #${orderNumber}?\n\nSi el pedido ya fue pagado, los productos serán devueltos al inventario y el pago pasará a reembolsado.`,
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError(null);

    const result =
      await cancelOrder(orderId);

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleCancel}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 px-5 py-3 font-medium text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Cancelando...
          </>
        ) : (
          <>
            <Ban size={18} />
            Cancelar pedido
          </>
        )}
      </button>

      {error && (
        <div className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}