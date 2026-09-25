import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  List,
  ListChecks,
} from "lucide-react";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

type GuideSection = {
  id: string;
  heading: string;
  content: string;
  block_type: string;
};

type GuideSource = {
  id: string;
  title: string;
  url: string;
  publisher: string;
  source_type: string;
};

async function loadGuide(slug: string) {
  const supabase = await createClient();

  const { data: guide, error } = await supabase
    .from("guides")
    .select(
      "id, slug, title, excerpt, reading_time, difficulty, author_name, cover_image, cover_alt, published_at, updated_at, category_id, category:guide_categories(name, slug)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!guide) return null;

  const [{ data: sections, error: sectionsError }, { data: sources, error: sourcesError }] =
    await Promise.all([
      supabase
        .from("guide_sections")
        .select("id, heading, content, block_type, sort_order")
        .eq("guide_id", guide.id)
        .order("sort_order", { ascending: true }),
      supabase
        .from("guide_sources")
        .select("id, title, url, publisher, source_type, sort_order")
        .eq("guide_id", guide.id)
        .order("sort_order", { ascending: true }),
    ]);

  if (sectionsError) throw new Error(sectionsError.message);
  if (sourcesError) throw new Error(sourcesError.message);

  const { data: related, error: relatedError } = await supabase
    .from("guides")
    .select(
      "id, slug, title, excerpt, reading_time, difficulty, author_name, cover_image, cover_alt, category:guide_categories(name)",
    )
    .eq("status", "published")
    .eq("category_id", guide.category_id)
    .neq("id", guide.id)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(3);

  if (relatedError) throw new Error(relatedError.message);

  return {
    ...guide,
    sections: (sections ?? []) as GuideSection[],
    sources: (sources ?? []) as GuideSource[],
    related: related ?? [],
  };
}

function formatDate(value: string | null) {
  if (!value) return null;
  return new Intl.DateTimeFormat("es-EC", {
    dateStyle: "medium",
    timeZone: "America/Guayaquil",
  }).format(new Date(value));
}

function paragraphs(content: string) {
  return content
    .split(/\n\s*\n|\n/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function renderSection(section: GuideSection) {
  const items = paragraphs(section.content);

  if (section.block_type === "list") {
    return (
      <ul className="mt-4 space-y-3">
        {items.map((item, index) => (
          <li key={index} className="flex gap-3 text-base leading-7 text-muted-foreground">
            <CheckCircle2 className="mt-1 size-4 shrink-0 text-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (section.block_type === "steps") {
    return (
      <ol className="mt-4 space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex gap-4">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {index + 1}
            </span>
            <span className="pt-0.5 text-base leading-7 text-muted-foreground">
              {item}
            </span>
          </li>
        ))}
      </ol>
    );
  }

  if (section.block_type === "callout") {
    return (
      <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/[0.045] p-5">
        <div className="flex gap-3">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="space-y-3">
            {items.map((item, index) => (
              <p key={index} className="text-sm leading-6 text-foreground/85">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {items.map((paragraph, index) => (
        <p key={index} className="text-base leading-8 text-muted-foreground">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const guide = await loadGuide((await params).slug);

  return guide
    ? {
        title: guide.title,
        description: guide.excerpt,
      }
    : { title: "Guía no encontrada" };
}

export default async function GuidePage({ params }: Props) {
  const guide = await loadGuide((await params).slug);
  if (!guide) notFound();

  const category = Array.isArray(guide.category)
    ? guide.category[0]
    : guide.category;
  const publishedDate = formatDate(guide.published_at);
  const updatedDate = formatDate(guide.updated_at);

  return (
    <main className="min-h-screen">
      <article className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-14">
        <Link
          href="/guias/biblioteca"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:gap-3"
        >
          <ArrowLeft className="size-4" />
          Volver a biblioteca
        </Link>

        <header className="mt-8 overflow-hidden rounded-3xl border border-border bg-card">
          {guide.cover_image && (
            <div className="aspect-[16/7] overflow-hidden bg-muted">
              <img
                src={guide.cover_image}
                alt={guide.cover_alt || guide.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <div className="p-6 md:p-9">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-primary">
              <span>{category?.name}</span>
              <span className="text-border">/</span>
              <span>{guide.difficulty}</span>
              <span className="text-border">/</span>
              <span>{guide.reading_time}</span>
            </div>

            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight md:text-5xl">
              {guide.title}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              {guide.excerpt}
            </p>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span>
                Por{" "}
                <span className="font-medium text-foreground">
                  {guide.author_name}
                </span>
              </span>
              {publishedDate && <span>Publicado {publishedDate}</span>}
              {updatedDate && <span>Actualizado {updatedDate}</span>}
            </div>
          </div>
        </header>

        <div className="grid gap-9 pt-9 lg:grid-cols-[minmax(0,1fr)_250px]">
          <div className="min-w-0">
            {guide.sections.length > 0 && (
              <nav
                aria-label="Contenido de la guía"
                className="mb-8 rounded-2xl border border-border bg-muted/20 p-5 lg:hidden"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <List className="size-4 text-primary" />
                  En esta guía
                </div>
                <div className="mt-3 space-y-2">
                  {guide.sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={"#seccion-" + index}
                      className="block text-sm text-muted-foreground transition hover:text-foreground"
                    >
                      {section.heading}
                    </a>
                  ))}
                </div>
              </nav>
            )}

            <div className="space-y-10">
              {guide.sections.map((section, index) => (
                <section
                  key={section.id}
                  id={"seccion-" + index}
                  className="scroll-mt-24"
                >
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {section.heading}
                  </h2>
                  {renderSection(section)}
                </section>
              ))}
            </div>

            {guide.sources.length > 0 && (
              <section className="mt-12 border-t border-border pt-8">
                <div className="flex items-center gap-2">
                  <ExternalLink className="size-4 text-primary" />
                  <h2 className="text-xl font-semibold tracking-tight">
                    Fuentes y referencias
                  </h2>
                </div>

                <div className="mt-4 space-y-3">
                  {guide.sources.map((source) => (
                    <a
                      key={source.id}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/25 hover:shadow-sm"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                        <ExternalLink className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium group-hover:text-primary">
                          {source.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {source.publisher || source.source_type}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {guide.related.length > 0 && (
              <section className="mt-12 border-t border-border pt-8">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
                  Sigue aprendiendo
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Otras guías que pueden servirte
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  {guide.related.map((item) => (
                    <Link
                      key={item.id}
                      href={"/guias/" + item.slug}
                      className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
                    >
                      <p className="text-xs text-muted-foreground">
                        {item.reading_time} · {item.difficulty}
                      </p>
                      <h3 className="mt-3 font-semibold tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm leading-5 text-muted-foreground">
                        {item.excerpt}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        Leer
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-6">
            {guide.sections.length > 0 && (
              <nav
                aria-label="Contenido de la guía"
                className="hidden rounded-2xl border border-border bg-card p-5 lg:block"
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ListChecks className="size-4 text-primary" />
                  En esta guía
                </div>
                <div className="mt-4 space-y-2.5">
                  {guide.sections.map((section, index) => (
                    <a
                      key={section.id}
                      href={"#seccion-" + index}
                      className="block text-sm leading-5 text-muted-foreground transition hover:text-foreground"
                    >
                      {section.heading}
                    </a>
                  ))}
                </div>
              </nav>
            )}

            <div className="rounded-2xl border border-border bg-muted/20 p-5">
              <BookOpen className="size-5 text-primary" />
              <p className="mt-4 text-xs font-medium uppercase tracking-[0.16em] text-primary">
                Herramientas
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Complementa esta lectura con una de las herramientas de VidaBajoAgua.
              </p>
              <Link
                href="/guias/herramientas"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
              >
                Ver herramientas
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
