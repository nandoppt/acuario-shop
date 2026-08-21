
"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, Menu } from "lucide-react";

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
          <Link href="/">Inicio</Link>
          <Link href="/tienda">Tienda</Link>
          <Link href="/plantas">Plantas</Link>
          <Link href="/guias">Guías</Link>
          <Link href="/nosotros">Nosotros</Link>
        </nav>

        <div className="flex items-center gap-3">
          <button className="rounded-full p-2 hover:bg-muted">
            <Search size={20} />
          </button>

          <button className="rounded-full p-2 hover:bg-muted">
            <User size={20} />
          </button>

          <button className="relative rounded-full p-2 hover:bg-muted">
            <ShoppingCart size={20} />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              0
            </span>
          </button>

          <button className="rounded-full p-2 md:hidden hover:bg-muted">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}