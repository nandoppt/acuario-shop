import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  ArrowLeft,
  LogIn,
  MapPin,
  Package,
  UserPlus,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role === "admin") {
    redirect("/admin");
  }
}

  if (user) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
              VidaBajoAgua
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Mi cuenta
            </h1>

            <p className="mt-3 text-muted-foreground">
              Has iniciado sesión con {user.email}
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            
            <Link
              href="/cuenta/pedidos"
              className="rounded-xl border bg-card p-6 shadow-sm transition hover:bg-muted/50"
            >
              <Package className="h-6 w-6" />

              <h2 className="mt-4 font-semibold">
                Mis pedidos
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Consulta tu historial de compras y el estado de
                tus pedidos.
              </p>
            </Link>
            <Link
              href="/cuenta/datos"
              className="rounded-xl border bg-card p-6 shadow-sm transition hover:bg-muted/50"
            >
              <UserRound className="h-6 w-6" />

              <h2 className="mt-4 font-semibold">
                Mis datos
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Actualiza tu nombre, apellido y número de teléfono.
              </p>
            </Link>
            <Link
              href="/cuenta/direcciones"
              className="rounded-xl border bg-card p-6 shadow-sm transition hover:bg-muted/50"
            >
              <MapPin className="h-6 w-6" />

              <h2 className="mt-4 font-semibold">
                Mis direcciones
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Modifica tus direcciones de envío.
              </p>
            </Link>
          </div>

          <LogoutButton
            className="flex w-full items-center gap-4 rounded-xl border bg-card p-6 text-left shadow-sm transition hover:bg-muted/50"
          />

          <div className="mt-8 text-center">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la tienda
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            VidaBajoAgua
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Mi cuenta
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Inicia sesión para consultar tus pedidos y
            administrar tu información.
          </p>
        </div>

        <div className="mt-10 grid gap-4">
          <Link
            href="/cuenta/login"
            className="flex items-center gap-4 rounded-xl border bg-card p-6 shadow-sm transition hover:bg-muted/50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border">
              <LogIn className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Iniciar sesión
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Accede a tu cuenta y consulta tus pedidos.
              </p>
            </div>
          </Link>

          <Link
            href="/cuenta/registro"
            className="flex items-center gap-4 rounded-xl border bg-card p-6 shadow-sm transition hover:bg-muted/50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border">
              <UserPlus className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Crear cuenta
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Crea una cuenta para conservar tu historial de
                compras.
              </p>
            </div>
          </Link>

          <Link
            href="/pedido/seguimiento"
            className="flex items-center gap-4 rounded-xl border bg-card p-6 shadow-sm transition hover:bg-muted/50"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border">
              <Package className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold">
                Comprar como invitado
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Consulta una compra utilizando tu código de
                seguimiento.
              </p>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Link>
        </div>
      </div>
    </main>
  );
}