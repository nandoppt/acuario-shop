import { createClient } from "@/lib/supabase/server";

export async function getCategories() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select(
      "id, name, slug, description, image_url, sort_order",
    )
    .eq("is_active", true)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `No se pudieron cargar las categorías: ${error.message}`,
    );
  }

  return data;
}