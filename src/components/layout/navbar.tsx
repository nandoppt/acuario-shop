"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu } from "lucide-react";

import { CartButton } from "../cart/cart-button";

export function Navbar() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight text-primary"
        >
          VidaBajoAgua
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="transition-colors hover:text-primary"
          >
            Inicio
          </Link>

          <Link
            href="/tienda"
            className="transition-colors hover:text-primary"
          >
            Tienda
          </Link>

          <Link
            href="/tienda?categoria=plantas"
            className="transition-colors hover:text-primary"
          >
            Plantas
          </Link>

          <Link
            href="/guias"
            className="transition-colors hover:text-primary"
          >
            Guías
          </Link>

          <Link
            href="/nosotros"
            className="transition-colors hover:text-primary"
          >
            Nosotros
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full p-2 transition-colors hover:bg-muted"
            aria-label="Buscar"
          >
            <Search size={20} />
          </button>

          <Link
            href="/cuenta"
            className="rounded-full p-2 transition-colors hover:bg-muted"
            aria-label="Mi cuenta"
          >
            <User size={20} />
          </Link>

          <button
            type="button"
            className="relative rounded-full p-2 transition-colors hover:bg-muted"
            aria-label="Carrito"
          >
            <CartButton />
          </button>

          <button
            type="button"
            className="rounded-full p-2 transition-colors hover:bg-muted md:hidden"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}