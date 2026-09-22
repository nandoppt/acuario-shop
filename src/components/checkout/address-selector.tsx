"use client";

import { Check, MapPin, Plus } from "lucide-react";

export type CheckoutAddress = {
  id: string;
  province: string;
  city: string;
  parish: string | null;
  address: string;
  reference: string | null;
  created_at: string;
  is_default: boolean;
};

type AddressSelectorProps = {
  addresses: CheckoutAddress[];
  selectedAddressId: string | null;
  onSelect: (address: CheckoutAddress) => void;
  onAddAddress: () => void;
};

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelect,
  onAddAddress,
}: AddressSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {addresses.map((address) => {
          const selected =
            address.id === selectedAddressId;

          return (
            <button
              key={address.id}
              type="button"
              onClick={() => onSelect(address)}
              className={`w-full rounded-2xl border p-4 text-left transition ${
                selected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:bg-muted/40"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-primary"
                  }`}
                >
                  {selected ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold">
                      {address.city}
                    </p>

                    {address.is_default && (
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        Principal
                      </span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {address.parish
                      ? `${address.parish} · ${address.city} · ${address.province}`
                      : `${address.city} · ${address.province}`}
                  </p>

                  <p className="mt-2 text-sm leading-6">
                    {address.address}
                  </p>

                  {address.reference && (
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Referencia: {address.reference}
                    </p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAddAddress}
        className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-muted"
      >
        <Plus className="h-4 w-4" />
        Agregar nueva dirección
      </button>
    </div>
  );
}