"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type PaymentAccountInput = {
  bank_name: string; account_type: string; account_number: string; account_holder: string;
  identification: string; contact_email: string; qr_url: string; enabled: boolean;
};

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado.");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") throw new Error("No autorizado.");
}
function clean(input: PaymentAccountInput) {
  return {
    bank_name: input.bank_name.trim(), account_type: input.account_type.trim(),
    account_number: input.account_number.trim(), account_holder: input.account_holder.trim(),
    identification: input.identification.trim() || null, contact_email: input.contact_email.trim() || null,
    qr_url: input.qr_url.trim() || null, enabled: input.enabled,
  };
}
function validate(input: PaymentAccountInput) {
  if (!input.bank_name.trim()) throw new Error("El banco es obligatorio.");
  if (!input.account_type.trim()) throw new Error("El tipo de cuenta es obligatorio.");
  if (!input.account_number.trim()) throw new Error("El número de cuenta es obligatorio.");
  if (!input.account_holder.trim()) throw new Error("El titular es obligatorio.");
}
export async function createPaymentAccount(input: PaymentAccountInput) {
  await requireAdmin(); validate(input);
  const { error } = await createAdminClient().from("payment_accounts").insert(clean(input));
  if (error) throw new Error("No se pudo crear la cuenta bancaria.");
  revalidatePath("/admin/pagos"); revalidatePath("/checkout"); revalidatePath("/pedido/confirmado/[id]", "page");
}
export async function updatePaymentAccount(id: string, input: PaymentAccountInput) {
  await requireAdmin(); validate(input);
  const { error } = await createAdminClient().from("payment_accounts").update({...clean(input), updated_at:new Date().toISOString()}).eq("id", id);
  if (error) throw new Error("No se pudo actualizar la cuenta bancaria.");
  revalidatePath("/admin/pagos"); revalidatePath("/checkout"); revalidatePath("/pedido/confirmado/[id]", "page");
}
export async function deletePaymentAccount(id: string) {
  await requireAdmin();
  const { error } = await createAdminClient().from("payment_accounts").delete().eq("id", id);
  if (error) throw new Error("No se pudo eliminar la cuenta bancaria.");
  revalidatePath("/admin/pagos"); revalidatePath("/checkout"); revalidatePath("/pedido/confirmado/[id]", "page");
}
export async function updateTransferEnabled(enabled: boolean) {
  await requireAdmin();
  const admin = createAdminClient();
  const { data: settings } = await admin.from("payment_settings").select("id").limit(1).single();
  if (!settings) throw new Error("No existe la configuración de pagos.");
  const { error } = await admin.from("payment_settings").update({transfer_enabled:enabled,updated_at:new Date().toISOString()}).eq("id",settings.id);
  if (error) throw new Error("No se pudo actualizar el estado.");
  revalidatePath("/admin/pagos"); revalidatePath("/checkout");
}