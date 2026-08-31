import { createClient } from "@/lib/supabase/server";

import { InventoryManager } from "./inventory-manager";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const supabase = await createClient();

  const { data: products, error: productsError } =
    await supabase
      .from("products")
      .select(`
        id,
        name,
        sku,
        price,
        categories (
          name
        ),
        inventory (
          quantity
        )
      `)
      .eq("is_active", true)
      .order("name", {
        ascending: true,
      });

  if (productsError) {
    throw new Error(
      `No se pudo cargar el inventario: ${productsError.message}`,
    );
  }

  const productIds =
    products?.map((product) => product.id) ?? [];

  const { data: movements, error: movementsError } =
    productIds.length > 0
      ? await supabase
          .from("inventory_movements")
          .select(`
            id,
            product_id,
            quantity_change,
            movement_type,
            reason,
            reference_id,
            created_at
          `)
          .in("product_id", productIds)
          .order("created_at", {
            ascending: false,
          })
      : {
          data: [],
          error: null,
        };

  if (movementsError) {
    throw new Error(
      `No se pudo cargar el historial: ${movementsError.message}`,
    );
  }

  const normalizedProducts = (products ?? []).map(
    (product) => ({
      ...product,
      categories: Array.isArray(product.categories)
        ? product.categories[0] ?? null
        : product.categories,
      inventory: Array.isArray(product.inventory)
        ? product.inventory[0] ?? null
        : product.inventory,
    }),
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Administración
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          Inventario
        </h1>

        <p className="mt-2 text-muted-foreground">
          Gestiona las existencias y registra los
          movimientos de tus productos.
        </p>
      </div>

      <InventoryManager
        products={normalizedProducts}
        movements={movements ?? []}
      />
    </div>
  );
}