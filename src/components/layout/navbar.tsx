"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  X,
} from "lucide-react";

import { CartButton } from "@/components/cart/cart-button";
import { AccountMenu } from "@/components/account/account-menu";
import { CatalogSearch } from "@/components/catalog/catalog-search";
import type { CatalogProduct } from "@/types/catalog";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [mobileSearchOpen, setMobileSearchOpen] =
    useState(false);

  const [products, setProducts] = useState<
    CatalogProduct[]
  >([]);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch(
          "/api/catalog/products",
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        if (!cancelled) {
          console.log("Navbar products:", data);
  setProducts(data ?? []);
}
      } catch {
        // El Navbar puede funcionar aunque el catálogo
        // no esté disponible temporalmente.
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="shrink-0 text-xl font-semibold tracking-tight text-primary"
          >
            VidaBajoAgua
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/">Inicio</Link>

            <Link href="/tienda">
              Tienda
            </Link>

            <Link href="/guias">
              Guías
            </Link>

            <Link href="/nosotros">
              Nosotros
            </Link>
          </nav>

          <div className="flex items-center gap-1">
            <div className="hidden w-44 lg:w-52 md:block">
              <CatalogSearch
                products={products}
                compact
              />
            </div>

            <button
  type="button"
  onClick={() => {
    setMobileSearchOpen((open) => !open);
    setMobileMenuOpen(false);
  }}
  className="rounded-full p-2 transition-colors hover:bg-muted md:hidden"
  aria-label={
    mobileSearchOpen
      ? "Cerrar búsqueda"
      : "Buscar productos"
  }
>
  {mobileSearchOpen ? (
    <X size={20} />
  ) : (
    <Search size={20} />
  )}
</button>

            <AccountMenu />

            <CartButton />

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen((open) => !open);
                setMobileSearchOpen(false);
              }}
              className="rounded-full p-2 transition-colors hover:bg-muted md:hidden"
              aria-label={
                mobileMenuOpen
                  ? "Cerrar menú"
                  : "Abrir menú"
              }
            >
              {mobileMenuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>

        {mobileSearchOpen && (
          <div className="border-t border-border py-3 md:hidden">
            <CatalogSearch
              products={products}
            />
          </div>
        )}

        {mobileMenuOpen && (
          <div className="border-t border-border py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-lg px-3 py-2 hover:bg-muted"
              >
                Inicio
              </Link>

              <Link
                href="/tienda"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-lg px-3 py-2 hover:bg-muted"
              >
                Tienda
              </Link>

             

              <Link
                href="/guias"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-lg px-3 py-2 hover:bg-muted"
              >
                Guías
              </Link>

              <Link
                href="/nosotros"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="rounded-lg px-3 py-2 hover:bg-muted"
              >
                Nosotros
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}