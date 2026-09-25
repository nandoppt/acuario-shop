"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

import type { CatalogProduct } from "@/types/catalog";

type CatalogSearchProps = {
  products: CatalogProduct[];
  value?: string;
  selectedCategory?: string;
  compact?: boolean;
};

export function CatalogSearch({
  products,
  value = "",
  selectedCategory,
  compact = false,
}: CatalogSearchProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [search, setSearch] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] =
    useState(-1);

  useEffect(() => {
    setSearch(value);
  }, [value]);

  const suggestions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (term.length < 2) {
      return [];
    }

    const matches = products
      .map((product) => {
        const name = product.name.toLowerCase();
        const brand = product.brand?.toLowerCase() ?? "";
        const sku = product.sku?.toLowerCase() ?? "";
        const category =
          product.categories?.name.toLowerCase() ?? "";

        let score = 0;

        if (name.startsWith(term)) {
          score += 100;
        } else if (name.includes(term)) {
          score += 80;
        }

        if (brand.startsWith(term)) {
          score += 60;
        } else if (brand.includes(term)) {
          score += 40;
        }

        if (sku.includes(term)) {
          score += 50;
        }

        if (category.includes(term)) {
          score += 30;
        }

        return {
          product,
          score,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return a.product.name.localeCompare(
          b.product.name,
          "es",
        );
      })
      .slice(0, 5)
      .map((item) => item.product);

    return matches;
  }, [products, search]);

  useEffect(() => {
    setHighlightedIndex(-1);

    if (search.trim().length >= 2) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  function buildSearchUrl(searchValue: string) {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.set("categoria", selectedCategory);
    }

    if (searchValue.trim()) {
      params.set("busqueda", searchValue.trim());
    }

    const query = params.toString();

    return query ? `/tienda?${query}` : "/tienda";
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      highlightedIndex >= 0 &&
      suggestions[highlightedIndex]
    ) {
      handleSuggestionClick(
        suggestions[highlightedIndex],
      );

      return;
    }

    router.push(buildSearchUrl(search));
    setIsOpen(false);
  }

  function handleSuggestionClick(
    product: CatalogProduct,
  ) {
    router.push(`/producto/${product.slug}`);
    setIsOpen(false);
  }

  function handleClear() {
    setSearch("");
    setIsOpen(false);
    router.push(buildSearchUrl(""));
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    if (!isOpen || suggestions.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      setHighlightedIndex((current) =>
        current < suggestions.length - 1
          ? current + 1
          : 0,
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      setHighlightedIndex((current) =>
        current > 0
          ? current - 1
          : suggestions.length - 1,
      );
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  }

  return (
    <div
        ref={containerRef}
        className={`relative ${
          compact ? "w-full" : "max-w-3xl"
        }`}
     >
      <form onSubmit={handleSubmit}>
        <div className="relative">
        <Search
          size={compact ? 17 : 18}
          className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-muted-foreground ${
            compact ? "left-3" : "left-3"
          }`}
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            onFocus={() => {
              if (search.trim().length >= 2) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar plantas, filtros, iluminación..."
            className={`w-full border border-border bg-background text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10 ${
              compact
                ? "h-9 rounded-full pl-9 pr-9"
                : "h-10 rounded-xl pl-10 pr-10"
            }`}            aria-label="Buscar productos"
            aria-autocomplete="list"
            aria-expanded={
              isOpen && suggestions.length > 0
            }
          />

          {search && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </form>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          {suggestions.map((product, index) => {
            const isHighlighted =
              index === highlightedIndex;

            return (
              <button
                key={product.id}
                type="button"
                onMouseDown={(event) =>
                  event.preventDefault()
                }
                onClick={() =>
                  handleSuggestionClick(product)
                }
                className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors ${
                  isHighlighted
                    ? "bg-muted"
                    : "hover:bg-muted"
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {product.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {product.categories?.name ??
                      "Sin categoría"}
                    {product.brand
                      ? ` · ${product.brand}`
                      : ""}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-medium text-primary">
                  ${product.price.toFixed(2)}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}