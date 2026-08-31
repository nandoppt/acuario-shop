"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { confirmOrderPayment } from "./order-actions";

type Props = {
  orderId: string;
  paymentId: string;
};

export function ConfirmPaymentButton({
  orderId,
  paymentId,
}: Props) {
  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState(false);

  async function handleConfirm() {
    const confirmed =
      window.confirm(
        "¿Confirmar este pago?\n\nEsta acción marcará el pedido como confirmado y descontará los productos del inventario.",
      );

    if (!confirmed) {
      return;
    }

    setLoading(true);
    setError(null);

    const result =
      await confirmOrderPayment(
        orderId,
        paymentId,
      );

    if (!result.success) {
      setError(result.message);
      setLoading(false);
      return;
    }

    setSuccess(true);

    // Recargar datos del servidor
    window.location.reload();
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
        <CheckCircle2 size={18} />
        Pago confirmado
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleConfirm}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Confirmando...
          </>
        ) : (
          <>
            <CheckCircle2 size={18} />
            Confirmar pago
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