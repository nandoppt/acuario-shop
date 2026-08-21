import Link from "next/link";
import {
  Sprout,
  Lightbulb,
  Waves,
  Mountain,
  Wind,
  FlaskConical,
  Utensils,
  Wrench,
} from "lucide-react";

const categories = [
  {
    name: "Plantas",
    description: "Dale vida y equilibrio a tu acuario.",
    href: "/tienda?categoria=plantas",
    icon: Sprout,
  },
  {
    name: "Iluminación",
    description: "Luz para resaltar cada detalle.",
    href: "/tienda?categoria=iluminacion",
    icon: Lightbulb,
  },
  {
    name: "Filtración",
    description: "Agua limpia para un ecosistema saludable.",
    href: "/tienda?categoria=filtracion",
    icon: Waves,
  },
  {
    name: "Sustratos",
    description: "La base para un paisaje natural.",
    href: "/tienda?categoria=sustratos",
    icon: Mountain,
  },
  {
    name: "CO₂",
    description: "Impulsa el crecimiento de tus plantas.",
    href: "/tienda?categoria=co2",
    icon: Wind,
  },
  {
    name: "Fertilización",
    description: "Nutrientes para un crecimiento saludable.",
    href: "/tienda?categoria=fertilizacion",
    icon: FlaskConical,
  },
  {
    name: "Alimentación",
    description: "Nutrición para los habitantes del acuario.",
    href: "/tienda?categoria=alimentacion",
    icon: Utensils,
  },
  {
    name: "Accesorios",
    description: "Las herramientas para cuidar tu mundo acuático.",
    href: "/tienda?categoria=accesorios",
    icon: Wrench,
  },
];

type CategoryGridProps = {
  title?: string;
  description?: string;
};

export function CategoryGrid({
  title = "Todo para crear tu mundo acuático.",
  description = "Encuentra plantas, equipamiento y accesorios seleccionados para ayudarte a construir un acuario saludable y lleno de vida.",
}: CategoryGridProps) {
  return (
    <section className="bg-background px-4 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
            Categorías
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            {title}
          </h1>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={category.href}
                className="group rounded-2xl border border-border bg-card p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon size={21} strokeWidth={1.8} />
                </div>

                <h2 className="mt-5 text-lg font-semibold">
                  {category.name}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>

                <div className="mt-5 text-sm font-medium text-primary">
                  Explorar →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}