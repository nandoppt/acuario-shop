import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Package } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // El usuario debe estar autenticado
  if (!user) {
    redirect("/cuenta/login");
  }

  // Obtener el customer asociado al usuario autenticado
  const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (customerError) {
    console.error("Error al obtener customer:", customerError);
  }

  // Si todavía no existe un customer, mostrar estado vacío
  if (!customer) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
              VidaBajoAgua
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight">
              Mis pedidos
            </h1>

            <p className="mt-3 text-muted-foreground">
              Aún no tienes pedidos.
            </p>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Ir a la tienda
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/cuenta"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a mi cuenta
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Obtener los pedidos del customer
  const { data: orders, error: ordersError } = await supabase
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
        order_items (
          id,
          product_name,
          unit_price,
          quantity,
          subtotal
        )
      `,
    )
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Error al obtener pedidos:", ordersError);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            VidaBajoAgua
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Mis pedidos
          </h1>

          <p className="mt-3 text-muted-foreground">
            Historial de tus compras y estado de tus pedidos.
          </p>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="mt-10 rounded-2xl border bg-card p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border">
              <Package className="h-6 w-6" />
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              Aún no tienes pedidos
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Cuando realices tu primera compra, aparecerá aquí.
            </p>

            <Link
              href="/tienda"
              className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="mt-10 space-y-5">
            {orders.map((order) => (
              <article
                key={order.id}
                className="rounded-2xl border bg-card p-6 shadow-sm"
              >
                <div className="flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Pedido #{order.order_number}
                    </p>

                    <p className="mt-1 text-sm">
                      {new Date(order.created_at).toLocaleDateString(
                        "es-EC",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>

                  <span className="inline-flex w-fit rounded-full border px-3 py-1 text-xs font-medium capitalize">
                    {order.status}
                  </span>
                </div>

                <div className="divide-y">
                  {order.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">
                          {item.product_name}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {item.quantity} × $
                          {Number(item.unit_price).toFixed(2)}
                        </p>
                      </div>

                      <p className="shrink-0 text-sm font-medium">
                        ${Number(item.subtotal).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 border-t pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal
                    </span>
                    <span>
                      ${Number(order.subtotal).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Envío
                    </span>
                    <span>
                      ${Number(order.shipping_cost).toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <span className="font-semibold">
                      Total
                    </span>

                    <span className="text-lg font-semibold">
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/cuenta"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a mi cuenta
          </Link>
        </div>
      </div>
    </main>
  );
}