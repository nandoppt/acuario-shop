import { createClient } from "@/lib/supabase/server";
import { createGuideCategory, toggleGuideCategory } from "../actions-categories";

export const dynamic="force-dynamic";

export default async function GuideCategoriesPage(){
  const supabase=await createClient();
  const {data:categories,error}=await supabase.from("guide_categories").select("id,name,slug,description,is_active,sort_order").order("sort_order");
  if(error) throw new Error(error.message);
  return <div className="mx-auto max-w-4xl space-y-8">
    <div><p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Biblioteca</p><h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Categorías</h1><p className="mt-2 text-muted-foreground">Las categorías activas alimentan el selector de las guías y aparecen en la biblioteca.</p></div>
    <form action={createGuideCategory} className="rounded-2xl border border-border bg-background p-6">
      <h2 className="font-semibold">Nueva categoría</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-[1fr_1.5fr_auto] md:items-end">
        <div><label htmlFor="name" className="text-sm font-medium">Nombre</label><input id="name" name="name" required placeholder="Ej. Filtración" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/></div>
        <div><label htmlFor="description" className="text-sm font-medium">Descripción</label><input id="description" name="description" placeholder="Tema de la categoría" className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"/></div>
        <button type="submit" className="h-11 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground">Agregar</button>
      </div>
    </form>
    <div className="overflow-hidden rounded-2xl border border-border bg-background divide-y divide-border">
      {(categories??[]).map((category)=><div key={category.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><div className="flex items-center gap-2"><h2 className="font-semibold">{category.name}</h2><span className={\`rounded-full px-2.5 py-1 text-xs font-medium \${category.is_active?"bg-primary/10 text-primary":"bg-muted text-muted-foreground"}\`}>{category.is_active?"Activa":"Inactiva"}</span></div><p className="mt-1 text-sm text-muted-foreground">{category.description||"Sin descripción"} · /{category.slug}</p></div>
        <form action={toggleGuideCategory.bind(null,category.id,!category.is_active)}><button className="rounded-xl border border-border px-4 py-2 text-sm font-medium hover:bg-muted">{category.is_active?"Desactivar":"Activar"}</button></form>
      </div>)}
    </div>
  </div>;
}