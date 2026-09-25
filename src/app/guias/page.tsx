import Link from "next/link";
import {
  ArrowRight,
  Beaker,
  BookOpen,
  Droplets,
  Fish,
  Gauge,
  Lightbulb,
  Ruler,
  Sprout,
} from "lucide-react";

import { guideCategories, guides } from "@/lib/guides/guides";

export const metadata = {
  title: "Guías de acuarismo",
  description:
    "Biblioteca de guías y herramientas para aprender, mantener y diseñar tu acuario.",
};

const tools = [
  {
    title: "Calculadora de litraje",
    description: "Calcula el volumen de tu acuario y úsalo como base para tus decisiones.",
    href: "/calculadoras/litraje",
    icon: Gauge,
  },
  {
    title: "Espesor de vidrio",
    description: "Herramienta de referencia para estudiar dimensiones y construcción de acuarios.",
    href: "#proximamente",
    icon: Ruler,
  },
  {
    title: "Cambio de agua",
    description: "Calcula rápidamente cuántos litros debes retirar según el porcentaje elegido.",
    href: "#proximamente",
    icon: Droplets,
  },
  {
    title: "Dosis y proporciones",
    description: "Calculadoras para fertilización y mantenimiento, próximamente.",
    href: "#proximamente",
    icon: Beaker,
  },
];

const quickTopics = [
  { label: "Plantas", icon: Sprout },
  { label: "Camarones", icon: Fish },
  { label: "Iluminación", icon: Lightbulb },
  { label: "Agua", icon: Droplets },
];

export default function GuiasPage() {
  return (
    <main className="min-h-screen">
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
            VidaBajoAgua · Biblioteca
          </p>
          <div className="mt-4 max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              Aprende. Calcula. Diseña.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Una biblioteca de acuarismo pensada para acompañarte desde el primer
              montaje hasta los detalles que hacen especial un aquascape.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {guideCategories.map((category) => (
              <a
                key={category}
                href={category === "Todas" ? "#biblioteca" : "#" + category.toLowerCase()}
                className="rounded-full border border-border bg-background px-4 py-2 text-sm transition hover:border-primary/30 hover:bg-primary/5"
              >
                {category}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="biblioteca" className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-18">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Biblioteca
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              Guías para avanzar con criterio
            </h2>
          </div>
          <BookOpen className="hidden size-7 text-primary/60 sm:block" />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={"/guias/" + guide.slug}
              className="group flex min-h-64 flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-medium uppercase tracking-[0.16em] text-primary">
                  {guide.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {guide.readingTime}
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight">
                {guide.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {guide.excerpt}
              </p>
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
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-18">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Herramientas
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              El acuarismo también se puede calcular
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Pequeñas herramientas para convertir medidas y decisiones en datos
              útiles antes de montar, mantener o modificar tu acuario.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const enabled = tool.href.startsWith("/");
              const className = enabled
                ? "group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-md"
                : "cursor-default rounded-2xl border border-border bg-card p-5 opacity-75";
              return (
                <Link key={tool.title} href={tool.href} className={className}>
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/8 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold">{tool.title}</h3>
                  <p className="mt-2 text-sm leading-5 text-muted-foreground">
                    {tool.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-primary">
                    {enabled ? "Abrir herramienta" : "Próximamente"}
                    {enabled && <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="rounded-3xl border border-primary/15 bg-primary/[0.035] p-7 md:p-10">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            Consulta rápida
          </p>
          <div className="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Encuentra tu próximo tema
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                La biblioteca crecerá con fichas de plantas, habitantes,
                iluminación, agua y problemas frecuentes del acuario.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {quickTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <div
                    key={topic.label}
                    className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm"
                  >
                    <Icon className="size-4 text-primary" />
                    {topic.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
