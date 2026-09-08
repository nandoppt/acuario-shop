import { CategoryFilter } from "@/components/catalog/category-filter";
import { CatalogSearch } from "@/components/catalog/catalog-search";
import { ProductGrid } from "@/components/product/product-grid";
import {
  getCategories,
  getProducts,
} from "@/lib/catalog/products";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Tienda",
  description:
    "Explora plantas, iluminación, filtración, sustratos y accesorios para tu acuario.",
};

type TiendaPageProps = {
  searchParams: Promise<{
    categoria?: string;
    busqueda?: string;
  }>;
};

export default async function TiendaPage({
  searchParams,
}: TiendaPageProps) {
  const params = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const selectedCategory = params.categoria;
  const searchTerm = params.busqueda?.trim().toLowerCase();

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !selectedCategory ||
      product.categories?.slug === selectedCategory;

    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand?.toLowerCase().includes(searchTerm) ||
      product.sku?.toLowerCase().includes(searchTerm) ||
      product.short_description
        ?.toLowerCase()
        .includes(searchTerm) ||
      product.categories?.name
        .toLowerCase()
        .includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  const selectedCategoryData = categories.find(
    (category) => category.slug === selectedCategory,
  );

  const categoryLabel =
    selectedCategoryData?.name ??
    selectedCategory ??
    "Todos los productos";

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-5">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            VidaBajoAgua
          </p>

          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight md:text-3xl">
            Nuestra tienda
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Todo lo necesario para crear, cuidar y disfrutar un mundo acuático lleno de vida.
          </p>
        </div>
      </section>

      <section className="border-b border-border px-4 py-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              searchTerm={params.busqueda}
            />
          <div className="mt-4">
          <CatalogSearch
            products={products}
            value={params.busqueda}
            selectedCategory={selectedCategory}
          />
          </div>
        </div>
      </section>

      <section className="px-4 py-10 md:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
              Catálogo
            </p>

            <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {searchTerm
                  ? `Resultados para "${params.busqueda}"`
                  : selectedCategory
                    ? `Productos de ${categoryLabel}`
                    : "Todos los productos"}
              </h2>

              <p className="text-sm text-muted-foreground">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1
                  ? "producto disponible"
                  : "productos disponibles"}
              </p>
            </div>
          </div>

          <ProductGrid products={filteredProducts} />
        </div>
      </section>
    </div>
  );
}