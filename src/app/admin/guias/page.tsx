import Link from "next/link";
import { BookOpen, Eye, Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminGuiasPage() {
  const supabase = await createClient();
  const { data: guides, error } = await supabase
    .from("guides")
    .select("id, title, slug, category, difficulty, reading_time, status, featured, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Contenido</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Guías</h1>
          <p className="mt-2 text-muted-foreground">Crea y administra la biblioteca de VidaBajoAgua.</p>
        </div>
        <Link href="/admin/guias/nuevo" className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90">
          <Plus size={18} /> Nueva guía
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-background">
        {(guides ?? []).length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <BookOpen size={42} className="text-primary/50" />
            <h2 className="mt-4 text-lg font-semibold">No hay guías</h2>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {(guides ?? []).map((guide) => (
              <div key={guide.id} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold">{guide.title}</h2>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${guide.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {guide.status === "published" ? "Publicada" : "Borrador"}
                    </span>
                    {guide.featured && <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">Destacada</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{guide.category} · {guide.difficulty} · {guide.reading_time}</p>
                  <p className="mt-1 text-xs text-muted-foreground">/{guide.slug}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  {guide.status === "published" && (
                    <Link href={`/guias/${guide.slug}`} target="_blank" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Ver guía">
                      <Eye size={16} />
                    </Link>
                  )}
                  <Link href={`/admin/guias/${guide.id}/editar`} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Editar guía">
                    <Pencil size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
