"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") redirect("/");
  return supabase;
}

function parseForm(formData: FormData) {
  let sections: { heading: string; content: string }[] = [];
  try {
    const parsed = JSON.parse(String(formData.get("sections") ?? "[]"));
    if (Array.isArray(parsed)) sections = parsed.filter((section) => section && String(section.heading).trim() && String(section.content).trim()).map((section) => ({ heading: String(section.heading).trim(), content: String(section.content).trim() }));
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
    featured: formData.get("featured") === "on",
    status: String(formData.get("status") ?? "draft") === "published" ? "published" : "draft",
    sections,
  };
}

async function prepareGuideData(supabase: Awaited<ReturnType<typeof requireAdmin>>, data: ReturnType<typeof parseForm>) {
  if (!data.title || !data.slug || !data.category_id || !data.author_name || !data.excerpt) throw new Error("Completa título, categoría, autor y descripción.");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) throw new Error("El slug solo puede contener minúsculas, números y guiones.");
  const { data: category, error } = await supabase.from("guide_categories").select("id, name").eq("id", data.category_id).eq("is_active", true).maybeSingle();
  if (error) throw new Error(error.message);
  if (!category) throw new Error("La categoría seleccionada no existe o está inactiva.");
  return { ...data, category: category.name };
}

export async function createGuide(formData: FormData) {
  const supabase = await requireAdmin();
  const data = await prepareGuideData(supabase, parseForm(formData));
  const { data: guide, error } = await supabase.from("guides").insert({
    slug: data.slug, title: data.title, category: data.category, category_id: data.category_id, author_name: data.author_name,
    excerpt: data.excerpt, reading_time: data.reading_time, difficulty: data.difficulty, cover_image: data.cover_image, featured: data.featured, status: data.status,
  }).select("id").single();
  if (error) throw new Error(error.message);
  if (data.sections.length) {
    const { error: sectionsError } = await supabase.from("guide_sections").insert(data.sections.map((section, index) => ({ guide_id: guide.id, heading: section.heading, content: section.content, sort_order: index + 1 })));
    if (sectionsError) throw new Error(sectionsError.message);
  }
  revalidatePath("/guias"); revalidatePath("/guias/biblioteca"); revalidatePath("/admin/guias"); redirect("/admin/guias");
}

export async function updateGuide(id: string, formData: FormData) {
  const supabase = await requireAdmin();
  const data = await prepareGuideData(supabase, parseForm(formData));
  const { error } = await supabase.from("guides").update({
    slug: data.slug, title: data.title, category: data.category, category_id: data.category_id, author_name: data.author_name,
    excerpt: data.excerpt, reading_time: data.reading_time, difficulty: data.difficulty, cover_image: data.cover_image, featured: data.featured, status: data.status,
  }).eq("id", id);
  if (error) throw new Error(error.message);
  const { error: deleteError } = await supabase.from("guide_sections").delete().eq("guide_id", id);
  if (deleteError) throw new Error(deleteError.message);
  if (data.sections.length) {
    const { error: sectionsError } = await supabase.from("guide_sections").insert(data.sections.map((section, index) => ({ guide_id: id, heading: section.heading, content: section.content, sort_order: index + 1 })));
    if (sectionsError) throw new Error(sectionsError.message);
  }
  revalidatePath("/guias"); revalidatePath("/guias/biblioteca"); revalidatePath("/admin/guias"); revalidatePath("/guias/" + data.slug); redirect("/admin/guias");
}