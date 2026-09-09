import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AccountLoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión | Mi cuenta",
  description:
    "Inicia sesión en tu cuenta de VidaBajoAgua.",
};

export default function AccountLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            VidaBajoAgua
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Iniciar sesión
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Accede a tu cuenta para consultar tus pedidos y
            administrar tu información.
          </p>
        </div>

        <AccountLoginForm />

        <div className="mt-6 text-center">
          <Link
            href="/cuenta"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Mi cuenta
          </Link>
        </div>
      </div>
    </main>
  );
}
