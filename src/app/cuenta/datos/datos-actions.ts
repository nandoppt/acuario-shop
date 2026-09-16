"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type UpdateAccountData = {
  first_name: string;
  last_name: string;
  phone: string;
};

export async function updateAccountData(
  input: UpdateAccountData,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "Tu sesión ha expirado.",
    };
  }

  const firstName = input.first_name.trim();
  const lastName = input.last_name.trim();
  const phone = input.phone.trim();

  if (!firstName || !lastName) {
    return {
      success: false,
      error: "Nombre y apellido son obligatorios.",
    };
  }

  const admin = createAdminClient();

  const { error: profileError } = await admin
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    console.error(
      "[ACCOUNT] Error actualizando profile:",
      profileError,
    );

    return {
      success: false,
      error:
        "No se pudieron actualizar tus datos.",
    };
  }

  const { error: customerError } = await admin
    .from("customers")
    .update({
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      updated_at: new Date().toISOString(),
    })
    .eq("auth_user_id", user.id);

  if (customerError) {
    console.error(
      "[ACCOUNT] Error actualizando customer:",
      customerError,
    );

    return {
      success: false,
      error:
        "No se pudieron actualizar tus datos.",
    };
  }

  return {
    success: true,
    message: "Tus datos se actualizaron correctamente.",
  };
}