"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";


export async function getShippingCoverage(
  province: string,
  city: string,
  parish: string,
) {
  try {
    if (!province || !city || !parish) {
      return {
        success: true,
        coverage: null,
      };
    }

    const admin = createAdminClient();

    const { data, error } = await admin
      .from("shipping_coverage")
      .select(`
        id,
        province,
        city,
        parish,
        enabled,
        shipping_cost,
        notes
      `)
      .eq("province", province)
      .eq("city", city)
      .eq("parish", parish)
      .maybeSingle();

    if (error) {
      console.error(
        "[SHIPPING COVERAGE]",
        error,
      );

      return {
        success: false,
        coverage: null,
        error:
          "No se pudo consultar la cobertura de envío.",
      };
    }

      console.log("[SHIPPING COVERAGE] Consulta:", {
  province,
  city,
  parish,
});

console.log("[SHIPPING COVERAGE] Resultado:", data);

    return {
      success: true,
      coverage: data,
    };
  } catch (error) {
    console.error(
      "[SHIPPING COVERAGE]",
      error,
    );

    return {
      success: false,
      coverage: null,
      error:
        "No se pudo consultar la cobertura de envío.",
    };
  }
}

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