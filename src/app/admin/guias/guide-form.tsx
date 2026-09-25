"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, GripVertical, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

type Section = {
  heading: string;
  content: string;
  block_type: "text" | "callout" | "list" | "steps";
};

type Source = {
  title: string;
  url: string;
  publisher: string;
  source_type: "Referencia" | "Fuente académica" | "Fabricante" | "Organización";
};

type Category = { id: string; name: string };

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  categories: Category[];
  authors: { id: string; name: string }[];
  initial?: {
    title: string;
    slug: string;
    category_id: string | null;
    author_name: string;
    excerpt: string;
    reading_time: string;
    difficulty: string;
    cover_image: string | null;
    cover_alt: string;
    featured: boolean;
    status: string;
    sections: Section[];
    sources: Source[];
  };
};

const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const textareaClass =
  "mt-2 w-full rounded-xl border border-border bg-background px-3 py-3 text-sm leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function GuideForm({ action, categories, authors, initial }: Props) {
  const [sections, setSections] = useState<Section[]>(
    initial?.sections.length
      ? initial.sections
      : [{ heading: "", content: "", block_type: "text" }],
  );
  const [sources, setSources] = useState<Source[]>(
    initial?.sources ?? [],
  );

  function updateSection(
    index: number,
    field: keyof Section,
    value: string,
  ) {
    setSections((current) =>
      current.map((section, i) =>
        i === index ? { ...section, [field]: value } : section,
      ),
    );
  }

  function addSection() {
    setSections((current) => [
      ...current,
      { heading: "", content: "", block_type: "text" },
    ]);
  }

  function removeSection(index: number) {
    setSections((current) =>
      current.length === 1
        ? current
        : current.filter((_, i) => i !== index),
    );
  }

  function updateSource(index: number, field: keyof Source, value: string) {
    setSources((current) =>
      current.map((source, i) =>
        i === index ? { ...source, [field]: value } : source,
      ),
    );
  }

  function addSource() {
    setSources((current) => [
      ...current,
      {
        title: "",
        url: "",
        publisher: "",
        source_type: "Referencia",
      },
    ]);
  }

  function removeSource(index: number) {
    setSources((current) => current.filter((_, i) => i !== index));
  }

  return (
    <form action={action} className="space-y-6">
      <input
        type="hidden"
        name="sections"
        value={JSON.stringify(sections)}
      />
      <input
        type="hidden"
        name="sources"
        value={JSON.stringify(sources)}
      />

      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Contenido
          </p>
          <h2 className="mt-2 text-lg font-semibold">
            Información de la guía
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Estos datos aparecerán en la biblioteca y en el artículo.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Título *
            </label>
            <input
              id="title"
              name="title"
              required
              defaultValue={initial?.title ?? ""}
              placeholder="Ej. Cómo ciclar un acuario"
              className={inputClass}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="slug" className="text-sm font-medium">
                Slug *
              </label>
              <input
                id="slug"
                name="slug"
                required
                defaultValue={initial?.slug ?? ""}
                placeholder="como-ciclar-un-acuario"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="category_id" className="text-sm font-medium">
                Categoría *
              </label>
              <select
                id="category_id"
                name="category_id"
                required
                defaultValue={initial?.category_id ?? ""}
                className={inputClass}
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="author_name" className="text-sm font-medium">
              Autor *
            </label>
            <input
              id="author_name"
              name="author_name"
              required
              list="guide-authors"
              defaultValue={initial?.author_name ?? "VidaBajoAgua"}
              placeholder="Ej. VidaBajoAgua"
              className={inputClass}
            />
            <datalist id="guide-authors">
              {authors.map((author) => (
                <option key={author.id} value={author.name} />
              ))}
              <option value="VidaBajoAgua" />
            </datalist>
            <p className="mt-1 text-xs text-muted-foreground">
              Puedes elegir un administrador existente o escribir un nombre editorial.
            </p>
          </div>

          <div>
            <label htmlFor="excerpt" className="text-sm font-medium">
              Descripción corta *
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              required
              rows={3}
              defaultValue={initial?.excerpt ?? ""}
              placeholder="Resume qué aprenderá el lector."
              className={textareaClass}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label htmlFor="reading_time" className="text-sm font-medium">
                Tiempo de lectura
              </label>
              <input
                id="reading_time"
                name="reading_time"
                defaultValue={initial?.reading_time ?? "5 min"}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="text-sm font-medium">
                Dificultad
              </label>
              <select
                id="difficulty"
                name="difficulty"
                defaultValue={initial?.difficulty ?? "Básico"}
                className={inputClass}
              >
                <option>Básico</option>
                <option>Intermedio</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="text-sm font-medium">
                Estado
              </label>
              <select
                id="status"
                name="status"
                defaultValue={initial?.status ?? "draft"}
                className={inputClass}
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicada</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="cover_image" className="text-sm font-medium">
              Imagen de portada
            </label>
            <input
              id="cover_image"
              name="cover_image"
              defaultValue={initial?.cover_image ?? ""}
              placeholder="URL de imagen (opcional)"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="cover_alt" className="text-sm font-medium">
              Texto alternativo de portada
            </label>
            <input
              id="cover_alt"
              name="cover_alt"
              defaultValue={initial?.cover_alt ?? ""}
              placeholder="Describe la imagen para accesibilidad."
              className={inputClass}
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={initial?.featured ?? false}
              className="mt-1 h-4 w-4 rounded border-border"
            />
            <span>
              <span className="block text-sm font-medium">
                Guía destacada
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                Permite priorizarla en la biblioteca.
              </span>
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Estructura
            </p>
            <h2 className="mt-2 text-lg font-semibold">Contenido modular</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Cada bloque puede ser texto, consejo, lista o pasos.
            </p>
          </div>
          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <Plus size={16} />
            Agregar bloque
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-muted/20 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GripVertical
                    size={16}
                    className="text-muted-foreground"
                  />
                  Bloque {index + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  disabled={sections.length === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                  aria-label="Eliminar bloque"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-[1fr_220px]">
                <input
                  value={section.heading}
                  onChange={(e) =>
                    updateSection(index, "heading", e.target.value)
                  }
                  placeholder="Título del bloque"
                  className={inputClass}
                />
                <select
                  value={section.block_type}
                  onChange={(e) =>
                    updateSection(index, "block_type", e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="text">Texto</option>
                  <option value="callout">Consejo / aviso</option>
                  <option value="list">Lista</option>
                  <option value="steps">Pasos</option>
                </select>
              </div>

              <textarea
                value={section.content}
                onChange={(e) =>
                  updateSection(index, "content", e.target.value)
                }
                placeholder={
                  section.block_type === "text"
                    ? "Escribe uno o varios párrafos. Usa una línea en blanco para separar párrafos."
                    : "Escribe un elemento por línea."
                }
                rows={6}
                className={textareaClass}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-background p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Fuentes
            </p>
            <h2 className="mt-2 text-lg font-semibold">Referencias</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Añade las fuentes que respaldan la información de la guía.
            </p>
          </div>
          <button
            type="button"
            onClick={addSource}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            <Plus size={16} />
            Agregar fuente
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {sources.length === 0 && (
            <p className="rounded-xl border border-dashed border-border px-4 py-4 text-sm text-muted-foreground">
              Todavía no hay fuentes agregadas.
            </p>
          )}

          {sources.map((source, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-muted/20 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ExternalLink size={16} className="text-primary" />
                  Fuente {index + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeSource(index)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Eliminar fuente"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <input
                    value={source.title}
                    onChange={(e) =>
                      updateSource(index, "title", e.target.value)
                    }
                    placeholder="Nombre del artículo o documento"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Editorial / organización</label>
                  <input
                    value={source.publisher}
                    onChange={(e) =>
                      updateSource(index, "publisher", e.target.value)
                    }
                    placeholder="UF/IFAS, Aqueon, Tropica..."
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">URL</label>
                <input
                  type="url"
                  value={source.url}
                  onChange={(e) =>
                    updateSource(index, "url", e.target.value)
                  }
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>

              <div className="mt-4 max-w-xs">
                <label className="text-sm font-medium">Tipo</label>
                <select
                  value={source.source_type}
                  onChange={(e) =>
                    updateSource(index, "source_type", e.target.value)
                  }
                  className={inputClass}
                >
                  <option>Referencia</option>
                  <option>Fuente académica</option>
                  <option>Fabricante</option>
                  <option>Organización</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/admin/guias"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
        >
          <ArrowLeft size={16} className="mr-2" />
          Cancelar
        </Link>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90"
        >
          Guardar guía
        </button>
      </div>
    </form>
  );
}
