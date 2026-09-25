import Link from "next/link";
import { BookOpen, Eye, Pencil, Plus, Search, Settings2 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    q?: string;
    estado?: string;
    categoria?: string;
  }>;
};

function cleanSearch(value: string) {
  return value.replace(/[^\p{L}\p{N}\s-]/gu, " ").trim().slice(0, 80);
}

export default async function AdminGuiasPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = cleanSearch(params.q ?? "");
  const status =
    params.estado === "published" ||
    params.estado === "draft" ||
    params.estado === "archived"
      ? params.estado
      : "";
  const categorySlug = (params.categoria ?? "").trim().toLowerCase();

  const supabase = await createClient();

  const [{ data: categories, error: categoriesError }, { data: counts, error: countsError }] =
    await Promise.all([
      supabase
        .from("guide_categories")
        .select("id, name, slug")
        .order("sort_order"),
      supabase
        .from("guides")
        .select("status"),
    ]);

  if (categoriesError) throw new Error(categoriesError.message);
  if (countsError) throw new Error(countsError.message);

  const selectedCategory = (categories ?? []).find(
    (category) => category.slug === categorySlug,
  );

  let guideQuery = supabase
    .from("guides")
    .select(
      "id, title, slug, difficulty, reading_time, status, featured, author_name, updated_at, category_id, category:guide_categories(name, slug)",
    )
    .order("updated_at", { ascending: false });

  if (status) guideQuery = guideQuery.eq("status", status);
  if (selectedCategory) guideQuery = guideQuery.eq("category_id", selectedCategory.id);

  if (query) {
    const pattern = "%" + query + "%";
    guideQuery = guideQuery.or(
      "title.ilike." + pattern + ",excerpt.ilike." + pattern + ",author_name.ilike." + pattern,
    );
  }

  const { data: guides, error } = await guideQuery;
  if (error) throw new Error(error.message);

  const total = counts?.length ?? 0;
  const published = counts?.filter((item) => item.status === "published").length ?? 0;
  const drafts = counts?.filter((item) => item.status === "draft").length ?? 0;

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Contenido
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Guías
          </h1>
          <p className="mt-2 text-muted-foreground">
            Crea, revisa y organiza la biblioteca de VidaBajoAgua.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/guias/categorias"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium transition hover:bg-muted"
          >
            <Settings2 size={17} />
            Categorías
          </Link>
          <Link
            href="/admin/guias/nuevo"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
          >
            <Plus size={18} />
            Nueva guía
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Total</p>
          <p className="mt-2 text-2xl font-semibold">{total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Publicadas</p>
          <p className="mt-2 text-2xl font-semibold text-primary">{published}</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Borradores</p>
          <p className="mt-2 text-2xl font-semibold">{drafts}</p>
        </div>
      </div>

      <form
        method="get"
        className="rounded-2xl border border-border bg-background p-4"
      >
        <div className="grid gap-3 md:grid-cols-[1fr_190px_190px_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              defaultValue={query}
              placeholder="Buscar por título o autor..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <select
            name="categoria"
            defaultValue={selectedCategory?.slug ?? ""}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Todas las categorías</option>
            {(categories ?? []).map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            name="estado"
            defaultValue={status}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">Todos los estados</option>
            <option value="published">Publicadas</option>
            <option value="draft">Borradores</option><option value="archived">Archivadas</option>
          </select>

          <button
            type="submit"
            className="h-11 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground"
          >
            Filtrar
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        {(guides ?? []).length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
            <BookOpen size={42} className="text-primary/50" />
            <h2 className="mt-4 text-lg font-semibold">No hay coincidencias</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Ajusta la búsqueda o cambia los filtros.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {(guides ?? []).map((guide) => {
              const category = Array.isArray(guide.category)
                ? guide.category[0]
                : guide.category;

              return (
                <div
                  key={guide.id}
                  className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">{guide.title}</h2>
                      <span
                        className={
                          "rounded-full px-2.5 py-1 text-xs font-medium " +
                          (guide.status === "published"
                            ? "bg-primary/10 text-primary"
                            : guide.status === "archived"
                              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                              : "bg-muted text-muted-foreground")
                        }
                      >
                        {guide.status === "published"
                          ? "Publicada"
                          : guide.status === "archived"
                            ? "Archivada"
                            : "Borrador"}
                      </span>
                      {guide.featured && (
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">
                          Destacada
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {category?.name} · {guide.author_name} · {guide.difficulty} ·{" "}
                      {guide.reading_time}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      /{guide.slug}
                    </p>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {guide.status === "published" && (
                      <Link
                        href={"/guias/" + guide.slug}
                        target="_blank"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label="Ver guía"
                      >
                        <Eye size={16} />
                      </Link>
                    )}
                    <Link
                      href={"/admin/guias/" + guide.id + "/editar"}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground"
                      aria-label="Editar guía"
                    >
                      <Pencil size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
