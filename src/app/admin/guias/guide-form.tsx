"use client";

import Link from "next/link";
import { ArrowLeft, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type Section = { heading: string; content: string };
type Category = { id: string; name: string };

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  categories: Category[];
  initial?: {
    title: string;
    slug: string;
    category_id: string | null;
    author_name: string;
    excerpt: string;
    reading_time: string;
    difficulty: string;
    cover_image: string | null;
    featured: boolean;
    status: string;
    sections: Section[];
  };
};

const inputClass = "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const textareaClass = "mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function GuideForm({ action, categories, initial }: Props) {
  const [sections, setSections] = useState<Section[]>(
    initial?.sections.length ? initial.sections : [{ heading: "", content: "" }],
  );

  function updateSection(index: number, field: keyof Section, value: string) {
    setSections((current) => current.map((section, i) => i === index ? { ...section, [field]: value } : section));
  }
  function addSection() { setSections((current) => [...current, { heading: "", content: "" }]); }
  function removeSection(index: number) { setSections((current) => current.length === 1 ? current : current.filter((_, i) => i !== index)); }

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="sections" value={JSON.stringify(sections)} />
      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Contenido</p>
          <h2 className="mt-2 text-lg font-semibold">Información de la guía</h2>
          <p className="mt-1 text-sm text-muted-foreground">Estos datos aparecerán en la biblioteca.</p>
        </div>
        <div className="space-y-5">
          <div><label htmlFor="title" className="text-sm font-medium">Título *</label><input id="title" name="title" required defaultValue={initial?.title ?? ""} placeholder="Ej. Cómo ciclar un acuario" className={inputClass} /></div>
          <div className="grid gap-5 md:grid-cols-2">
            <div><label htmlFor="slug" className="text-sm font-medium">Slug *</label><input id="slug" name="slug" required defaultValue={initial?.slug ?? ""} placeholder="como-ciclar-un-acuario" className={inputClass} /></div>
            <div>
              <label htmlFor="category_id" className="text-sm font-medium">Categoría *</label>
              <select id="category_id" name="category_id" required defaultValue={initial?.category_id ?? ""} className={inputClass}>
                <option value="" disabled>Selecciona una categoría</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="author_name" className="text-sm font-medium">Autor *</label>
            <input id="author_name" name="author_name" required defaultValue={initial?.author_name ?? "VidaBajoAgua"} placeholder="Ej. VidaBajoAgua" className={inputClass} />
            <p className="mt-1 text-xs text-muted-foreground">Nombre que aparecerá como autor de la guía.</p>
          </div>
          <div><label htmlFor="excerpt" className="text-sm font-medium">Descripción corta *</label><textarea id="excerpt" name="excerpt" required rows={3} defaultValue={initial?.excerpt ?? ""} className={textareaClass} /></div>
          <div className="grid gap-5 md:grid-cols-3">
            <div><label htmlFor="reading_time" className="text-sm font-medium">Tiempo de lectura</label><input id="reading_time" name="reading_time" defaultValue={initial?.reading_time ?? "5 min"} className={inputClass} /></div>
            <div><label htmlFor="difficulty" className="text-sm font-medium">Dificultad</label><select id="difficulty" name="difficulty" defaultValue={initial?.difficulty ?? "Básico"} className={inputClass}><option>Básico</option><option>Intermedio</option></select></div>
            <div><label htmlFor="status" className="text-sm font-medium">Estado</label><select id="status" name="status" defaultValue={initial?.status ?? "draft"} className={inputClass}><option value="draft">Borrador</option><option value="published">Publicada</option></select></div>
          </div>
          <div><label htmlFor="cover_image" className="text-sm font-medium">Imagen de portada</label><input id="cover_image" name="cover_image" defaultValue={initial?.cover_image ?? ""} placeholder="URL de imagen (opcional)" className={inputClass} /></div>
          <label className="flex cursor-pointer items-start gap-3"><input type="checkbox" name="featured" defaultChecked={initial?.featured ?? false} className="mt-1 h-4 w-4 rounded border-border" /><span><span className="block text-sm font-medium">Guía destacada</span><span className="mt-1 block text-xs text-muted-foreground">Permite marcarla como contenido destacado.</span></span></label>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="flex items-end justify-between gap-4"><div><p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Contenido</p><h2 className="mt-2 text-lg font-semibold">Secciones</h2><p className="mt-1 text-sm text-muted-foreground">Organiza la guía en bloques fáciles de leer.</p></div><button type="button" onClick={addSection} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"><Plus size={16} /> Agregar</button></div>
        <div className="mt-6 space-y-4">
          {sections.map((section, index) => (
            <div key={index} className="rounded-2xl border border-border bg-muted/20 p-5">
              <div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-medium"><GripVertical size={16} className="text-muted-foreground" />Sección {index + 1}</div><button type="button" onClick={() => removeSection(index)} disabled={sections.length === 1} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-30" aria-label="Eliminar sección"><Trash2 size={15} /></button></div>
              <input value={section.heading} onChange={(e) => updateSection(index, "heading", e.target.value)} placeholder="Título de la sección" className={inputClass} />
              <textarea value={section.content} onChange={(e) => updateSection(index, "content", e.target.value)} placeholder="Escribe el contenido de esta sección..." rows={6} className={textareaClass} />
            </div>
          ))}
        </div>
      </section>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Link href="/admin/guias" className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"><ArrowLeft size={16} className="mr-2" /> Cancelar</Link><button type="submit" className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90">Guardar guía</button></div>
    </form>
  );
}