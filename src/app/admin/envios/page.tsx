import { createAdminClient } from "@/lib/supabase/admin";
import { ShippingManager } from "./shipping-manager";

export default async function EnviosPage() {
  const admin = createAdminClient();

  const { data: settings, error } = await admin
    .from("shipping_settings")
    .select(
      `
        id,
        base_rate,
        included_distance_km,
        additional_km_rate,
        max_automatic_rate,
        free_shipping_minimum,
        automatic_shipping_enabled,
        origin_address,
        origin_latitude,
        origin_longitude
      `,
    )
    .limit(1)
    .single();

  if (error) {
    console.error("Error cargando configuración de envíos:", error);
  }

  if (!settings) {
    return (
      <div className="space-y-3">
        <h1 className="font-sans text-3xl font-semibold tracking-tight">
          Envíos
        </h1>

        <p className="text-sm text-destructive">
          No existe una configuración de envíos.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-sans text-3xl font-semibold tracking-tight">
          Envíos
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Configura las tarifas y condiciones para el cálculo de envíos de
          VidaBajoAgua.
        </p>
      </div>

      <ShippingManager initialSettings={settings} />
    </div>
  );
}