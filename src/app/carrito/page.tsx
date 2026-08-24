"use client";

import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";

import { useCart } from "@/components/cart/cart-context";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";

export default function CarritoPage() {
  const { items, products } = useCart();

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16">
        <div className="max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
            <ShoppingCart size={28} />
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight">
            Tu carrito está vacío
          </h1>

          <p className="mt-3 leading-7 text-muted-foreground">
            Explora nuestra tienda y encuentra todo lo necesario
            para crear tu mundo acuático.
          </p>

          <Link
            href="/tienda"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground"
          >
            <ArrowLeft size={18} />
            Explorar tienda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
          VidaBajoAgua
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Tu carrito
        </h1>

        <p className="mt-3 text-muted-foreground">
          Revisa tus productos antes de continuar.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <section>
          {items.map((item) => {
            const product = products.find(
              (product) => product.id === item.productId,
            );

            if (!product) {
              return null;
            }

            return (
              <CartItem
                key={item.productId}
                product={product}
                quantity={item.quantity}
              />
            );
          })}
        </section>

        <CartSummary />
      </div>
    </main>
  );
}