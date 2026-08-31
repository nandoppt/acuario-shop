import { createClient } from "@/lib/supabase/server";

import { OrdersManager } from "./orders-manager";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const supabase = await createClient();

  const { data: orders, error } =
    await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        subtotal,
        shipping_cost,
        total,
        notes,
        created_at,
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
          id,
          payment_method,
          payment_status,
          amount,
          transaction_reference,
          created_at
        )
      `)
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw new Error(
      `No se pudieron cargar los pedidos: ${error.message}`,
    );
  }

  const normalizedOrders =
    (orders ?? []).map((order) => ({
      ...order,

      customers: Array.isArray(order.customers)
        ? order.customers[0] ?? null
        : order.customers,

      addresses: Array.isArray(order.addresses)
        ? order.addresses[0] ?? null
        : order.addresses,

      payments: Array.isArray(order.payments)
        ? order.payments[0] ?? null
        : order.payments,

      order_items: order.order_items ?? [],
    }));

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Administración
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Pedidos
        </h1>

        <p className="mt-2 text-muted-foreground">
          Gestiona los pedidos y verifica sus pagos.
        </p>
      </div>

      <OrdersManager
        orders={normalizedOrders}
      />
    </div>
  );
}