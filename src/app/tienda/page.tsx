import { CategoryGrid } from "@/components/home/category-grid";
import { ProductGrid } from "@/components/product/product-grid";
import {
  mockProducts,
  type ProductCategory,
} from "@/lib/catalog/mock-products";

export const metadata = {
  title: "Tienda",
  description:
    "Explora plantas, iluminación, filtración, sustratos y accesorios para tu acuario.",
};

type TiendaPageProps = {
  searchParams: Promise<{
    categoria?: string;
  }>;
};

const validCategories: ProductCategory[] = [
  "plantas",
  "iluminacion",
  "filtracion",
  "sustratos",
  "co2",
  "fertilizacion",
  "alimentacion",
  "accesorios",
];

export default async function TiendaPage({
  searchParams,
}: TiendaPageProps) {
  const params = await searchParams;

  const selectedCategory = validCategories.includes(
    params.categoria as ProductCategory,
  )
    ? (params.categoria as ProductCategory)
    : undefined;

  const filteredProducts = selectedCategory
    ? mockProducts.filter(
        (product) => product.category === selectedCategory,
      )
    : mockProducts;

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            VidaBajoAgua
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Nuestra tienda
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
            Todo lo necesario para crear, cuidar y disfrutar
            un mundo acuático lleno de vida.
          </p>
        </div>
      </section>

      <CategoryGrid
        title="Explora nuestras categorías"
        description="Encuentra rápidamente lo que necesitas para tu acuario."
      />

      <section className="border-t border-border px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
              Catálogo
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              {selectedCategory
                ? `Productos de ${selectedCategory}`
                : "Todos los productos"}
            </h2>

            <p className="mt-3 text-muted-foreground">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "producto disponible"
                : "productos disponibles"}
            </p>
          </div>

          <ProductGrid products={filteredProducts} />
        </div>
      </section>
    </div>
  );
}