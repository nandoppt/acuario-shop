import Link from "next/link";

import type { ProductCategory } from "@/types/catalog";

type CategoryFilterProps = {
  categories: ProductCategory[];
  selectedCategory?: string;
  searchTerm?: string;
};

export function CategoryFilter({
  categories,
  selectedCategory,
  searchTerm,
}: CategoryFilterProps) {
  function getCategoryHref(slug?: string) {
    const params = new URLSearchParams();

    if (slug) {
      params.set("categoria", slug);
    }

    if (searchTerm) {
      params.set("busqueda", searchTerm);
    }

    const query = params.toString();

    return query ? `/tienda?${query}` : "/tienda";
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium">
        Categorías
      </p>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <Link
          href={getCategoryHref()}
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
            !selectedCategory
              ? "border-primary bg-primary text-primary-foreground shadow-sm"
              : "border-border/80 bg-background hover:border-primary/40 hover:bg-primary/5"
          }`}
        >
          Todos
        </Link>

        {categories.map((category) => {
          const isSelected =
            selectedCategory === category.slug;

          return (
            <Link
              key={category.id}
              href={getCategoryHref(category.slug)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:border-primary/40 hover:bg-muted"
              }`}
            >
              {category.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}