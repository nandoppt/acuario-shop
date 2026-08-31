"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type MovementType =
  | "initial"
  | "purchase"
  | "sale"
  | "adjustment"
  | "damage"
  | "return";

type InventoryActionResult = {
  success: boolean;
  error?: string;
  quantity?: number;
};

export async function applyInventoryMovement(
  productId: string,
  quantityChange: number,
  movementType: MovementType,
  reason?: string,
  referenceId?: string,
): Promise<InventoryActionResult> {
  // Cliente con sesión del usuario
  const supabase = await createClient();

  // Verificar sesión
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      error: "No estás autenticado.",
    };
  }

  // Verificar que sea administrador
  const { data: profile, error: profileError } =
    await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

  if (profileError) {
    return {
      success: false,
      error:
        "No se pudo verificar el perfil del usuario.",
    };
  }

  if (profile?.role !== "admin") {
    return {
      success: false,
      error:
        "No tienes permisos para modificar el inventario.",
    };
  }

  // Validaciones
  if (!Number.isInteger(quantityChange)) {
    return {
      success: false,
      error: "La cantidad debe ser un número entero.",
    };
  }

  if (quantityChange === 0) {
    return {
      success: false,
      error:
        "La cantidad del movimiento no puede ser 0.",
    };
  }

  const validMovementTypes: MovementType[] = [
    "initial",
    "purchase",
    "sale",
    "adjustment",
    "damage",
    "return",
  ];

  if (!validMovementTypes.includes(movementType)) {
    return {
      success: false,
      error: "Tipo de movimiento no válido.",
    };
  }

  // Cliente privilegiado SOLO en servidor
  const adminSupabase = createAdminClient();

  const { data, error } =
    await adminSupabase.rpc(
      "apply_inventory_movement",
      {
        p_product_id: productId,
        p_quantity_change: quantityChange,
        p_movement_type: movementType,
        p_reason: reason || null,
        p_reference_id: referenceId || null,
      },
    );

  if (error) {
    console.error(
      "[INVENTORY] Error aplicando movimiento:",
      error,
    );

    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath("/admin/inventario");
  revalidatePath("/tienda");

  return {
    success: true,
    quantity: data?.quantity,
  };
}