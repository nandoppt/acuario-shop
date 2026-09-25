import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Search, Clock3 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    q?: string;
    categoria?: string;
  }>;
};

function cleanSearch(value: string) {
  return value.replace(/[^\p{L}\p{N}\s-]/gu, " ").trim().slice(0, 80);
}

export default async function BibliotecaPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = cleanSearch(params.q ?? "");
  const categorySlug = (params.categoria ?? "").trim().toLowerCase();

  const supabase = await createClient();

  const { data: categories, error: categoriesError } = await supabase
    .from("guide_categories")
    .select("id, name, slug, description")
    .eq("is_active", true)
    .order("sort_order");

  if (categoriesError) throw new Error(categoriesError.message);

  const selectedCategory = (categories ?? []).find(
    (category) => category.slug === categorySlug,
  );

  let guideQuery = supabase
    .from("guides")
    .select(
      "id, slug, title, excerpt, reading_time, difficulty, author_name, cover_image, cover_alt, published_at, category:guide_categories(name, slug)",
    )
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false });

  if (selectedCategory) {
    guideQuery = guideQuery.eq("category_id", selectedCategory.id);
  }

  if (query) {
    const pattern = "%" + query + "%";
    guideQuery = guideQuery.or(
      "title.ilike." + pattern + ",excerpt.ilike." + pattern,
    );
  }

  const { data: guides, error: guidesError } = await guideQuery;
  if (guidesError) throw new Error(guidesError.message);

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-9 md:px-6 md:py-12">
        <Link
          href="/guias"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary"
        >
          <ArrowLeft className="size-4" />
          Centro de guías
        </Link>

        <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Biblioteca
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Aprende antes de decidir
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Guías prácticas, referencias y recursos de acuarismo organizados para
              encontrar lo que necesitas sin perderte entre demasiado texto.
            </p>
          </div>
          <BookOpen className="hidden size-10 text-primary/50 md:block" />
        </div>

        <form
          method="get"
          className="mt-7 rounded-2xl border border-border bg-card p-4"
        >
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="q"
                defaultValue={query}
                placeholder="Buscar una guía, tema o concepto..."
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button
              type="submit"
              className="h-11 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
            >
              Buscar
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={query ? "/guias/biblioteca?q=" + encodeURIComponent(query) : "/guias/biblioteca"}
              className={
                "rounded-full border px-4 py-2 text-sm transition " +
                (!selectedCategory
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background hover:border-primary/30")
              }
            >
              Todas
            </Link>

            {(categories ?? []).map((category) => {
              const href =
                "/guias/biblioteca?categoria=" +
                encodeURIComponent(category.slug) +
                (query ? "&q=" + encodeURIComponent(query) : "");

              return (
                <Link
                  key={category.id}
                  href={href}
                  className={
                    "rounded-full border px-4 py-2 text-sm transition " +
                    (selectedCategory?.id === category.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:border-primary/30")
                  }
                >
                  {category.name}
                </Link>
              );
            })}
          </div>
        </form>

        <div className="mt-7 flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {guides?.length ?? 0} {guides?.length === 1 ? "guía encontrada" : "guías encontradas"}
            {selectedCategory ? " en " + selectedCategory.name : ""}
          </p>
          {query && (
            <Link
              href="/guias/biblioteca"
              className="text-sm font-medium text-primary hover:underline"
            >
              Limpiar búsqueda
            </Link>
          )}
        </div>

        {(guides ?? []).length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center">
            <BookOpen className="mx-auto size-9 text-primary/40" />
            <h2 className="mt-4 text-lg font-semibold">No encontramos esa guía</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Prueba con otro término o consulta otra categoría.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(guides ?? []).map((guide) => {
              const category = Array.isArray(guide.category)
                ? guide.category[0]
                : guide.category;

              return (
                <Link
                  key={guide.id}
                  href={"/guias/" + guide.slug}
                  className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/8] overflow-hidden bg-muted/40">
                    {guide.cover_image ? (
                      <img
                        src={guide.cover_image}
                        alt={guide.cover_alt || guide.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/15 via-primary/5 to-transparent">
                        <BookOpen className="size-10 text-primary/40" />
                      </div>
                    )}

                    <div className="absolute left-4 top-4 rounded-full border border-white/40 bg-black/30 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      {category?.name}
                    </div>
                  </div>

                  <div className="flex min-h-56 flex-col p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock3 className="size-3.5" />
                        {guide.reading_time}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {guide.difficulty}
                      </span>
                    </div>

                    <h2 className="mt-4 text-xl font-semibold tracking-tight">
                      {guide.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {guide.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm">
                      <span className="text-muted-foreground">
                        {guide.author_name}
                      </span>
                      <span className="inline-flex items-center gap-1 font-medium text-primary">
                        Leer guía
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <section className="mt-10 rounded-3xl border border-primary/15 bg-primary/[0.035] p-6 md:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Cómo usar la biblioteca
          </p>
          <div className="mt-3 grid gap-5 md:grid-cols-3">
            <div>
              <h2 className="font-semibold">Busca</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Encuentra rápidamente una guía por título o tema.
              </p>
            </div>
            <div>
              <h2 className="font-semibold">Filtra</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Usa las categorías para concentrarte en el área que necesitas.
              </p>
            </div>
            <div>
              <h2 className="font-semibold">Consulta</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Cada artículo reúne contenido, nivel, tiempo de lectura y fuentes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
