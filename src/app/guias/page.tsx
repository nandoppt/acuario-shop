import Link from "next/link";
import {
  ArrowRight,
  Beaker,
  BookOpen,
  Calculator,
  Droplets,
  Fish,
  Lightbulb,
  Sprout,
  Waves,
} from "lucide-react";

export const metadata = {
  title: "Guías de acuarismo",
  description:
    "Biblioteca, herramientas y recursos prácticos para aprender y diseñar tu acuario.",
};

const sections = [
  {
    title: "Biblioteca",
    description: "Guías prácticas sobre ciclado, habitantes, mantenimiento, plantas y aquascaping.",
    href: "/guias/biblioteca",
    icon: BookOpen,
    tone: "from-emerald-600/90 via-emerald-500/80 to-teal-400/80",
    iconBg: "bg-white/95 text-emerald-700",
    label: "Leer y aprender",
  },
  {
    title: "Herramientas",
    description: "Calculadoras para convertir medidas y tomar decisiones antes de montar tu acuario.",
    href: "/guias/herramientas",
    icon: Calculator,
    tone: "from-sky-600/90 via-cyan-500/80 to-blue-400/80",
    iconBg: "bg-white/95 text-sky-700",
    label: "Calcular",
  },
  {
    title: "Primer acuario",
    description: "Una ruta sencilla para pasar de un acuario vacío a un sistema estable.",
    href: "/guias/como-ciclar-un-acuario",
    icon: Waves,
    tone: "from-violet-600/90 via-purple-500/80 to-fuchsia-400/80",
    iconBg: "bg-white/95 text-violet-700",
    label: "Empezar",
  },
  {
    title: "Plantas y habitantes",
    description: "Consulta rápida de temas que iremos ampliando con fichas y recomendaciones.",
    href: "/guias/biblioteca#temas",
    icon: Fish,
    tone: "from-amber-500/95 via-orange-400/85 to-rose-400/80",
    iconBg: "bg-white/95 text-amber-700",
    label: "Explorar temas",
  },
];

const quickLinks = [
  { title: "Ciclado", href: "/guias/como-ciclar-un-acuario", icon: Beaker },
  { title: "Aquascaping", href: "/guias/principios-del-aquascaping", icon: Sprout },
  { title: "Iluminación", href: "/guias/iluminacion-para-plantas", icon: Lightbulb },
  { title: "Cambios de agua", href: "/guias/cambios-de-agua", icon: Droplets },
];

export default function GuiasPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(75,130,104,0.16),transparent_30%),radial-gradient(circle_at_85%_10%,rgba(51,133,166,0.14),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-18">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">
              VidaBajoAgua · Centro de conocimiento
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">
              Aprende. Calcula. Diseña.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
              Todo lo que necesitas para entender mejor tu acuario, reunido en un solo lugar.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.title}
                  href={section.href}
                  className="group overflow-hidden rounded-3xl border border-white/50 bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br ${section.tone}`}>
                    <div className="absolute -right-8 -top-10 size-32 rounded-full bg-white/10" />
                    <div className="absolute -bottom-12 -left-8 size-36 rounded-full bg-black/5" />
                    <div className={`relative flex size-16 items-center justify-center rounded-full shadow-lg ${section.iconBg}`}>
                      <Icon className="size-7" strokeWidth={1.8} />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
                      <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <p className="mt-2 text-sm leading-5 text-muted-foreground">
                      {section.description}
                    </p>
                    <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      {section.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Acceso rápido
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
              ¿Qué estás buscando?
            </h2>
          </div>
          <Link
            href="/guias/biblioteca"
            className="hidden items-center gap-1 text-sm font-medium text-primary sm:flex"
          >
            Ver biblioteca
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/25 hover:shadow-sm"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
                  <Icon className="size-5" />
                </div>
                <span className="text-sm font-medium">{item.title}</span>
                <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
