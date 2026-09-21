import { createAdminClient } from "@/lib/supabase/admin";
import { CategoriesManager } from "./categories-manager";

export default async function CategoriesPage() {
  const admin = createAdminClient();

  const { data: categories, error } = await admin
    .from("categories")
    .select(
      "id, name, slug, description, image_url, is_active, sort_order, created_at, updated_at",
    )
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    console.error("Error loading categories:", error);
  }

  const categoryIds = (categories ?? []).map((category) => category.id);

  let productCounts: Record<string, number> = {};

  if (categoryIds.length > 0) {
    const { data: products, error: productsError } = await admin
      .from("products")
      .select("id, category_id")
      .in("category_id", categoryIds);

    if (productsError) {
      console.error("Error loading category product counts:", productsError);
    } else {
      productCounts = (products ?? []).reduce<Record<string, number>>(
        (counts, product) => {
          counts[product.category_id] =
            (counts[product.category_id] ?? 0) + 1;

          return counts;
        },
        {},
      );
    }
  }

  const categoriesWithCounts = (categories ?? []).map((category) => ({
    ...category,
    product_count: productCounts[category.id] ?? 0,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-sans text-3xl font-semibold tracking-tight">
          Categorías
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Gestiona las categorías que organizan los productos de tu tienda.
        </p>
      </div>

      <CategoriesManager initialCategories={categoriesWithCounts} />
    </div>
  );
}