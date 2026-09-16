import Link from "next/link";
import { ArrowLeft, UserRound } from "lucide-react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { AccountDataForm } from "./datos-form";

export default async function AccountDataPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/cuenta/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  const { data: customer } = await supabase
    .from("customers")
    .select("first_name, last_name, phone")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const firstName =
    profile?.first_name ??
    customer?.first_name ??
    "";

  const lastName =
    profile?.last_name ??
    customer?.last_name ??
    "";

  const phone = customer?.phone ?? "";

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            VidaBajoAgua
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Mis datos
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Administra tu información personal y los datos
            de contacto de tu cuenta.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserRound className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold">
                  Información personal
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Mantén tus datos actualizados.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <AccountDataForm
              firstName={firstName}
              lastName={lastName}
              phone={phone}
              email={user.email ?? ""}
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/cuenta"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a mi cuenta
          </Link>
        </div>
      </div>
    </main>
  );
}