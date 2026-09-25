import Link from "next/link";
import { ArrowLeft, ArrowRight, Beaker, Calculator, Droplets, Ruler } from "lucide-react";

export const metadata = {
  title: "Herramientas de acuarismo",
  description: "Calculadoras y herramientas prácticas para tu acuario.",
};

const tools = [
  {
    title: "Calculadora de litraje",
    description: "Calcula el volumen bruto y una estimación según el nivel de llenado.",
    href: "/calculadoras/litraje",
    icon: Calculator,
    tone: "from-emerald-600/90 via-teal-500/80 to-cyan-400/80",
    available: true,
  },
  {
    title: "Espesor de vidrio",
    description: "Referencia para estudiar dimensiones y construcción de acuarios.",
    href: "#proximamente",
    icon: Ruler,
    tone: "from-sky-600/90 via-blue-500/80 to-indigo-400/80",
    available: false,
  },
  {
    title: "Cambio de agua",
    description: "Calcula rápidamente cuántos litros debes retirar según el porcentaje.",
    href: "#proximamente",
    icon: Droplets,
    tone: "from-violet-600/90 via-purple-500/80 to-fuchsia-400/80",
    available: false,
  },
  {
    title: "Dosis y proporciones",
    description: "Herramientas para fertilización y mantenimiento del acuario.",
    href: "#proximamente",
    icon: Beaker,
    tone: "from-amber-500/95 via-orange-400/85 to-rose-400/80",
    available: false,
  },
];

export default function HerramientasPage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-14">
        <Link href="/guias" className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <ArrowLeft className="size-4" />
          Centro de guías
        </Link>

        <div className="mt-9 max-w-3xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">Herramientas</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Calcula antes de montar
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Pequeñas herramientas para convertir medidas y decisiones de acuarismo en datos útiles.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => {
            const Icon = tool.icon;

            if (!tool.available) {
              return (
                <div
                  key={tool.title}
                  className="overflow-hidden rounded-3xl border border-border bg-card opacity-80 shadow-sm"
                >
                  <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${tool.tone}`}>
                    <div className="flex size-14 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg">
                      <Icon className="size-6" strokeWidth={1.8} />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-semibold tracking-tight">{tool.title}</h2>
                      <span className="text-xs text-muted-foreground">En desarrollo</span>
                    </div>
                    <p className="mt-2 text-sm leading-5 text-muted-foreground">{tool.description}</p>
                    <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      Próximamente
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={tool.title}
                href={tool.href}
                className="group overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg"
              >
                <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${tool.tone}`}>
                  <div className="flex size-14 items-center justify-center rounded-full bg-white/95 text-primary shadow-lg">
                    <Icon className="size-6" strokeWidth={1.8} />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold tracking-tight">{tool.title}</h2>
                    <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mt-2 text-sm leading-5 text-muted-foreground">{tool.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    Abrir herramienta
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </main>
  );
}
