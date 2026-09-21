"use server";

import { createAdminClient } from "@/lib/supabase/admin";

type CategoryInput = {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
};

function normalizeInput(input: CategoryInput): CategoryInput {
  return {
    name: input.name.trim(),
    slug: input.slug.trim().toLowerCase(),
    description: input.description.trim(),
    image_url: input.image_url.trim(),
    is_active: input.is_active,
    sort_order: Number(input.sort_order) || 0,
  };
}

function validateInput(input: CategoryInput) {
  if (!input.name) {
    return "El nombre de la categoría es obligatorio.";
  }

  if (!input.slug) {
    return "El slug de la categoría es obligatorio.";
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
    return "El slug solo puede contener letras minúsculas, números y guiones.";
  }

  if (input.sort_order < 0) {
    return "El orden no puede ser negativo.";
  }

  return null;
}

export async function createCategory(input: CategoryInput) {
  const admin = createAdminClient();
  const normalized = normalizeInput(input);

  const validationError = validateInput(normalized);

  if (validationError) {
    return {
      success: false,
      message: validationError,
    };
  }

  const { data: existingSlug, error: slugError } = await admin
    .from("categories")
    .select("id")
    .eq("slug", normalized.slug)
    .maybeSingle();

  if (slugError) {
    console.error("Error checking category slug:", slugError);

    return {
      success: false,
      message: "No se pudo validar el slug de la categoría.",
    };
  }

  if (existingSlug) {
    return {
      success: false,
      message: "Ya existe una categoría con ese slug.",
    };
  }

  const { data, error } = await admin
    .from("categories")
    .insert({
      name: normalized.name,
      slug: normalized.slug,
      description: normalized.description || null,
      image_url: normalized.image_url || null,
      is_active: normalized.is_active,
      sort_order: normalized.sort_order,
    })
    .select(
      "id, name, slug, description, image_url, is_active, sort_order, created_at, updated_at",
    )
    .single();

  if (error) {
    console.error("Error creating category:", error);

    return {
      success: false,
      message: "No se pudo crear la categoría.",
    };
  }

  return {
    success: true,
    message: "Categoría creada correctamente.",
    category: data,
  };
}

export async function updateCategory(
  categoryId: string,
  input: CategoryInput,
) {
  const admin = createAdminClient();
  const normalized = normalizeInput(input);

  const validationError = validateInput(normalized);

  if (validationError) {
    return {
      success: false,
      message: validationError,
    };
  }

  const { data: existingCategory, error: categoryError } = await admin
    .from("categories")
    .select("id")
    .eq("id", categoryId)
    .maybeSingle();

  if (categoryError || !existingCategory) {
    return {
      success: false,
      message: "La categoría no existe.",
    };
  }

  const { data: existingSlug, error: slugError } = await admin
    .from("categories")
    .select("id")
    .eq("slug", normalized.slug)
    .neq("id", categoryId)
    .maybeSingle();

  if (slugError) {
    console.error("Error checking category slug:", slugError);

    return {
      success: false,
      message: "No se pudo validar el slug de la categoría.",
    };
  }

  if (existingSlug) {
    return {
      success: false,
      message: "Ya existe otra categoría con ese slug.",
    };
  }

  const { data, error } = await admin
    .from("categories")
    .update({
      name: normalized.name,
      slug: normalized.slug,
      description: normalized.description || null,
      image_url: normalized.image_url || null,
      is_active: normalized.is_active,
      sort_order: normalized.sort_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", categoryId)
    .select(
      "id, name, slug, description, image_url, is_active, sort_order, created_at, updated_at",
    )
    .single();

  if (error) {
    console.error("Error updating category:", error);

    return {
      success: false,
      message: "No se pudo actualizar la categoría.",
    };
  }

  return {
    success: true,
    message: "Categoría actualizada correctamente.",
    category: data,
  };
}

export async function toggleCategoryStatus(
  categoryId: string,
  isActive: boolean,
) {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("categories")
    .update({
      is_active: isActive,
      updated_at: new Date().toISOString(),
    })
    .eq("id", categoryId)
    .select(
      "id, name, slug, description, image_url, is_active, sort_order, created_at, updated_at",
    )
    .single();

  if (error) {
    console.error("Error updating category status:", error);

    return {
      success: false,
      message: "No se pudo actualizar el estado de la categoría.",
    };
  }

  return {
    success: true,
    message: isActive
      ? "Categoría activada correctamente."
      : "Categoría desactivada correctamente.",
    category: data,
  };
}

export async function deleteCategory(categoryId: string) {
  const admin = createAdminClient();

  const { count, error: countError } = await admin
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("category_id", categoryId);

  if (countError) {
    console.error("Error checking category products:", countError);

    return {
      success: false,
      message: "No se pudo comprobar si la categoría tiene productos.",
    };
  }

  if ((count ?? 0) > 0) {
    return {
      success: false,
      message:
        "No puedes eliminar esta categoría porque tiene productos asociados. Puedes desactivarla.",
    };
  }

  const { error } = await admin
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (error) {
    console.error("Error deleting category:", error);

    return {
      success: false,
      message: "No se pudo eliminar la categoría.",
    };
  }

  return {
    success: true,
    message: "Categoría eliminada correctamente.",
  };
}