"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getCustomers() {
  const supabase = createAdminClient();

  const { data: customers, error } = await supabase
    .from("customers")
    .select(`
      id,
      first_name,
      last_name,
      email,
      phone,
      auth_user_id,
      created_at,
      updated_at,
      orders (
        id,
        order_number,
        status,
        total,
        created_at
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "[CUSTOMERS] Error loading customers:",
      error,
    );

    return {
      success: false,
      error:
        "No se pudieron cargar los clientes.",
    };
  }

  const normalizedCustomers =
    (customers ?? []).map((customer) => ({
      ...customer,
      orders: customer.orders ?? [],
    }));

  return {
    success: true,
    customers: normalizedCustomers,
  };
}