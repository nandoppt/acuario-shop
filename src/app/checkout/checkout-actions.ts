"use server";

import { createAdminClient } from "@/lib/supabase/admin";

type CheckoutItem = {
  product_id: string;
  quantity: number;
};

type CreateOrderInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  reference: string;
  payment_method:
    | "transferencia"
    | "efectivo"
    | "payphone";
  shipping_cost: number;
  notes: string;
  items: CheckoutItem[];
};

export async function createPendingOrder(
  input: CreateOrderInput,
) {
  try {
    if (!input.items.length) {
      return {
        success: false,
        error: "El carrito está vacío.",
      };
    }

    const supabase = createAdminClient();

    const { data, error } =
      await supabase.rpc(
        "create_pending_order",
        {
          p_first_name: input.first_name,
          p_last_name: input.last_name,
          p_email: input.email,
          p_phone: input.phone,
          p_province: input.province,
          p_city: input.city,
          p_address: input.address,
          p_reference: input.reference,
          p_items: input.items,
          p_payment_method:
            input.payment_method,
          p_shipping_cost:
            input.shipping_cost,
          p_notes: input.notes,
        },
      );

    if (error) {
      console.error(
        "[CHECKOUT] RPC error:",
        error,
      );

      return {
        success: false,
        error:
          error.message ||
          "No se pudo crear el pedido.",
      };
    }

    return {
      success: true,
      order: data,
    };
  } catch (error) {
    console.error(
      "[CHECKOUT] Unexpected error:",
      error,
    );

    return {
      success: false,
      error:
        "Ocurrió un error al crear el pedido.",
    };
  }
}