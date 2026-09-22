"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type CoverageInput = {
  province: string;
  city: string;
  parish: string;
  shipping_cost: number | null;
  notes: string;
  enabled: boolean;
};

async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("No autenticado.");
  }

  const admin = createAdminClient();

  const { data: profile, error } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || profile?.role !== "admin") {
    throw new Error("No autorizado.");
  }

  return admin;
}

function normalizeInput(input: CoverageInput) {
  return {
    province: input.province.trim(),
    city: input.city.trim(),
    parish: input.parish.trim(),
    shipping_cost:
      input.shipping_cost === null ||
      Number.isNaN(input.shipping_cost)
        ? null
        : Number(input.shipping_cost),
    notes: input.notes.trim(),
    enabled: Boolean(input.enabled),
  };
}

function validateInput(
  input: ReturnType<typeof normalizeInput>,
) {
  if (!input.province) {
    return "La provincia es obligatoria.";
  }

  if (!input.city) {
    return "El cantón es obligatorio.";
  }

  if (!input.parish) {
    return "La parroquia es obligatoria.";
  }

  if (
    input.shipping_cost !== null &&
    input.shipping_cost < 0
  ) {
    return "La tarifa de envío no puede ser negativa.";
  }

  return null;
}

export async function getShippingCoverage() {
  try {
    const admin = await requireAdmin();

    const { data, error } = await admin
      .from("shipping_coverage")
      .select(
        "id, province, city, parish, enabled, shipping_cost, notes, created_at, updated_at",
      )
      .order("province")
      .order("city")
      .order("parish");

    if (error) {
      console.error(
        "[SHIPPING COVERAGE] get error:",
        error,
      );

      return {
        success: false,
        error: "No se pudo cargar la cobertura.",
        coverage: [],
      };
    }

    return {
      success: true,
      coverage: data ?? [],
    };
  } catch (error) {
    console.error(
      "[SHIPPING COVERAGE] get exception:",
      error,
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo cargar la cobertura.",
      coverage: [],
    };
  }
}

export async function createShippingCoverage(
  input: CoverageInput,
) {
  try {
    const admin = await requireAdmin();

    const data = normalizeInput(input);

    const validationError = validateInput(data);

    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    const { data: coverage, error } = await admin
      .from("shipping_coverage")
      .insert({
        province: data.province,
        city: data.city,
        parish: data.parish,
        shipping_cost: data.shipping_cost,
        notes: data.notes || null,
        enabled: data.enabled,
      })
      .select(
        "id, province, city, parish, enabled, shipping_cost, notes, created_at, updated_at",
      )
      .single();

    if (error) {
      console.error(
        "[SHIPPING COVERAGE] create error:",
        error,
      );

      if (error.code === "23505") {
        return {
          success: false,
          error:
            "Esta parroquia ya está registrada en la cobertura.",
        };
      }

      return {
        success: false,
        error:
          "No se pudo crear la zona de cobertura.",
      };
    }

    return {
      success: true,
      coverage,
    };
  } catch (error) {
    console.error(
      "[SHIPPING COVERAGE] create exception:",
      error,
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo crear la zona de cobertura.",
    };
  }
}

export async function updateShippingCoverage(
  id: string,
  input: CoverageInput,
) {
  try {
    const admin = await requireAdmin();

    if (!id) {
      return {
        success: false,
        error: "La zona de cobertura no es válida.",
      };
    }

    const data = normalizeInput(input);

    const validationError = validateInput(data);

    if (validationError) {
      return {
        success: false,
        error: validationError,
      };
    }

    const { data: coverage, error } = await admin
      .from("shipping_coverage")
      .update({
        province: data.province,
        city: data.city,
        parish: data.parish,
        shipping_cost: data.shipping_cost,
        notes: data.notes || null,
        enabled: data.enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id, province, city, parish, enabled, shipping_cost, notes, created_at, updated_at",
      )
      .single();

    if (error) {
      console.error(
        "[SHIPPING COVERAGE] update error:",
        error,
      );

      if (error.code === "23505") {
        return {
          success: false,
          error:
            "Esta parroquia ya está registrada en la cobertura.",
        };
      }

      return {
        success: false,
        error:
          "No se pudo actualizar la zona de cobertura.",
      };
    }

    return {
      success: true,
      coverage,
    };
  } catch (error) {
    console.error(
      "[SHIPPING COVERAGE] update exception:",
      error,
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la zona de cobertura.",
    };
  }
}

export async function toggleShippingCoverage(
  id: string,
  enabled: boolean,
) {
  try {
    const admin = await requireAdmin();

    if (!id) {
      return {
        success: false,
        error: "La zona de cobertura no es válida.",
      };
    }

    const { data: coverage, error } = await admin
      .from("shipping_coverage")
      .update({
        enabled,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select(
        "id, province, city, parish, enabled, shipping_cost, notes, created_at, updated_at",
      )
      .single();

    if (error) {
      console.error(
        "[SHIPPING COVERAGE] toggle error:",
        error,
      );

      return {
        success: false,
        error:
          "No se pudo actualizar el estado de la cobertura.",
      };
    }

    return {
      success: true,
      coverage,
    };
  } catch (error) {
    console.error(
      "[SHIPPING COVERAGE] toggle exception:",
      error,
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el estado.",
    };
  }
}

export async function deleteShippingCoverage(
  id: string,
) {
  try {
    const admin = await requireAdmin();

    if (!id) {
      return {
        success: false,
        error: "La zona de cobertura no es válida.",
      };
    }

    const { error } = await admin
      .from("shipping_coverage")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "[SHIPPING COVERAGE] delete error:",
        error,
      );

      return {
        success: false,
        error:
          "No se pudo eliminar la zona de cobertura.",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "[SHIPPING COVERAGE] delete exception:",
      error,
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la zona de cobertura.",
    };
  }
}