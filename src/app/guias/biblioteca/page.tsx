import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Droplets, Fish, Lightbulb, Sprout } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const topics = [
  { label: "Plantas", icon: Sprout }, { label: "Camarones", icon: Fish },
  { label: "Iluminación", icon: Lightbulb }, { label: "Agua", icon: Droplets },
];

export default async function BibliotecaPage() {
  const supabase = await createClient();
  const { data: guides, error } = await supabase.from("guides")
    .select("id, slug, title, excerpt, reading_time, difficulty, author_name, category:guide_categories(name)")
    .eq("status", "published").order("featured", { ascending: false }).order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  const categories = ["Todas", ...Array.from(new Set((guides ?? []).map((guide) => {
    const category = Array.isArray(guide.category) ? guide.category[0] : guide.category;
    return category?.name;
  }).filter(Boolean) as string[]))];

  return (
    <main className="min-h-screen"><div className="mx-auto max-w-6xl px-4 py-9 md:px-6 md:py-12">
      <Link href="/guias" className="inline-flex items-center gap-2 text-sm font-medium text-primary"><ArrowLeft className="size-4" /> Centro de guías</Link>
      <div className="mt-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Biblioteca</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Guías para avanzar con criterio</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">Lecturas prácticas para comprender el acuario antes de tomar decisiones sobre montaje, mantenimiento o habitantes.</p>
      </div><BookOpen className="hidden size-10 text-primary/50 md:block" /></div>
      <div className="mt-7 flex flex-wrap gap-2">{categories.map((category) => <span key={category} className="rounded-full border border-border bg-card px-4 py-2 text-sm">{category}</span>)}</div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(guides ?? []).map((guide) => {
          const category = Array.isArray(guide.category) ? guide.category[0] : guide.category;
          return <Link key={guide.id} href={\`/guias/\${guide.slug}\`} className="group flex min-h-60 flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg">
            <div className="flex items-center justify-between gap-4"><span className="text-xs font-medium uppercase tracking-[0.16em] text-primary">{category?.name}</span><span className="text-xs text-muted-foreground">{guide.reading_time}</span></div>
            <h2 className="mt-5 text-xl font-semibold tracking-tight">{guide.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{guide.excerpt}</p>
            <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-sm"><span className="text-muted-foreground">{guide.author_name}</span><span className="inline-flex items-center gap-1 font-medium text-primary">Leer guía<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></div>
          </Link>;
        })}
      </div>
      <section id="temas" className="mt-10 rounded-3xl border border-primary/15 bg-primary/[0.035] p-6 md:p-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Próximamente</p><h2 className="mt-2 text-2xl font-semibold tracking-tight">Más fichas para consultar rápido</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">La biblioteca crecerá con fichas de plantas, habitantes, iluminación, agua y problemas frecuentes del acuario.</p>
        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">{topics.map((topic) => { const Icon=topic.icon; return <div key={topic.label} className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-3 text-sm"><Icon className="size-4 text-primary" />{topic.label}</div>; })}</div>
      </section>
    </div></main>
  );
}