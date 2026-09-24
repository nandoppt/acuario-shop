"use client";

import { Banknote, CreditCard, QrCode } from "lucide-react";
import type { PaymentMethod } from "@/lib/checkout/checkout-types";

type Props = {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  transferEnabled?: boolean;
};

const methods = [
  {
    id: "transferencia",
    title: "Transferencia / QR",
    description: "Transferencia bancaria o código QR.",
    icon: QrCode,
  },
  {
    id: "efectivo",
    title: "Pago en efectivo",
    description: "Disponible para entregas presenciales.",
    icon: Banknote,
  },
  {
    id: "payphone",
    title: "Link de PayPhone",
    description: "Recibirás un enlace de pago seguro.",
    icon: CreditCard,
  },
] as const;

export function PaymentSelector({ value, onChange, transferEnabled = true }: Props) {
  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const Icon = method.icon;
        const active = value === method.id;
        const disabled = method.id === "transferencia" && !transferEnabled;

        return (
          <button
            key={method.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(method.id)}
            className={`w-full rounded-xl border p-4 text-left transition ${
              active
                ? "border-primary bg-secondary"
                : "border-border hover:border-primary/40"
            } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-1 text-primary" size={22} />

              <div>
                <h3 className="font-semibold">{method.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {method.description}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}