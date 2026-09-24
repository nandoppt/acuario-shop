"use client";

import { useState } from "react";
import { updatePaymentSettings } from "./payment-actions";

type Props = {
  initialSettings: {
    bank_name: string | null;
    account_type: string | null;
    account_number: string | null;
    account_holder: string | null;
    identification: string | null;
    contact_email: string | null;
    qr_url: string | null;
    transfer_enabled: boolean;
  };
};

export function PaymentSettingsForm({ initialSettings }: Props) {
  const [form, setForm] = useState({
    bank_name: initialSettings.bank_name ?? "",
    account_type: initialSettings.account_type ?? "",
    account_number: initialSettings.account_number ?? "",
    account_holder: initialSettings.account_holder ?? "",
    identification: initialSettings.identification ?? "",
    contact_email: initialSettings.contact_email ?? "",
    qr_url: initialSettings.qr_url ?? "",
    transfer_enabled: initialSettings.transfer_enabled,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function update(field: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updatePaymentSettings(form);
      setMessage("Configuración guardada correctamente.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "No se pudo guardar la configuración.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl border border-border bg-background p-6 md:p-8"
    >
      <div>
        <h2 className="text-xl font-semibold">Transferencia / QR</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Estos datos se mostrarán en la confirmación del pedido y en el correo del cliente.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {[
          ["bank_name", "Banco"],
          ["account_type", "Tipo de cuenta"],
          ["account_number", "Número de cuenta"],
          ["account_holder", "Titular"],
          ["identification", "Cédula / RUC"],
          ["contact_email", "Correo para comprobantes"],
        ].map(([field, label]) => (
          <label key={field} className="space-y-2">
            <span className="text-sm font-medium">{label}</span>
            <input
              value={form[field as keyof typeof form] as string}
              onChange={(event) =>
                update(field as keyof typeof form, event.target.value)
              }
              className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        ))}
      </div>

      <label className="space-y-2">
        <span className="text-sm font-medium">URL del código QR</span>
        <input
          type="url"
          value={form.qr_url}
          onChange={(event) => update("qr_url", event.target.value)}
          placeholder="https://..."
          className="h-12 w-full rounded-xl border border-border bg-background px-4 outline-none focus:ring-2 focus:ring-ring"
        />
        <span className="block text-xs leading-5 text-muted-foreground">
          Por ahora puedes colocar la URL pública de la imagen QR. Más adelante podemos convertirlo en carga directa desde este panel.
        </span>
      </label>

      {form.qr_url && (
        <div className="rounded-xl border border-border p-5">
          <p className="text-sm font-medium">Vista previa del QR</p>
          <img
            src={form.qr_url}
            alt="Código QR de transferencia"
            className="mt-4 h-48 w-48 rounded-xl border object-contain"
          />
        </div>
      )}

      <label className="flex items-center gap-3 rounded-xl border border-border p-4">
        <input
          type="checkbox"
          checked={form.transfer_enabled}
          onChange={(event) => update("transfer_enabled", event.target.checked)}
          className="h-4 w-4"
        />
        <div>
          <p className="text-sm font-medium">Habilitar transferencia / QR</p>
          <p className="text-xs text-muted-foreground">
            Si se desactiva, el método no debería ofrecerse al cliente.
          </p>
        </div>
      </label>

      {message && (
        <div className="rounded-xl border border-border bg-secondary px-4 py-3 text-sm">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex h-12 rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {saving ? "Guardando..." : "Guardar cambios"}
      </button>
    </form>
  );
}
