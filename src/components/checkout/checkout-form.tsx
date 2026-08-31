"use client";

import { FormEvent, useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import { useCart } from "@/components/cart/cart-context";
import { CartSummary } from "@/components/cart/cart-summary";
import { PaymentSelector } from "@/components/checkout/payment-selector";
import { createPendingOrder } from "@/app/checkout/checkout-actions";

type PaymentMethod =
  | "transferencia"
  | "efectivo"
  | "payphone";

export function CheckoutForm() {
  const router = useRouter();

  const {
    items,
    clearCart,
  } = useCart();

  const [payment, setPayment] =
    useState<PaymentMethod>("transferencia");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    province: "",
    city: "",
    address: "",
    reference: "",
    notes: "",
  });

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (items.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    setLoading(true);

    try {
      const result =
        await createPendingOrder({
          ...form,

          payment_method: payment,

          shipping_cost: 0,

          items: items.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
        });

      if (!result.success) {
        setError(
          result.error ||
            "No se pudo crear el pedido.",
        );
        return;
      }

      clearCart();

      sessionStorage.setItem(
        "vidabajoagua-last-order",
        JSON.stringify(result.order),
      );

      router.push(
        `/pedido/confirmado/${result.order.order_id}`,
      );
    } catch (error) {
      console.error(
        "[CHECKOUT]",
        error,
      );

      setError(
        "No se pudo completar el pedido. Inténtalo nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16">
        <div className="text-center">
          <ShoppingBag
            className="mx-auto text-primary"
            size={48}
          />

          <h1 className="mt-6 text-3xl font-semibold">
            Tu carrito está vacío
          </h1>

          <p className="mt-3 text-muted-foreground">
            Agrega productos antes de
            continuar con tu compra.
          </p>
        </div>
      </main>
    );
  }

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

      <form
        onSubmit={handleSubmit}
        className="grid gap-10 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-8">

          {/* Datos del cliente */}

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">
              Datos del cliente
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                required
                value={form.first_name}
                onChange={(event) =>
                  updateField(
                    "first_name",
                    event.target.value,
                  )
                }
                placeholder="Nombres"
                className="h-12 rounded-xl border border-border bg-background px-4"
              />

              <input
                required
                value={form.last_name}
                onChange={(event) =>
                  updateField(
                    "last_name",
                    event.target.value,
                  )
                }
                placeholder="Apellidos"
                className="h-12 rounded-xl border border-border bg-background px-4"
              />

              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  updateField(
                    "phone",
                    event.target.value,
                  )
                }
                placeholder="Teléfono"
                className="h-12 rounded-xl border border-border bg-background px-4"
              />

              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  updateField(
                    "email",
                    event.target.value,
                  )
                }
                placeholder="Correo electrónico"
                className="h-12 rounded-xl border border-border bg-background px-4"
              />
            </div>
          </section>

          {/* Dirección */}

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">
              Dirección de entrega
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input
                required
                value={form.province}
                onChange={(event) =>
                  updateField(
                    "province",
                    event.target.value,
                  )
                }
                placeholder="Provincia"
                className="h-12 rounded-xl border border-border bg-background px-4"
              />

              <input
                required
                value={form.city}
                onChange={(event) =>
                  updateField(
                    "city",
                    event.target.value,
                  )
                }
                placeholder="Ciudad"
                className="h-12 rounded-xl border border-border bg-background px-4"
              />

              <textarea
                required
                value={form.address}
                onChange={(event) =>
                  updateField(
                    "address",
                    event.target.value,
                  )
                }
                placeholder="Dirección completa"
                rows={3}
                className="md:col-span-2 rounded-xl border border-border bg-background px-4 py-3"
              />

              <textarea
                value={form.reference}
                onChange={(event) =>
                  updateField(
                    "reference",
                    event.target.value,
                  )
                }
                placeholder="Referencia (opcional)"
                rows={2}
                className="md:col-span-2 rounded-xl border border-border bg-background px-4 py-3"
              />

              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateField(
                    "notes",
                    event.target.value,
                  )
                }
                placeholder="Observaciones del pedido (opcional)"
                rows={2}
                className="md:col-span-2 rounded-xl border border-border bg-background px-4 py-3"
              />
            </div>
          </section>

          {/* Método de pago */}

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">
              Método de pago
            </h2>

            <div className="mt-6">
              <PaymentSelector
                value={payment}
                onChange={setPayment}
              />
            </div>

            {payment === "transferencia" && (
              <div className="mt-6 rounded-xl bg-secondary p-4 text-sm">
                Al generar el pedido te
                mostraremos los datos bancarios
                y el código QR para realizar la
                transferencia.
              </div>
            )}

            {payment === "efectivo" && (
              <div className="mt-6 rounded-xl bg-secondary p-4 text-sm">
                El pago en efectivo estará
                disponible para entregas
                presenciales o puntos acordados.
              </div>
            )}

            {payment === "payphone" && (
              <div className="mt-6 rounded-xl bg-secondary p-4 text-sm">
                Después de generar el pedido
                podremos enviarte el enlace de
                pago mediante PayPhone.
              </div>
            )}
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-4 text-sm text-destructive"
            >
              {error}
            </div>
          )}
        </div>

        {/* Resumen */}

        <div>
          <CartSummary />

          <button
            type="submit"
            disabled={loading}
            className="mt-6 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />
                Generando pedido...
              </>
            ) : (
              "Confirmar pedido"
            )}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            Tu pedido se creará como pendiente de
            pago. El stock se descontará cuando
            confirmemos el pago.
          </p>
        </div>
      </form>
    </main>
  );
}
