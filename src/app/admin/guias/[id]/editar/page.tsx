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
  const { data: guide, error } = await supabase.from("guides").select("id, title, slug, category_id, author_name, excerpt, reading_time, difficulty, cover_image, featured, status").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  if (!guide) notFound();
  const { data: categories, error: categoriesError } = await supabase.from("guide_categories").select("id, name").eq("is_active", true).order("sort_order");
  if (categoriesError) throw new Error(categoriesError.message);
  const { data: sections, error: sectionsError } = await supabase.from("guide_sections").select("heading, content, sort_order").eq("guide_id", id).order("sort_order");
  if (sectionsError) throw new Error(sectionsError.message);
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div><Link href="/admin/guias" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Volver a guías</Link><div className="mt-6 flex items-center gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen size={24} /></div><div><p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Contenido</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Editar guía</h1></div></div></div>
      <GuideForm action={updateGuide.bind(null, guide.id)} categories={categories ?? []} initial={{ ...guide, sections: sections ?? [] }} />
    </div>
  );
}