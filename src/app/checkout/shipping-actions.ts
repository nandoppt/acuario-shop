"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getShippingSettings() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * La configuración no es información sensible,
   * pero la consultamos desde servidor para que
   * el navegador no pueda modificarla.
   */
  void user;

  const admin = createAdminClient();

  const { data, error } = await admin
    .from("shipping_settings")
    .select(
      `
        base_rate,
        included_distance_km,
        additional_km_rate,
        max_automatic_rate,
        free_shipping_minimum,
        automatic_shipping_enabled
      `,
    )
    .limit(1)
    .single();

  if (error || !data) {
    console.error(
      "[SHIPPING] Error obteniendo configuración:",
      error,
    );

    return {
      success: false,
      error: "No se pudo cargar la configuración de envíos.",
    };
  }

  return {
    success: true,
    settings: data,
  };
}