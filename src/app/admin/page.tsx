import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Clock3,
  Image,
  Package,
  ShoppingBag,
  Tags,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

const LOW_STOCK_THRESHOLD = 3;

function formatCurrency(value: number) {
  return `$${Number(value).toFixed(2)}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Guayaquil",
  }).format(new Date(value));
}

function getOrderStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmado",
    preparing: "Preparando",
    shipped: "Enviado",
    delivered: "Entregado",
    cancelled: "Cancelado",
  };

  return labels[status] ?? status;
}

function getOrderStatusClass(status: string) {
  const classes: Record<string, string> = {
    pending:
      "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    confirmed:
      "bg-primary/10 text-primary",
    preparing:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    shipped:
      "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    delivered:
      "bg-green-500/10 text-green-700 dark:text-green-400",
    cancelled:
      "bg-destructive/10 text-destructive",
  };

  return (
    classes[status] ??
    "bg-muted text-muted-foreground"
  );
}

export default async function AdminPage() {
  const supabase = await createClient();

  /*
   * Pedidos
   */
  const { count: totalOrders } =
    await supabase
      .from("orders")
      .select("id", {
        count: "exact",
        head: true,
      });

  const { count: pendingOrders } =
    await supabase
      .from("orders")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "pending");

  /*
   * Pagos confirmados
   */
  const { data: paidPayments } =
    await supabase
      .from("payments")
      .select("amount")
      .eq("payment_status", "paid");

  const confirmedSales =
    paidPayments?.reduce(
      (total, payment) =>
        total + Number(payment.amount),
      0,
    ) ?? 0;

  /*
   * Pedidos recientes
   */
  const { data: recentOrders } =
    await supabase
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        total,
        created_at,
        customers (
          first_name,
          last_name
        ),
        payments (
          payment_status
        )
      `)
      .order("created_at", {
        ascending: false,
      })
      .limit(5);

  /*
   * Productos + inventario
   */
  const { data: products } =
    await supabase
      .from("products")
      .select(`
        id,
        name,
        sku,
        is_active,
        inventory (
          quantity
        )
      `)
      .eq("is_active", true)
      .order("name", {
        ascending: true,
      });

  const inventoryProducts = (
    products ?? []
  ).map((product) => {
    const inventory = Array.isArray(
      product.inventory,
    )
      ? product.inventory[0] ?? null
      : product.inventory;

    return {
      ...product,
      quantity:
        inventory?.quantity ?? 0,
    };
  });

  const lowStockProducts =
    inventoryProducts
      .filter(
        (product) =>
          product.quantity <=
          LOW_STOCK_THRESHOLD,
      )
      .sort(
        (a, b) =>
          a.quantity - b.quantity,
      );

  const outOfStockProducts =
    lowStockProducts.filter(
      (product) =>
        product.quantity <= 0,
    );

  const lowStockOnly =
    lowStockProducts.filter(
      (product) =>
        product.quantity > 0,
    );

  /*
   * Normalizar pedidos recientes
   */
  const normalizedRecentOrders = (
    recentOrders ?? []
  ).map((order) => {
    const customer = Array.isArray(
      order.customers,
    )
      ? order.customers[0] ?? null
      : order.customers;

    const payment = Array.isArray(
      order.payments,
    )
      ? order.payments[0] ?? null
      : order.payments;

    const customerName = customer
      ? `${customer.first_name} ${customer.last_name}`
      : "Cliente";

    return {
      ...order,
      customerName,
      paymentStatus:
        payment?.payment_status ??
        "pending",
    };
  });

  const cards = [
    {
      title: "Pedidos",
      value: totalOrders ?? 0,
      description:
        "Pedidos registrados",
      icon: ShoppingBag,
      href: "/admin/pedidos",
    },
    {
      title: "Pendientes",
      value: pendingOrders ?? 0,
      description:
        "Requieren revisión",
      icon: Clock3,
      href: "/admin/pedidos",
    },
    {
      title: "Productos",
      value:
        inventoryProducts.length,
      description:
        "Productos activos",
      icon: Package,
      href: "/admin/productos",
    },
    {
      title: "Ventas confirmadas",
      value:
        formatCurrency(
          confirmedSales,
        ),
      description:
        "Pagos confirmados",
      icon: TrendingUp,
      href: "/admin/pedidos",
    },
    
  ];

  return (
    <div className="mx-auto max-w-7xl">
      {/* Encabezado */}
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
          VidaBajoAgua
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Resumen general de pedidos,
          ventas e inventario.
        </p>
      </div>

      {/* Métricas */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-2xl border border-border bg-background p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Icon size={20} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-muted-foreground transition-transform group-hover:translate-x-1"
                />
              </div>

              <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {card.title}
              </p>

              <p className="mt-2 text-2xl font-semibold tracking-tight">
                {card.value}
              </p>

              <p className="mt-2 text-sm text-muted-foreground">
                {card.description}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Contenido principal */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Pedidos recientes */}
        <section className="rounded-2xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold">
                Pedidos recientes
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Últimos pedidos registrados.
              </p>
            </div>

            <Link
              href="/admin/pedidos"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Ver todos
              <ArrowRight size={16} />
            </Link>
          </div>

          {normalizedRecentOrders.length ===
          0 ? (
            <div className="p-10 text-center">
              <ShoppingBag
                className="mx-auto text-muted-foreground"
                size={36}
              />

              <p className="mt-4 font-medium">
                No hay pedidos todavía
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Los pedidos de la tienda
                aparecerán aquí.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {normalizedRecentOrders.map(
                (order) => (
                  <Link
                    key={order.id}
                    href={`/admin/pedidos/${order.id}`}
                    className="block px-6 py-5 transition hover:bg-muted/40"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-semibold">
                            #{String(
                              order.order_number,
                            ).padStart(4, "0")}
                          </span>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getOrderStatusClass(
                              order.status,
                            )}`}
                          >
                            {getOrderStatusLabel(
                              order.status,
                            )}
                          </span>
                        </div>

                        <p className="mt-1 text-sm">
                          {order.customerName}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(
                            order.created_at,
                          )}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-6 sm:block sm:text-right">
                        <p className="text-lg font-semibold">
                          {formatCurrency(
                            order.total,
                          )}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {order.paymentStatus ===
                          "paid"
                            ? "Pagado"
                            : "Pago pendiente"}
                        </p>
                      </div>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}
        </section>

        {/* Inventario */}
        <section className="rounded-2xl border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold">
                Inventario
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Productos que requieren atención.
              </p>
            </div>

            <Link
              href="/admin/inventario"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              Ver stock
              <ArrowRight size={16} />
            </Link>
          </div>

          {lowStockProducts.length ===
          0 ? (
            <div className="p-10 text-center">
              <CheckCircle2
                className="mx-auto text-primary"
                size={36}
              />

              <p className="mt-4 font-medium">
                Inventario saludable
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                No hay productos con stock
                bajo.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {lowStockProducts.map(
                (product) => {
                  const outOfStock =
                    product.quantity <= 0;

                  return (
                    <Link
                      key={product.id}
                      href={`/admin/productos/${product.id}/editar`}
                      className="block px-6 py-4 transition hover:bg-muted/40"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            outOfStock
                              ? "bg-destructive/10 text-destructive"
                              : "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
                          }`}
                        >
                          {outOfStock ? (
                            <AlertTriangle
                              size={19}
                            />
                          ) : (
                            <Boxes size={19} />
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">
                            {product.name}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {outOfStock
                              ? "Agotado"
                              : "Stock bajo"}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 text-sm font-semibold ${
                            outOfStock
                              ? "text-destructive"
                              : "text-yellow-700 dark:text-yellow-400"
                          }`}
                        >
                          {product.quantity}
                        </span>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          )}
        </section>
      </div>

      {/* Accesos rápidos */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            Administración
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Accesos rápidos al catálogo.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/admin/productos"
            className="group rounded-2xl border border-border bg-background p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Package
              className="text-primary"
              size={22}
            />

            <h3 className="mt-5 font-semibold">
              Productos
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Crear, editar y administrar
              productos.
            </p>
          </Link>

          <Link
            href="/admin/inventario"
            className="group rounded-2xl border border-border bg-background p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Boxes
              className="text-primary"
              size={22}
            />

            <h3 className="mt-5 font-semibold">
              Inventario
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Controlar existencias y
              movimientos.
            </p>
          </Link>

          <Link
            href="/admin/categorias"
            className="group rounded-2xl border border-border bg-background p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Tags
              className="text-primary"
              size={22}
            />

            <h3 className="mt-5 font-semibold">
              Categorías
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Organizar el catálogo.
            </p>
          </Link>

          <Link
            href="/admin/imagenes"
            className="group rounded-2xl border border-border bg-background p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <Image
              className="text-primary"
              size={22}
            />

            <h3 className="mt-5 font-semibold">
              Imágenes
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Gestionar imágenes de productos.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}