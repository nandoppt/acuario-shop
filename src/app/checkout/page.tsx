"use client";

import { useState } from "react";

import { CartSummary } from "@/components/cart/cart-summary";
import { PaymentSelector } from "@/components/checkout/payment-selector";

export default function CheckoutPage() {
  const [payment, setPayment] = useState("transferencia");

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
          Checkout
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Finalizar compra
        </h1>

        <p className="mt-3 text-muted-foreground">
          Completa tus datos para generar tu pedido.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">
              Datos del cliente
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                placeholder="Nombres"
                className="rounded-xl border border-border px-4 py-3"
              />

              <input
                placeholder="Apellidos"
                className="rounded-xl border border-border px-4 py-3"
              />

              <input
                placeholder="Teléfono"
                className="rounded-xl border border-border px-4 py-3"
              />

              <input
                placeholder="Correo electrónico"
                className="rounded-xl border border-border px-4 py-3"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">
              Dirección de entrega
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                placeholder="Provincia"
                className="rounded-xl border border-border px-4 py-3"
              />

              <input
                placeholder="Ciudad"
                className="rounded-xl border border-border px-4 py-3"
              />

              <textarea
                placeholder="Dirección completa"
                className="md:col-span-2 rounded-xl border border-border px-4 py-3"
                rows={3}
              />

              <textarea
                placeholder="Referencia (opcional)"
                className="md:col-span-2 rounded-xl border border-border px-4 py-3"
                rows={2}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">
              Método de pago
            </h2>

            <div className="mt-6">
              <PaymentSelector
                value={payment as any}
                onChange={setPayment as any}
              />
            </div>

            {payment === "transferencia" && (
              <div className="mt-6 rounded-xl bg-secondary p-4 text-sm">
                Al confirmar el pedido te mostraremos los datos bancarios y el
                código QR para realizar la transferencia.
              </div>
            )}

            {payment === "efectivo" && (
              <div className="mt-6 rounded-xl bg-secondary p-4 text-sm">
                El pago en efectivo estará disponible únicamente para entregas
                presenciales o puntos acordados.
              </div>
            )}

            {payment === "payphone" && (
              <div className="mt-6 rounded-xl bg-secondary p-4 text-sm">
                En la siguiente etapa recibirás un enlace de pago seguro mediante
                PayPhone.
              </div>
            )}
          </section>
        </div>

        <div>
          <CartSummary />

          <button className="mt-6 w-full rounded-xl bg-primary py-4 font-semibold text-primary-foreground transition hover:opacity-90">
            Confirmar pedido
          </button>
        </div>
      </div>
    </main>
  );
}