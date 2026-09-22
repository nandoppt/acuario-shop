"use client";

import { useEffect, useState } from "react";
import { Loader2, MapPin, X } from "lucide-react";

import { LocationSelect } from "@/components/checkout/location-select";

import {
  createAddress,
  updateAddress,
} from "./direcciones-actions";

type Address = {
  id: string;
  province: string;
  city: string;
  parish: string | null;
  address: string;
  reference: string | null;
  created_at: string;
  is_default: boolean;
};

type AddressFormProps = {
  address?: Address | null;
  hasAddresses: boolean;
  onSaved: (address: Address) => void;
  onCancel: () => void;
};

export function DireccionForm({
  address,
  hasAddresses,
  onSaved,
  onCancel,
}: AddressFormProps) {
  const isEditing = Boolean(address);

  const [province, setProvince] = useState(
    address?.province ?? "",
  );

  const [city, setCity] = useState(
    address?.city ?? "",
  );

  const [parish, setParish] = useState(
    address?.parish ?? "",
  );

  const [addressText, setAddressText] = useState(
    address?.address ?? "",
  );

  const [reference, setReference] = useState(
    address?.reference ?? "",
  );

  const [makeDefault, setMakeDefault] = useState(
    address?.is_default ?? !hasAddresses,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setProvince(address?.province ?? "");
    setCity(address?.city ?? "");
    setParish(address?.parish ?? "");
    setAddressText(address?.address ?? "");
    setReference(address?.reference ?? "");
    setMakeDefault(
      address?.is_default ?? !hasAddresses,
    );
    setError("");
  }, [address, hasAddresses]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!province.trim()) {
      setError("La provincia es obligatoria.");
      return;
    }

    if (!city.trim()) {
      setError("La ciudad es obligatoria.");
      return;
    }

    if (!parish.trim()) {
      setError("La parroquia es obligatoria.");
      return;
    }

    if (!addressText.trim()) {
      setError("La dirección es obligatoria.");
      return;
    }

    setLoading(true);

    const input = {
      province,
      city,
      parish,
      address: addressText,
      reference,
    };

    const result = isEditing
      ? await updateAddress(
          address!.id,
          input,
          makeDefault,
        )
      : await createAddress(
          input,
          makeDefault,
        );

    if (!result.success) {
      setError(
        result.error ??
          "No se pudo guardar la dirección.",
      );
      setLoading(false);
      return;
    }

    if (!result.address) {
      setError(
        "La dirección se guardó, pero no pudimos recuperar sus datos.",
      );
      setLoading(false);
      return;
    }

    onSaved(result.address);
    setLoading(false);
  }

  return (
    <div className="mb-8 rounded-2xl border border-border bg-card p-5 md:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <MapPin className="h-4 w-4 text-primary" />
          </div>

          <div>
            <h2 className="font-semibold">
              {isEditing
                ? "Editar dirección"
                : "Agregar dirección"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Guarda los datos donde deseas recibir tus
              pedidos.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
          aria-label="Cerrar formulario"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <LocationSelect
          province={province}
          canton={city}
          parish={parish}
          onProvinceChange={(value) => {
            setProvince(value);
            setCity("");
            setParish("");
          }}
          onCantonChange={(value) => {
            setCity(value);
            setParish("");
          }}
          onParishChange={(value) => {
            setParish(value);
          }}
        />

        <div className="space-y-2">
          <label
            htmlFor="address"
            className="text-sm font-medium"
          >
            Dirección
          </label>

          <input
            id="address"
            value={addressText}
            onChange={(event) =>
              setAddressText(event.target.value)
            }
            placeholder="Ej. Av. Mariscal Sucre y ..."
            disabled={loading}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="reference"
            className="text-sm font-medium"
          >
            Referencia
            <span className="ml-1 font-normal text-muted-foreground">
              (opcional)
            </span>
          </label>

          <textarea
            id="reference"
            value={reference}
            onChange={(event) =>
              setReference(event.target.value)
            }
            placeholder="Ej. Casa blanca junto al parque"
            disabled={loading}
            rows={3}
            className="w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
          <input
            type="checkbox"
            checked={makeDefault}
            onChange={(event) =>
              setMakeDefault(event.target.checked)
            }
            disabled={
              loading ||
              address?.is_default === true
            }
            className="mt-0.5 h-4 w-4 accent-primary"
          />

          <span>
            <span className="block text-sm font-medium">
              Usar como dirección principal
            </span>

            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
              Será la dirección seleccionada
              automáticamente cuando realices una
              compra.
            </span>
          </span>
        </label>

        <div className="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="h-10 rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            {isEditing
              ? "Guardar cambios"
              : "Guardar dirección"}
          </button>
        </div>
      </form>
    </div>
  );
}