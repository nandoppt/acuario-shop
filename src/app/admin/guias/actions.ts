"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type BlockType = "text" | "callout" | "list" | "steps";
type SourceType = "Referencia" | "Fuente académica" | "Fabricante" | "Organización";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") redirect("/");
  return supabase;
}

function parseForm(formData: FormData) {
  let sections: { heading: string; content: string; block_type: BlockType }[] = [];
  let sources: { title: string; url: string; publisher: string; source_type: SourceType }[] = [];

  try {
    const parsed = JSON.parse(String(formData.get("sections") ?? "[]"));
    if (Array.isArray(parsed)) {
      sections = parsed
        .filter(
          (section) =>
            section &&
            String(section.heading).trim() &&
            String(section.content).trim(),
        )
        .map((section) => ({
          heading: String(section.heading).trim(),
          content: String(section.content).trim(),
          block_type: ["text", "callout", "list", "steps"].includes(
            String(section.block_type),
          )
            ? (String(section.block_type) as BlockType)
            : "text",
        }));
    }
  } catch {}

  try {
    const parsed = JSON.parse(String(formData.get("sources") ?? "[]"));
    if (Array.isArray(parsed)) {
      sources = parsed
        .filter(
          (source) =>
            source &&
            String(source.title).trim() &&
            String(source.url).trim(),
        )
        .map((source) => ({
          title: String(source.title).trim(),
          url: String(source.url).trim(),
          publisher: String(source.publisher ?? "").trim(),
          source_type: ["Referencia", "Fuente académica", "Fabricante", "Organización"].includes(
            String(source.source_type),
          )
            ? (String(source.source_type) as SourceType)
            : "Referencia",
        }));
    }
  } catch {}

  return {
    slug: String(formData.get("slug") ?? "").trim(),
    title: String(formData.get("title") ?? "").trim(),
    category_id: String(formData.get("category_id") ?? "").trim(),
    author_name: String(formData.get("author_name") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    reading_time: String(formData.get("reading_time") ?? "5 min").trim(),
    difficulty: String(formData.get("difficulty") ?? "Básico"),
    cover_image: String(formData.get("cover_image") ?? "").trim() || null,
    cover_alt: String(formData.get("cover_alt") ?? "").trim(),
    featured: formData.get("featured") === "on",
    status:
      String(formData.get("status") ?? "draft") === "published"
        ? "published"
        : String(formData.get("status") ?? "draft") === "archived"
          ? "archived"
          : "draft",
    sections,
    sources,
  };
}

async function prepareGuideData(
  supabase: Awaited<ReturnType<typeof requireAdmin>>,
  data: ReturnType<typeof parseForm>,
) {
  if (
    !data.title ||
    !data.slug ||
    !data.category_id ||
    !data.author_name ||
    !data.excerpt
  ) {
    throw new Error("Completa título, categoría, autor y descripción.");
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    throw new Error(
      "El slug solo puede contener minúsculas, números y guiones.",
    );
  }

  const { data: category, error } = await supabase
    .from("guide_categories")
    .select("id, name")
    .eq("id", data.category_id)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!category) {
    throw new Error("La categoría seleccionada no existe o está inactiva.");
  }

  for (const source of data.sources) {
    try {
      const parsed = new URL(source.url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error();
      }
    } catch {
      throw new Error("Revisa las URLs de las fuentes.");
    }
  }

  return { ...data, category: category.name };
}

export async function createGuide(formData: FormData) {
  const supabase = await requireAdmin();
  const data = await prepareGuideData(supabase, parseForm(formData));

  const publishedAt =
    data.status === "published" ? new Date().toISOString() : null;

  const { data: guide, error } = await supabase
    .from("guides")
    .insert({
      slug: data.slug,
      title: data.title,
      category: data.category,
      category_id: data.category_id,
      author_name: data.author_name,
      excerpt: data.excerpt,
      reading_time: data.reading_time,
      difficulty: data.difficulty,
      cover_image: data.cover_image,
      cover_alt: data.cover_alt,
      featured: data.featured,
      status: data.status,
      published_at: publishedAt,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  if (data.sections.length) {
    const { error: sectionsError } = await supabase
      .from("guide_sections")
      .insert(
        data.sections.map((section, index) => ({
          guide_id: guide.id,
          heading: section.heading,
          content: section.content,
          block_type: section.block_type,
          sort_order: index + 1,
        })),
      );

    if (sectionsError) throw new Error(sectionsError.message);
  }

  if (data.sources.length) {
    const { error: sourcesError } = await supabase
      .from("guide_sources")
      .insert(
        data.sources.map((source, index) => ({
          guide_id: guide.id,
          title: source.title,
          url: source.url,
          publisher: source.publisher,
          source_type: source.source_type,
          sort_order: index + 1,
        })),
      );

    if (sourcesError) throw new Error(sourcesError.message);
  }

  revalidatePath("/guias");
  revalidatePath("/guias/biblioteca");
  revalidatePath("/admin/guias");
  redirect("/admin/guias");
}

export async function updateGuide(id: string, formData: FormData) {
  const supabase = await requireAdmin();
  const data = await prepareGuideData(supabase, parseForm(formData));

  const { data: currentGuide, error: currentError } = await supabase
    .from("guides")
    .select("published_at")
    .eq("id", id)
    .single();

  if (currentError) throw new Error(currentError.message);

  const publishedAt =
    data.status === "published"
      ? currentGuide.published_at ?? new Date().toISOString()
      : currentGuide.published_at;

  const { error } = await supabase
    .from("guides")
    .update({
      slug: data.slug,
      title: data.title,
      category: data.category,
      category_id: data.category_id,
      author_name: data.author_name,
      excerpt: data.excerpt,
      reading_time: data.reading_time,
      difficulty: data.difficulty,
      cover_image: data.cover_image,
      cover_alt: data.cover_alt,
      featured: data.featured,
      status: data.status,
      published_at: publishedAt,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  const { error: deleteSectionsError } = await supabase
    .from("guide_sections")
    .delete()
    .eq("guide_id", id);

  if (deleteSectionsError) throw new Error(deleteSectionsError.message);

  if (data.sections.length) {
    const { error: sectionsError } = await supabase
      .from("guide_sections")
      .insert(
        data.sections.map((section, index) => ({
          guide_id: id,
          heading: section.heading,
          content: section.content,
          block_type: section.block_type,
          sort_order: index + 1,
        })),
      );

    if (sectionsError) throw new Error(sectionsError.message);
  }

  const { error: deleteSourcesError } = await supabase
    .from("guide_sources")
    .delete()
    .eq("guide_id", id);

  if (deleteSourcesError) throw new Error(deleteSourcesError.message);

  if (data.sources.length) {
    const { error: sourcesError } = await supabase
      .from("guide_sources")
      .insert(
        data.sources.map((source, index) => ({
          guide_id: id,
          title: source.title,
          url: source.url,
          publisher: source.publisher,
          source_type: source.source_type,
          sort_order: index + 1,
        })),
      );

    if (sourcesError) throw new Error(sourcesError.message);
  }

  revalidatePath("/guias");
  revalidatePath("/guias/biblioteca");
  revalidatePath("/admin/guias");
  revalidatePath("/guias/" + data.slug);
  redirect("/admin/guias");
}
