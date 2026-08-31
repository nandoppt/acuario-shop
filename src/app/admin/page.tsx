import {
  Package,
  Boxes,
  Tags,
  Image,
} from "lucide-react";

const cards = [
  {
    title: "Productos",
    description:
      "Administra los productos de tu tienda.",
    value: "Catálogo",
    icon: Package,
    href: "/admin/productos",
  },
  {
    title: "Inventario",
    description:
      "Controla existencias y disponibilidad.",
    value: "Stock",
    icon: Boxes,
    href: "/admin/inventario",
  },
  {
    title: "Categorías",
    description:
      "Organiza tu catálogo por categorías.",
    value: "Organización",
    icon: Tags,
    href: "/admin/categorias",
  },
  {
    title: "Imágenes",
    description:
      "Gestiona las imágenes de tus productos.",
    value: "Galería",
    icon: Image,
    href: "/admin/imagenes",
  },
];

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
          VidaBajoAgua
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Gestiona productos, inventario, categorías e
          imágenes desde un solo lugar.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <a
              key={card.title}
              href={card.href}
              className="group rounded-2xl border border-border bg-background p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon size={20} />
              </div>

              <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {card.value}
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                {card.title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {card.description}
              </p>
            </a>
          );
        })}
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-background p-6">
        <p className="text-sm font-medium">
          Panel administrativo preparado
        </p>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          El siguiente paso será conectar este panel con
          el catálogo real para crear, editar y administrar
          productos.
        </p>
      </section>
    </div>
  );
}