"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { updateAccountData } from "./datos-actions";

type AccountDataFormProps = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export function AccountDataForm({
  firstName,
  lastName,
  phone,
  email,
}: AccountDataFormProps) {
  const [form, setForm] = useState({
    first_name: firstName,
    last_name: lastName,
    phone,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSaving(true);
    setMessage("");
    setError("");

    const response = await updateAccountData(form);

    if (!response.success) {
      setError(
        response.error ??
          "No se pudieron guardar los cambios.",
      );
      setIsSaving(false);
      return;
    }

    setMessage(
      response.message ??
        "Tus datos se actualizaron correctamente.",
    );

    setIsSaving(false);
  }

  function updateField(
    field: "first_name" | "last_name" | "phone",
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor="first_name"
            className="text-sm font-medium"
          >
            Nombre
          </label>

          <input
            id="first_name"
            name="first_name"
            value={form.first_name}
            onChange={(event) =>
              updateField(
                "first_name",
                event.target.value,
              )
            }
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            autoComplete="given-name"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="last_name"
            className="text-sm font-medium"
          >
            Apellido
          </label>

          <input
            id="last_name"
            name="last_name"
            value={form.last_name}
            onChange={(event) =>
              updateField(
                "last_name",
                event.target.value,
              )
            }
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
            autoComplete="family-name"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="text-sm font-medium"
        >
          Número de teléfono
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(event) =>
            updateField(
              "phone",
              event.target.value,
            )
          }
          className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          autoComplete="tel"
          placeholder="09XXXXXXXX"
        />

        <p className="text-xs text-muted-foreground">
          Lo utilizaremos como contacto para tus pedidos.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          Correo electrónico
        </label>

        <input
          id="email"
          type="email"
          value={email}
          disabled
          className="h-11 w-full cursor-not-allowed rounded-xl border border-border bg-muted/50 px-4 text-sm text-muted-foreground"
        />

        <p className="text-xs text-muted-foreground">
          Este correo está asociado a tu cuenta.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {message && (
        <div className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          <Check className="h-4 w-4 shrink-0" />
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}

        {isSaving
          ? "Guardando..."
          : "Guardar cambios"}
      </button>
    </form>
  );
}