"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { LocationSelect } from "@/components/checkout/location-select";

import {
  createShippingCoverage,
  deleteShippingCoverage,
  getShippingCoverage,
  toggleShippingCoverage,
  updateShippingCoverage,
} from "./cobertura-actions";

type ShippingCoverage = {
  id: string;
  province: string;
  city: string;
  parish: string;
  enabled: boolean;
  shipping_cost: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type CoverageForm = {
  province: string;
  city: string;
  parish: string;
  shipping_cost: string;
  notes: string;
  enabled: boolean;
};

const EMPTY_FORM: CoverageForm = {
  province: "",
  city: "",
  parish: "",
  shipping_cost: "2.00",
  notes: "",
  enabled: true,
};

export function CoverageManager() {
  const [coverage, setCoverage] = useState<
    ShippingCoverage[]
  >([]);

  const [form, setForm] =
    useState<CoverageForm>(EMPTY_FORM);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [showForm, setShowForm] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [isPending, startTransition] =
    useTransition();

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  async function loadCoverage() {
    setLoading(true);
    setError(null);

    const result = await getShippingCoverage();

    if (!result.success) {
      setError(
        result.error ??
          "No se pudo cargar la cobertura.",
      );
      setCoverage([]);
      setLoading(false);
      return;
    }

    setCoverage(
      (result.coverage ?? []) as ShippingCoverage[],
    );

    setLoading(false);
  }

  useEffect(() => {
    void loadCoverage();
  }, []);

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  }

  function openCreate() {
    setMessage(null);
    setError(null);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  }

  function openEdit(item: ShippingCoverage) {
    setMessage(null);
    setError(null);

    setEditingId(item.id);

    setForm({
      province: item.province,
      city: item.city,
      parish: item.parish,
      shipping_cost:
        item.shipping_cost === null
          ? ""
          : String(item.shipping_cost),
      notes: item.notes ?? "",
      enabled: item.enabled,
    });

    setShowForm(true);
  }

  function updateField(
    field: keyof CoverageForm,
    value: string | boolean,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function submitForm(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setMessage(null);

    if (!form.province) {
      setError("Selecciona una provincia.");
      return;
    }

    if (!form.city) {
      setError("Selecciona un cantón.");
      return;
    }

    if (!form.parish) {
      setError("Selecciona una parroquia.");
      return;
    }

    const parsedShippingCost =
      form.shipping_cost.trim() === ""
        ? null
        : Number(form.shipping_cost);

    if (
      parsedShippingCost !== null &&
      (!Number.isFinite(parsedShippingCost) ||
        parsedShippingCost < 0)
    ) {
      setError(
        "La tarifa de envío no es válida.",
      );
      return;
    }

    startTransition(async () => {
      const input = {
        province: form.province,
        city: form.city,
        parish: form.parish,
        shipping_cost: parsedShippingCost,
        notes: form.notes,
        enabled: form.enabled,
      };

      const result = editingId
        ? await updateShippingCoverage(
            editingId,
            input,
          )
        : await createShippingCoverage(input);

      if (!result.success) {
        setError(
          result.error ??
            "No se pudo guardar la zona.",
        );
        return;
      }

      setMessage(
        editingId
          ? "Zona de cobertura actualizada correctamente."
          : "Zona de cobertura creada correctamente.",
      );

      resetForm();

      await loadCoverage();
    });
  }

  function handleToggle(item: ShippingCoverage) {
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result =
        await toggleShippingCoverage(
          item.id,
          !item.enabled,
        );

      if (!result.success) {
        setError(
          result.error ??
            "No se pudo actualizar la zona.",
        );
        return;
      }

      setCoverage((current) =>
        current.map((coverageItem) =>
          coverageItem.id === item.id
            ? {
                ...coverageItem,
                enabled: !item.enabled,
              }
            : coverageItem,
        ),
      );

      setMessage(
        !item.enabled
          ? "Zona activada correctamente."
          : "Zona desactivada correctamente.",
      );
    });
  }

  function handleDelete(item: ShippingCoverage) {
    const confirmed = window.confirm(
      `¿Eliminar la cobertura de ${item.parish}?`,
    );

    if (!confirmed) {
      return;
    }

    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result =
        await deleteShippingCoverage(item.id);

      if (!result.success) {
        setError(
          result.error ??
            "No se pudo eliminar la zona.",
        );
        return;
      }

      setCoverage((current) =>
        current.filter(
          (coverageItem) =>
            coverageItem.id !== item.id,
        ),
      );

      setMessage(
        "Zona de cobertura eliminada correctamente.",
      );
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Zonas de cobertura
            </h2>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Define las parroquias donde VidaBajoAgua
              puede calcular automáticamente el envío.
              Las zonas no configuradas podrán quedar
              como envío por confirmar.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Agregar zona
            </button>
          )}
        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {message}
          </div>
        )}

        {showForm && (
          <form
            onSubmit={submitForm}
            className="mt-6 rounded-2xl border border-border bg-muted/30 p-5"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold">
                  {editingId
                    ? "Editar zona"
                    : "Nueva zona"}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Selecciona la ubicación y define su
                  tarifa.
                </p>
              </div>

              <button
                type="button"
                onClick={resetForm}
                disabled={isPending}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                aria-label="Cerrar formulario"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <LocationSelect
              province={form.province}
              canton={form.city}
              parish={form.parish}
              onProvinceChange={(value) => {
                updateField("province", value);
                updateField("city", "");
                updateField("parish", "");
              }}
              onCantonChange={(value) => {
                updateField("city", value);
                updateField("parish", "");
              }}
              onParishChange={(value) => {
                updateField("parish", value);
              }}
            />

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="coverage-shipping-cost"
                  className="text-sm font-medium"
                >
                  Tarifa de envío
                </label>

                <input
                  id="coverage-shipping-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.shipping_cost}
                  onChange={(event) =>
                    updateField(
                      "shipping_cost",
                      event.target.value,
                    )
                  }
                  placeholder="Ej. 2.00"
                  disabled={isPending}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
                />

                <p className="text-xs text-muted-foreground">
                  Deja vacío si esta zona requiere
                  confirmación manual.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="coverage-notes"
                  className="text-sm font-medium"
                >
                  Notas
                  <span className="ml-1 font-normal text-muted-foreground">
                    (opcional)
                  </span>
                </label>

                <input
                  id="coverage-notes"
                  type="text"
                  value={form.notes}
                  onChange={(event) =>
                    updateField(
                      "notes",
                      event.target.value,
                    )
                  }
                  placeholder="Ej. Entrega con motorizado"
                  disabled={isPending}
                  className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50"
                />
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-4">
              <input
                type="checkbox"
                checked={form.enabled}
                onChange={(event) =>
                  updateField(
                    "enabled",
                    event.target.checked,
                  )
                }
                disabled={isPending}
                className="mt-0.5 h-4 w-4 accent-primary"
              />

              <span>
                <span className="block text-sm font-medium">
                  Zona activa
                </span>

                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Las zonas activas podrán utilizarse
                  para calcular el envío.
                </span>
              </span>
            </label>

            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={resetForm}
                disabled={isPending}
                className="h-10 rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {editingId
                  ? "Guardar cambios"
                  : "Crear zona"}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-5">
          <h3 className="font-semibold">
            Cobertura configurada
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {coverage.length === 0
              ? "Todavía no has configurado ninguna zona."
              : `${coverage.length} zona${coverage.length === 1 ? "" : "s"} configurada${coverage.length === 1 ? "" : "s"}.`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-10">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : coverage.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Agrega la primera parroquia para comenzar
            a configurar la cobertura.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {coverage.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">
                      {item.parish}
                    </p>

                    <span
                      className={
                        item.enabled
                          ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                          : "rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                      }
                    >
                      {item.enabled
                        ? "Activa"
                        : "Inactiva"}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.city}, {item.province}
                  </p>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <span>
                      <span className="text-muted-foreground">
                        Envío:
                      </span>{" "}
                      {item.shipping_cost === null
                        ? "Por confirmar"
                        : `$${Number(item.shipping_cost).toFixed(2)}`}
                    </span>

                    {item.notes && (
                      <span className="text-muted-foreground">
                        {item.notes}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      handleToggle(item)
                    }
                    className="h-9 rounded-lg border border-border px-3 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
                  >
                    {item.enabled
                      ? "Desactivar"
                      : "Activar"}
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      openEdit(item)
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition hover:bg-muted disabled:opacity-50"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() =>
                      handleDelete(item)
                    }
                    className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-destructive transition hover:bg-destructive/5 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}