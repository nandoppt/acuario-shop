import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

async function loadGuide(slug: string) {
  const supabase = await createClient();
  const { data: guide, error } = await supabase
    .from("guides")
    .select("id, slug, title, category, excerpt, reading_time, difficulty")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!guide) return null;

  const { data: sections, error: sectionsError } = await supabase
    .from("guide_sections")
    .select("id, heading, content, sort_order")
    .eq("guide_id", guide.id)
    .order("sort_order", { ascending: true });

  if (sectionsError) throw new Error(sectionsError.message);

  return { ...guide, sections: sections ?? [] };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = await loadGuide(slug);
  return guide
    ? { title: guide.title, description: guide.excerpt }
    : { title: "Guía no encontrada" };
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = await loadGuide(slug);
  if (!guide) notFound();

  return (
    <main className="min-h-screen">
      <article className="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
        <Link href="/guias/biblioteca" className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:gap-3">
          <ArrowLeft className="size-4" />
          Volver a biblioteca
        </Link>

        <header className="mt-8 border-b border-border pb-9">
          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-primary">
            <span>{guide.category}</span>
            <span className="text-border">/</span>
            <span className="inline-flex items-center gap-1.5 text-muted-foreground normal-case tracking-normal">
              <Clock3 className="size-3.5" />
              {guide.reading_time} de lectura
            </span>
          </div>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight md:text-5xl">{guide.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">{guide.excerpt}</p>
        </header>

        <div className="grid gap-8 pt-9 md:grid-cols-[1fr_220px]">
          <div className="space-y-9">
            {guide.sections.map((section) => (
              <section key={section.id}>
                <h2 className="text-2xl font-semibold tracking-tight">{section.heading}</h2>
                <div className="mt-4 space-y-4">
                  {section.content.split("\n").filter(Boolean).map((paragraph, index) => (
                    <p key={index} className="text-base leading-8 text-muted-foreground">{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-muted/25 p-5 md:sticky md:top-6">
            <BookOpen className="size-5 text-primary" />
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-primary">Esta guía</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Nivel {guide.difficulty}. Pensada como referencia práctica para complementar tu experiencia y tus observaciones del acuario.
            </p>
            <Link href="/calculadoras/litraje" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
              Abrir calculadora de litraje
              <ArrowRight className="size-4" />
            </Link>
          </aside>
        </div>
      </article>
    </main>
  );
}
