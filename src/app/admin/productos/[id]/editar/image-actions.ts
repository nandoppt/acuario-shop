"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

const BUCKET_NAME = "product-images";

type ActionResult = {
  success: boolean;
  error?: string;
};

async function verifyAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      user: null,
      error: "No estás autenticado.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return {
      supabase,
      user,
      error: "No tienes permisos de administrador.",
    };
  }

  return {
    supabase,
    user,
    error: null,
  };
}

export async function uploadProductImage(
  productId: string,
  productSlug: string,
  formData: FormData,
): Promise<ActionResult> {
  const { supabase, error: authError } =
    await verifyAdmin();

  if (authError) {
    return {
      success: false,
      error: authError,
    };
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return {
      success: false,
      error: "No se recibió ninguna imagen.",
    };
  }

  if (file.size === 0) {
    return {
      success: false,
      error: "La imagen está vacía.",
    };
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      error:
        "Formato no permitido. Usa JPG, PNG, WEBP o AVIF.",
    };
  }

  const MAX_SIZE = 5 * 1024 * 1024;

  if (file.size > MAX_SIZE) {
    return {
      success: false,
      error: "La imagen no puede superar los 5 MB.",
    };
  }

  const { data: existingImages, error: imagesError } =
    await supabase
      .from("product_images")
      .select("id, sort_order")
      .eq("product_id", productId)
      .order("sort_order", {
        ascending: false,
      });

  if (imagesError) {
    return {
      success: false,
      error: `No se pudieron consultar las imágenes: ${imagesError.message}`,
    };
  }

  const nextSortOrder =
    existingImages && existingImages.length > 0
      ? existingImages[0].sort_order + 1
      : 0;

  const extension =
    file.name.split(".").pop()?.toLowerCase() ||
    "webp";

  const fileName = `${crypto.randomUUID()}.${extension}`;

  const storagePath =
    `products/${productSlug}/${fileName}`;

  const arrayBuffer = await file.arrayBuffer();

  const { error: uploadError } =
    await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

  if (uploadError) {
    return {
      success: false,
      error:
        `No se pudo subir la imagen: ${uploadError.message}`,
    };
  }

  const isPrimary = nextSortOrder === 0;

  const { error: insertError } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      storage_path: storagePath,
      alt_text: file.name,
      sort_order: nextSortOrder,
      is_primary: isPrimary,
    });

  if (insertError) {
    await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath]);

    return {
      success: false,
      error:
        `La imagen se subió pero no pudo registrarse: ${insertError.message}`,
    };
  }

  revalidatePath("/tienda");
  revalidatePath(`/producto/${productSlug}`);
  revalidatePath(
    `/admin/productos/${productId}/editar`,
  );

  return {
    success: true,
  };
}

export async function setPrimaryProductImage(
  productId: string,
  imageId: string,
): Promise<ActionResult> {
  const { supabase, error: authError } =
    await verifyAdmin();

  if (authError) {
    return {
      success: false,
      error: authError,
    };
  }

  const { data: image, error: imageError } =
    await supabase
      .from("product_images")
      .select("id")
      .eq("id", imageId)
      .eq("product_id", productId)
      .maybeSingle();

  if (imageError || !image) {
    return {
      success: false,
      error: "La imagen no pertenece a este producto.",
    };
  }

  const { error: resetError } = await supabase
    .from("product_images")
    .update({
      is_primary: false,
    })
    .eq("product_id", productId);

  if (resetError) {
    return {
      success: false,
      error:
        `No se pudo actualizar la imagen principal: ${resetError.message}`,
    };
  }

  const { error: primaryError } = await supabase
    .from("product_images")
    .update({
      is_primary: true,
    })
    .eq("id", imageId)
    .eq("product_id", productId);

  if (primaryError) {
    return {
      success: false,
      error:
        `No se pudo establecer la imagen principal: ${primaryError.message}`,
    };
  }

  revalidatePath(
    `/admin/productos/${productId}/editar`,
  );

  return {
    success: true,
  };
}

export async function deleteProductImage(
  productId: string,
  imageId: string,
): Promise<ActionResult> {
  const { supabase, error: authError } =
    await verifyAdmin();

  if (authError) {
    return {
      success: false,
      error: authError,
    };
  }

  const { data: image, error: imageError } =
    await supabase
      .from("product_images")
      .select(
        "id, storage_path, is_primary, sort_order",
      )
      .eq("id", imageId)
      .eq("product_id", productId)
      .maybeSingle();

  if (imageError || !image) {
    return {
      success: false,
      error: "La imagen no existe.",
    };
  }

  const { error: storageError } =
    await supabase.storage
      .from(BUCKET_NAME)
      .remove([image.storage_path]);

  if (storageError) {
    return {
      success: false,
      error:
        `No se pudo eliminar el archivo: ${storageError.message}`,
    };
  }

  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("id", imageId)
    .eq("product_id", productId);

  if (deleteError) {
    return {
      success: false,
      error:
        `No se pudo eliminar el registro: ${deleteError.message}`,
    };
  }

  if (image.is_primary) {
    const { data: nextImage } = await supabase
      .from("product_images")
      .select("id")
      .eq("product_id", productId)
      .order("sort_order", {
        ascending: true,
      })
      .limit(1)
      .maybeSingle();

    if (nextImage) {
      await supabase
        .from("product_images")
        .update({
          is_primary: true,
        })
        .eq("id", nextImage.id);
    }
  }

  revalidatePath("/tienda");
  revalidatePath(`/admin/productos/${productId}/editar`);

  return {
    success: true,
  };
}