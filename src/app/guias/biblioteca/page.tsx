import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Droplets, Fish, Lightbulb, Sprout } from "lucide-react";

import { guideCategories, guides } from "@/lib/guides/guides";

export const metadata = {
  title: "Biblioteca de acuarismo",
  description: "Guías prácticas de acuarismo, mantenimiento y aquascaping.",
};

const topics = [
  { label: "Plantas", icon: Sprout },
  { label: "Camarones", icon: Fish },
  { label: "Iluminación", icon: Lightbulb },
  { label: "Agua", icon: Droplets },
];

export default function BibliotecaPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <Link href="/guias" className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <ArrowLeft className="size-4" />
          Centro de guías
        </Link>

        <div className="mt-9 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Biblioteca</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              Guías para avanzar con criterio
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Lecturas prácticas para comprender el acuario antes de tomar decisiones sobre montaje, mantenimiento o habitantes.
            </p>
          </div>
          <BookOpen className="hidden size-10 text-primary/50 md:block" />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {guideCategories.map((category) => (
            <span key={category} className="rounded-full border border-border bg-card px-4 py-2 text-sm">
              {category}
            </span>
          ))}
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guias/${guide.slug}`}
              className="group flex min-h-64 flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-primary">{guide.category}</span>
                <span className="text-xs text-muted-foreground">{guide.readingTime}</span>
              </div>
              <h2 className="mt-6 text-xl font-semibold tracking-tight">{guide.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{guide.excerpt}</p>
              <div className="mt-auto flex items-center justify-between pt-6 text-sm font-medium text-primary">
                <span>{guide.difficulty}</span>
                <span className="inline-flex items-center gap-1">
                  Leer guía
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <section id="temas" className="mt-14 rounded-3xl border border-primary/15 bg-primary/[0.035] p-7 md:p-9">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Próximamente</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Más fichas para consultar rápido</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            La biblioteca crecerá con fichas de plantas, habitantes, iluminación, agua y problemas frecuentes del acuario.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {topics.map((topic) => {
              const Icon = topic.icon;
              return (
                <div key={topic.label} className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-3 text-sm">
                  <Icon className="size-4 text-primary" />
                  {topic.label}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
