import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { DireccionesManager } from "./direcciones-manager";

export default async function DireccionesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/cuenta/login");
  }

  const admin = createAdminClient();

  const { data: customer, error: customerError } = await admin
    .from("customers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (customerError) {
    console.error(
      "[ADDRESSES] Error buscando customer:",
      customerError,
    );
  }

  if (!customer) {
    return (
      <main className="min-h-[70vh] px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/cuenta"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Mi cuenta
          </Link>

          <div className="rounded-2xl border border-border bg-card p-8 text-center md:p-12">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight">
              Mis direcciones
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              No encontramos una cuenta de cliente asociada a tu usuario.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const { data: addresses, error: addressesError } = await admin
    .from("addresses")
    .select(
      "id, province, city, address, reference, created_at, is_default",
    )
    .eq("customer_id", customer.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  if (addressesError) {
    console.error(
      "[ADDRESSES] Error cargando direcciones:",
      addressesError,
    );
  }

  return (
    <main className="min-h-[70vh] px-4 py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/cuenta"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Mi cuenta
        </Link>

        <div className="mb-8">
          <p className="text-sm font-medium text-primary">
            Mi cuenta
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Mis direcciones
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Guarda tus direcciones para agilizar tus próximas compras.
            Tu dirección principal se utilizará como opción
            predeterminada durante el proceso de compra.
          </p>
        </div>

        <DireccionesManager
          initialAddresses={addresses ?? []}
        />
      </div>
    </main>
  );
}