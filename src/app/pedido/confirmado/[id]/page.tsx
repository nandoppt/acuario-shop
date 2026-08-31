import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
} from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PedidoConfirmadoPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase = createAdminClient();

  const { data: order } =
    await supabase
      .from("orders")
      .select(
        `
          id,
          order_number,
          status,
          subtotal,
          shipping_cost,
          total,
          created_at,
          notes,
          customers (
            first_name,
            last_name,
            email,
            phone
          ),
          addresses (
            province,
            city,
            address,
            reference
          ),
          order_items (
            id,
            product_name,
            unit_price,
            quantity,
            subtotal
          ),
          payments (
            payment_method,
            payment_status,
            amount,
            transaction_reference
          )
        `,
      )
      .eq("id", id)
      .single();

  if (!order) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-16">
        <div className="text-center">
          <Package
            className="mx-auto text-primary"
            size={48}
          />

          <h1 className="mt-6 text-3xl font-semibold">
            Pedido no encontrado
          </h1>

          <p className="mt-3 text-muted-foreground">
            No pudimos encontrar el pedido
            solicitado.
          </p>

          <Link
            href="/tienda"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground"
          >
            <ArrowLeft size={18} />
            Volver a la tienda
          </Link>
        </div>
      </main>
    );
  }

  const customer = Array.isArray(order.customers)
    ? order.customers[0]
    : order.customers;

  const address = Array.isArray(order.addresses)
    ? order.addresses[0]
    : order.addresses;

  const payment = Array.isArray(order.payments)
    ? order.payments[0]
    : order.payments;

  const paymentLabels = {
    transferencia: "Transferencia / QR",
    efectivo: "Pago en efectivo",
    payphone: "Link de PayPhone",
  } as const;

  const paymentLabel =
    payment?.payment_method &&
    payment.payment_method in paymentLabels
      ? paymentLabels[
          payment.payment_method as keyof typeof paymentLabels
        ]
      : payment?.payment_method ?? "No especificado";

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">

      {/* Encabezado */}

      <div className="text-center">
        <CheckCircle2
          className="mx-auto text-primary"
          size={56}
        />

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-primary">
          VidaBajoAgua
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          ¡Pedido recibido!
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Gracias por tu compra,{" "}
          {customer?.first_name ?? "cliente"}.
          Hemos recibido correctamente tu pedido.
        </p>
      </div>

      {/* Número de pedido */}

      <section className="mt-10 rounded-2xl border border-border bg-card p-6 text-center md:p-8">
        <p className="text-sm text-muted-foreground">
          Número de pedido
        </p>

        <p className="mt-2 text-3xl font-semibold">
          #{String(order.order_number).padStart(4, "0")}
        </p>

        <p className="mt-3 text-sm text-muted-foreground">
          Estado:{" "}
          <span className="font-medium text-foreground">
            Pendiente de pago
          </span>
        </p>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">

        {/* Productos */}

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">
            Resumen del pedido
          </h2>

          <div className="mt-6 divide-y divide-border">
            {order.order_items?.map(
              (item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-medium">
                      {item.product_name}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.quantity} × $
                      {Number(
                        item.unit_price,
                      ).toFixed(2)}
                    </p>
                  </div>

                  <p className="font-medium">
                    $
                    {Number(
                      item.subtotal,
                    ).toFixed(2)}
                  </p>
                </div>
              ),
            )}
          </div>

          <div className="mt-4 space-y-3 border-t border-border pt-6 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span>
                $
                {Number(
                  order.subtotal,
                ).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Envío
              </span>

              <span>
                $
                {Number(
                  order.shipping_cost,
                ).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold">
              <span>Total</span>

              <span>
                $
                {Number(
                  order.total,
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {/* Pago */}

        <aside className="space-y-6">

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              Método de pago
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              {paymentLabel}
            </p>

            {payment?.payment_method ===
              "transferencia" && (
              <div className="mt-5 rounded-xl bg-secondary p-4">
                <p className="text-sm font-medium">
                  Completa tu transferencia
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  En la siguiente etapa
                  agregaremos los datos bancarios
                  y el código QR de VidaBajoAgua.
                </p>
              </div>
            )}

            {payment?.payment_method ===
              "efectivo" && (
              <div className="mt-5 rounded-xl bg-secondary p-4 text-sm leading-6 text-muted-foreground">
                El pago se realizará en efectivo
                según la modalidad de entrega
                acordada.
              </div>
            )}

            {payment?.payment_method ===
              "payphone" && (
              <div className="mt-5 rounded-xl bg-secondary p-4 text-sm leading-6 text-muted-foreground">
                Te proporcionaremos el enlace
                de pago mediante PayPhone.
              </div>
            )}
          </section>

          {/* Cliente */}

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              Datos de entrega
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <p>
                {customer?.first_name}{" "}
                {customer?.last_name}
              </p>

              <p className="text-muted-foreground">
                {customer?.phone}
              </p>

              <p className="text-muted-foreground">
                {customer?.email}
              </p>

              {address && (
                <div className="border-t border-border pt-3">
                  <p>
                    {address.address}
                  </p>

                  <p className="mt-1 text-muted-foreground">
                    {address.city},{" "}
                    {address.province}
                  </p>

                  {address.reference && (
                    <p className="mt-1 text-muted-foreground">
                      Ref:{" "}
                      {address.reference}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition hover:opacity-90"
        >
          <ArrowLeft size={18} />
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}