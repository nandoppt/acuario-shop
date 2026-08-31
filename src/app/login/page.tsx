import type { Metadata } from "next";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  description: "Acceso administrativo de VidaBajoAgua.",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            VidaBajoAgua
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Administración
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            Inicia sesión para acceder al panel administrativo.
          </p>
        </div>

        <LoginForm />
      </div>
    </main>
  );
}