"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function getOrderByTrackingToken(
  trackingToken: string,
) {
  const token = trackingToken.trim();

  if (!token) {
    return {
      success: false,
      error: "Ingresa tu código de seguimiento.",
    };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      subtotal,
      shipping_cost,
      total,
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
        payment_method,
        payment_status,
        amount,
        transaction_reference
      )
    `)
    .eq("tracking_token", token)
    .single();

  if (error || !data) {
    return {
      success: false,
      error: "No encontramos un pedido con ese código de seguimiento.",
    };
  }

  return {
    success: true,
    order: data,
  };
}