import { createAdminClient } from "@/lib/supabase/admin";
import { PaymentSettingsForm } from "./payment-settings-form";

export default async function PagosPage() {
  const admin = createAdminClient();

  const { data: settings, error } = await admin
    .from("payment_settings")
    .select(
      "id, bank_name, account_type, account_number, account_holder, identification, contact_email, qr_url, transfer_enabled",
    )
    .limit(1)
    .single();

  if (error || !settings) {
    throw new Error("No existe la configuración de pagos.");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Administración
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Pagos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Administra los datos bancarios y la información que recibirán tus clientes.
        </p>
      </div>

      <PaymentSettingsForm initialSettings={settings} />
    </div>
  );
}
