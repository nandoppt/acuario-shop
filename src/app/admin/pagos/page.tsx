import { createAdminClient } from "@/lib/supabase/admin";
import { PaymentAccountsManager } from "./payment-accounts-manager";

export default async function PagosPage() {
  const admin = createAdminClient();
  const [{ data: settings, error: settingsError }, { data: accounts, error: accountsError }] = await Promise.all([
    admin.from("payment_settings").select("transfer_enabled").limit(1).single(),
    admin.from("payment_accounts").select("id, bank_name, account_type, account_number, account_holder, identification, contact_email, qr_url, enabled").order("sort_order").order("created_at"),
  ]);
  if (settingsError || !settings) throw new Error("No existe la configuración de pagos.");
  if (accountsError) throw new Error("No se pudieron cargar las cuentas bancarias.");
  return <div className="mx-auto max-w-5xl space-y-8">
    <div><p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Administración</p><h1 className="mt-2 text-3xl font-semibold tracking-tight">Pagos</h1><p className="mt-2 max-w-2xl text-muted-foreground">Administra varias cuentas de transferencia y sus datos de pago.</p></div>
    <PaymentAccountsManager initialAccounts={accounts ?? []} transferEnabled={settings.transfer_enabled} />
  </div>;
}