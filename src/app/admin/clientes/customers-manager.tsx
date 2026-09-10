"use client";

import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Search,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

type Customer = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  auth_user_id: string | null;
  created_at: string;
  updated_at: string;
  orders: {
    id: string;
    order_number: number;
    status: string;
    total: number;
    created_at: string;
  }[];
};

type Props = {
  customers: Customer[];
};

const statusLabels: Record<string, string> = {
  pending: "Pedido recibido",
  confirmed: "Confirmado",
  preparing: "Preparando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function CustomersManager({
  customers,
}: Props) {
  const [search, setSearch] = useState("");
  const [expandedCustomers, setExpandedCustomers] =
    useState<Set<string>>(new Set());

  const filteredCustomers = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    if (!normalizedSearch) {
      return customers;
    }

    return customers.filter((customer) => {
      const fullName =
        `${customer.first_name} ${customer.last_name}`
          .toLowerCase();

      const email =
        customer.email?.toLowerCase() ?? "";

      const phone =
        customer.phone?.toLowerCase() ?? "";

      return (
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch) ||
        phone.includes(normalizedSearch)
      );
    });
  }, [customers, search]);

  function toggleCustomer(customerId: string) {
    setExpandedCustomers((current) => {
      const next = new Set(current);

      if (next.has(customerId)) {
        next.delete(customerId);
      } else {
        next.add(customerId);
      }

      return next;
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Buscar por nombre, correo o teléfono..."
            className="w-full rounded-md border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="border-b px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold">
                Clientes
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {filteredCustomers.length}{" "}
                {filteredCustomers.length === 1
                  ? "cliente"
                  : "clientes"}
              </p>
            </div>
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <UserRound className="mx-auto h-8 w-8 text-muted-foreground" />

            <p className="mt-3 font-medium">
              No encontramos clientes
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Prueba con otro nombre, correo o
              teléfono.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredCustomers.map(
              (customer) => {
                const fullName =
                  `${customer.first_name} ${customer.last_name}`.trim();

                const orderCount =
                  customer.orders.length;

                const totalSpent =
                  customer.orders.reduce(
                    (sum, order) =>
                      sum + Number(order.total),
                    0,
                  );

                const lastOrder =
                  customer.orders[0] ?? null;

                const isRegistered =
                  customer.auth_user_id !== null;

                const isExpanded =
                  expandedCustomers.has(
                    customer.id,
                  );

                return (
                  <div key={customer.id}>
                    <button
                      type="button"
                      onClick={() =>
                        toggleCustomer(
                          customer.id,
                        )
                      }
                      aria-expanded={isExpanded}
                      className="w-full px-6 py-5 text-left transition hover:bg-muted/40"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="mt-0.5 shrink-0 text-muted-foreground">
                            {isExpanded ? (
                              <ChevronDown className="h-5 w-5" />
                            ) : (
                              <ChevronRight className="h-5 w-5" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium">
                                {fullName ||
                                  "Cliente sin nombre"}
                              </p>

                              <span className="rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">
                                {isRegistered
                                  ? "Registrado"
                                  : "Invitado"}
                              </span>
                            </div>

                            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                              {customer.email && (
                                <p>
                                  {customer.email}
                                </p>
                              )}

                              {customer.phone && (
                                <p>
                                  {customer.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-6 text-sm lg:min-w-[360px]">
                          <div>
                            <p className="text-muted-foreground">
                              Pedidos
                            </p>

                            <p className="mt-1 font-medium">
                              {orderCount}
                            </p>
                          </div>

                          <div>
                            <p className="text-muted-foreground">
                              Comprado
                            </p>

                            <p className="mt-1 font-medium">
                              {formatCurrency(
                                totalSpent,
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-muted-foreground">
                              Último pedido
                            </p>

                            {lastOrder ? (
                              <>
                                <p className="mt-1 font-medium">
                                  #
                                  {String(
                                    lastOrder.order_number,
                                  ).padStart(
                                    4,
                                    "0",
                                  )}
                                </p>

                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {formatDate(
                                    lastOrder.created_at,
                                  )}
                                </p>
                              </>
                            ) : (
                              <p className="mt-1 text-muted-foreground">
                                Sin pedidos
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t bg-muted/20 px-6 py-4">
                        {customer.orders.length ===
                        0 ? (
                          <div className="py-4 text-center">
                            <p className="text-sm text-muted-foreground">
                              Este cliente todavía
                              no tiene pedidos.
                            </p>
                          </div>
                        ) : (
                          <div>
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-sm font-medium">
                                Historial de pedidos
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {orderCount}{" "}
                                {orderCount === 1
                                  ? "pedido"
                                  : "pedidos"}
                              </p>
                            </div>

                            <div className="overflow-hidden rounded-lg border bg-card">
                              <div className="divide-y">
                                {customer.orders.map(
                                  (order) => (
                                    <Link
                                      key={
                                        order.id
                                      }
                                      href={`/admin/pedidos/${order.id}`}
                                      className="flex flex-col gap-3 px-4 py-4 transition hover:bg-muted/40 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                      <div>
                                        <p className="font-medium">
                                          Pedido #
                                          {String(
                                            order.order_number,
                                          ).padStart(
                                            4,
                                            "0",
                                          )}
                                        </p>

                                        <p className="mt-1 text-sm text-muted-foreground">
                                          {formatDate(
                                            order.created_at,
                                          )}
                                        </p>
                                      </div>

                                      <div className="flex items-center justify-between gap-6 sm:justify-end">
                                        <span className="text-sm text-muted-foreground">
                                          {statusLabels[
                                            order.status
                                          ] ??
                                            order.status}
                                        </span>

                                        <span className="font-medium">
                                          {formatCurrency(
                                            Number(
                                              order.total,
                                            ),
                                          )}
                                        </span>
                                      </div>
                                    </Link>
                                  ),
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
}