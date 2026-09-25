import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { GuideForm } from "../guide-form";
import { createGuide } from "../actions";

export const dynamic = "force-dynamic";

export default async function NuevaGuiaPage() {
  const supabase = await createClient();

  const [{ data: categories, error: categoriesError }, { data: profiles, error: profilesError }] =
    await Promise.all([
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
    ]);

  if (categoriesError) throw new Error(categoriesError.message);
  if (profilesError) throw new Error(profilesError.message);

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
              Nueva guía
            </h1>
          </div>
        </div>
      </div>

      <GuideForm
        action={createGuide}
        categories={categories ?? []}
        authors={authors}
      />
    </div>
  );
}
