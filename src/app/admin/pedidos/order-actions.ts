"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type ConfirmOrderPaymentResult = {
  success: boolean;
  message: string;
};

export async function confirmOrderPayment(
  orderId: string,
  paymentId: string,
  transactionReference?: string,
): Promise<ConfirmOrderPaymentResult> {
  /*
   * Cliente normal:
   * se utiliza únicamente para comprobar
   * la sesión y los permisos del administrador.
   */
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "No estás autenticado.",
    };
  }

  /*
   * Verificar que el usuario sea administrador.
   */
  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

  if (
    profileError ||
    profile?.role !== "admin"
  ) {
    return {
      success: false,
      message:
        "No tienes permisos para confirmar pagos.",
    };
  }

  /*
   * Validaciones básicas.
   */
  if (!orderId || !paymentId) {
    return {
      success: false,
      message:
        "Faltan datos del pedido o del pago.",
    };
  }

  try {
    /*
     * Cliente administrativo:
     * el RPC solo permite EXECUTE a service_role.
     */
    const adminSupabase =
      createAdminClient();

    const { data, error } =
      await adminSupabase.rpc(
        "confirm_order_payment",
        {
          p_order_id: orderId,
          p_payment_id: paymentId,
          p_transaction_reference:
            transactionReference?.trim() || null,
        },
      );

    if (error) {
      console.error(
        "Error confirmando pago:",
        error,
      );

      return {
        success: false,
        message: error.message,
      };
    }

    if (!data?.success) {
      return {
        success: false,
        message:
          data?.message ??
          "No se pudo confirmar el pago.",
      };
    }

    return {
      success: true,
      message:
        "Pago confirmado correctamente.",
    };
  } catch (error) {
    console.error(
      "Error inesperado confirmando pago:",
      error,
    );

    return {
      success: false,
      message:
        "Ocurrió un error inesperado.",
    };
  }
}
export async function updateOrderStatus(
  orderId: string,
  newStatus: string,
): Promise<{
  success: boolean;
  message: string;
}> {
  const supabase = await createClient();

  /*
   * Verificar sesión
   */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      message: "No estás autenticado.",
    };
  }

  /*
   * Verificar administrador
   */
  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

  if (
    profileError ||
    profile?.role !== "admin"
  ) {
    return {
      success: false,
      message:
        "No tienes permisos para cambiar el estado del pedido.",
    };
  }

  /*
   * Estados permitidos
   */
  const allowedStatuses = [
    "preparing",
    "shipped",
    "delivered",
  ];

  if (!allowedStatuses.includes(newStatus)) {
    return {
      success: false,
      message: "Estado de pedido no válido.",
    };
  }

  if (!orderId) {
    return {
      success: false,
      message: "Falta el pedido.",
    };
  }

  try {
    /*
     * Cliente administrativo.
     * Solo se utiliza en el servidor.
     */
    const adminSupabase =
      createAdminClient();

    /*
     * Obtener estado actual
     */
    const { data: order, error: orderError } =
      await adminSupabase
        .from("orders")
        .select("id, status")
        .eq("id", orderId)
        .maybeSingle();

    if (orderError) {
      console.error(
        "Error obteniendo pedido:",
        orderError,
      );

      return {
        success: false,
        message:
          "No se pudo consultar el pedido.",
      };
    }

    if (!order) {
      return {
        success: false,
        message: "Pedido no encontrado.",
      };
    }

    /*
     * Transiciones permitidas.
     */
    const validTransitions: Record<
      string,
      string
    > = {
      confirmed: "preparing",
      preparing: "shipped",
      shipped: "delivered",
    };

    const expectedNext =
      validTransitions[order.status];

    if (expectedNext !== newStatus) {
      return {
        success: false,
        message: `No se puede cambiar de "${order.status}" a "${newStatus}".`,
      };
    }

    /*
     * Actualizar estado.
     *
     * IMPORTANTE:
     * aquí NO modificamos inventario.
     */
    const { error: updateError } =
      await adminSupabase
        .from("orders")
        .update({
          status: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

    if (updateError) {
      console.error(
        "Error actualizando estado:",
        updateError,
      );

      return {
        success: false,
        message:
          "No se pudo actualizar el estado del pedido.",
      };
    }

    return {
      success: true,
      message:
        "Estado del pedido actualizado correctamente.",
    };
  } catch (error) {
    console.error(
      "Error inesperado actualizando pedido:",
      error,
    );

    return {
      success: false,
      message:
        "Ocurrió un error inesperado.",
    };
  }
}