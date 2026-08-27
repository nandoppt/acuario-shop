import { getProducts } from "@/lib/catalog/products";

export default async function PruebaProductosPage() {
  const products = await getProducts();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm uppercase tracking-[0.25em] text-muted-foreground">
        VidaBajoAgua
      </p>

      <h1 className="mt-3 text-4xl font-semibold">
        Productos desde Supabase
      </h1>

      <p className="mt-3 text-muted-foreground">
        Productos encontrados: {products.length}
      </p>

      <pre className="mt-8 overflow-auto rounded-xl border bg-muted/40 p-6 text-sm">
        {JSON.stringify(products, null, 2)}
      </pre>
    </main>
  );
}