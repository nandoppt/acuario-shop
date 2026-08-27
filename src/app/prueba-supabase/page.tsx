import { createClient } from "@/lib/supabase/server";

export default async function PruebaSupabasePage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("sort_order");

  if (error) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold">
          Error conectando con Supabase
        </h1>

        <pre className="mt-6 rounded-xl bg-muted p-4 text-sm">
          {error.message}
        </pre>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">
        Conexión con Supabase
      </h1>

      <p className="mt-2 text-muted-foreground">
        Categorías encontradas: {data.length}
      </p>

      <pre className="mt-8 overflow-auto rounded-xl bg-muted p-6 text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </main>
  );
}