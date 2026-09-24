"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type PaymentSettings = {
  bank_name: string;
  account_type: string;
  account_number: string;
  account_holder: string;
  identification: string;
  contact_email: string;
  qr_url: string;
  transfer_enabled: boolean;
};

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("No autorizado.");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("No autorizado.");
}

export async function updatePaymentSettings(settings: PaymentSettings) {
  await requireAdmin();

  const admin = createAdminClient();
  const { data: existing, error: existingError } = await admin
    .from("payment_settings")
    .select("id")
    .limit(1)
    .single();

  if (existingError || !existing) {
    throw new Error("No existe la configuración de pagos.");
  }

  const { error } = await admin
    .from("payment_settings")
    .update({
      bank_name: settings.bank_name.trim() || null,
      account_type: settings.account_type.trim() || null,
      account_number: settings.account_number.trim() || null,
      account_holder: settings.account_holder.trim() || null,
      identification: settings.identification.trim() || null,
      contact_email: settings.contact_email.trim() || null,
      qr_url: settings.qr_url.trim() || null,
      transfer_enabled: settings.transfer_enabled,
      updated_at: new Date().toISOString(),
    })
    .eq("id", existing.id);

  if (error) {
    console.error("[PAYMENT SETTINGS]", error);
    throw new Error("No se pudo guardar la configuración.");
  }

  revalidatePath("/admin/pagos");
  revalidatePath("/checkout");
  revalidatePath("/pedido/confirmado/[id]", "page");
}
