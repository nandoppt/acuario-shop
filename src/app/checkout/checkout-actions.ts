"use server";

import { createClient } from "@/lib/supabase/server";
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
  parish: string;
  address: string;
  reference: string;
  payment_method:
    | "transferencia"
    | "efectivo"
    | "payphone";
  shipping_cost: number;
  notes: string;
  items: CheckoutItem[];
  address_id?: string | null;
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

    /*
     * Cliente de servidor:
     * permite conocer al usuario autenticado
     * mediante las cookies de Supabase.
     */
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    /*
     * Cliente administrativo:
     * lo conservamos para ejecutar el RPC actual,
     * que únicamente permite EXECUTE a service_role.
     */
    const admin = createAdminClient();

    /*
     * Por ahora solo obtenemos la identidad.
     * En el siguiente paso la enviaremos al RPC.
     */
    const authUserId = user?.id ?? null;

    console.log(
      "[CHECKOUT] authUserId:",
      authUserId,
    );

    const { data, error } =
  await admin.rpc(
    "create_pending_order",
    {
      p_first_name: input.first_name,
      p_last_name: input.last_name,
      p_email: input.email,
      p_phone: input.phone,
      p_province: input.province,
      p_city: input.city,
      p_parish: input.parish,
      p_address: input.address,
      p_reference: input.reference,
      p_items: input.items,
      p_payment_method:
        input.payment_method,
      p_shipping_cost:
        input.shipping_cost,
      p_notes: input.notes,
      p_auth_user_id: authUserId,
      p_address_id: input.address_id ?? null,
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