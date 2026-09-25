import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { updateGuide } from "../../actions";
import { GuideForm } from "../../guide-form";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function EditarGuiaPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: guide, error: guideError }, { data: categories, error: categoriesError }, { data: profiles, error: profilesError }, { data: sections, error: sectionsError }, { data: sources, error: sourcesError }] =
    await Promise.all([
      supabase
        .from("guides")
        .select(
          "id, title, slug, category_id, author_name, excerpt, reading_time, difficulty, cover_image, cover_alt, featured, status",
        )
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("guide_categories")
        .select("id, name")
        .eq("is_active", true)
        .order("sort_order"),
      supabase
        .from("profiles")
        .select("id, first_name, last_name")
        .eq("role", "admin")
        .order("first_name"),
      supabase
        .from("guide_sections")
        .select("heading, content, block_type, sort_order")
        .eq("guide_id", id)
        .order("sort_order"),
      supabase
        .from("guide_sources")
        .select("title, url, publisher, source_type, sort_order")
        .eq("guide_id", id)
        .order("sort_order"),
    ]);

  if (guideError) throw new Error(guideError.message);
  if (!guide) notFound();
  if (categoriesError) throw new Error(categoriesError.message);
  if (profilesError) throw new Error(profilesError.message);
  if (sectionsError) throw new Error(sectionsError.message);
  if (sourcesError) throw new Error(sourcesError.message);

  const authors = (profiles ?? []).map((profile) => ({
    id: profile.id,
    name:
      [profile.first_name, profile.last_name].filter(Boolean).join(" ") ||
      "Administrador",
  }));

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link
          href="/admin/guias"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={16} /> Volver a guías
        </Link>

        <div className="mt-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
              Contenido
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Editar guía
            </h1>
          </div>
        </div>
      </div>

      <GuideForm
        action={updateGuide.bind(null, guide.id)}
        categories={categories ?? []}
        authors={authors}
        initial={{
          ...guide,
          sections: (sections ?? []).map((section) => ({
            heading: section.heading,
            content: section.content,
            block_type:
              ["text", "callout", "list", "steps"].includes(
                section.block_type,
              )
                ? (section.block_type as
                    | "text"
                    | "callout"
                    | "list"
                    | "steps")
                : "text",
          })),
          sources: (sources ?? []).map((source) => ({
            title: source.title,
            url: source.url,
            publisher: source.publisher,
            source_type:
              ["Referencia", "Fuente académica", "Fabricante", "Organización"].includes(
                source.source_type,
              )
                ? (source.source_type as
                    | "Referencia"
                    | "Fuente académica"
                    | "Fabricante"
                    | "Organización")
                : "Referencia",
          })),
        }}
      />
    </div>
  );
}
