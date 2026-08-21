export type ProductCategory =
  | "plantas"
  | "iluminacion"
  | "filtracion"
  | "sustratos"
  | "co2"
  | "fertilizacion"
  | "alimentacion"
  | "accesorios";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;

  category: ProductCategory;

  price: number;
  previousPrice?: number;

  stock: number;
  featured: boolean;

  brand?: string;

  image?: string;
};
export const mockProducts: Product[] = [
  {
    id: "prod-001",
    name: "Anubias Nana",
    slug: "anubias-nana",
    description:
      "Planta resistente y de crecimiento lento, ideal para acuarios naturales.",
    category: "plantas",
    price: 7.5,
    stock: 12,
    featured: true,
    brand: "VidaBajoAgua",
  },

  {
    id: "prod-002",
    name: "Bucephalandra Green",
    slug: "bucephalandra-green",
    description:
      "Planta de rizoma ideal para composiciones de aquascaping.",
    category: "plantas",
    price: 9.5,
    stock: 8,
    featured: true,
    brand: "VidaBajoAgua",
  },

  {
    id: "prod-003",
    name: "Week Aqua P600",
    slug: "week-aqua-p600",
    description:
      "Iluminación LED para acuarios plantados y composiciones de aquascaping.",
    category: "iluminacion",
    price: 120,
    stock: 3,
    featured: true,
    brand: "Week Aqua",
  },

  {
    id: "prod-004",
    name: "Sustrato Premium Plantado",
    slug: "sustrato-premium-plantado",
    description:
      "Sustrato nutritivo para favorecer el desarrollo de plantas acuáticas.",
    category: "sustratos",
    price: 18,
    stock: 10,
    featured: true,
  },

  {
    id: "prod-005",
    name: "Filtro Externo 600 L/h",
    slug: "filtro-externo-600lh",
    description:
      "Sistema de filtración externa para mantener el agua limpia y cristalina.",
    category: "filtracion",
    price: 65,
    stock: 5,
    featured: false,
  },

  {
    id: "prod-006",
    name: "Fertilizante para Plantas",
    slug: "fertilizante-plantas-acuaticas",
    description:
      "Nutrientes para mantener un crecimiento saludable de las plantas.",
    category: "fertilizacion",
    price: 12,
    stock: 15,
    featured: true,
  },

  {
    id: "prod-007",
    name: "Sistema CO₂ Básico",
    slug: "sistema-co2-basico",
    description:
      "Sistema de aporte de CO₂ para acuarios plantados.",
    category: "co2",
    price: 45,
    stock: 4,
    featured: false,
  },

  {
    id: "prod-008",
    name: "Alimento Premium para Peces",
    slug: "alimento-premium-peces",
    description:
      "Alimento de calidad para peces ornamentales.",
    category: "alimentacion",
    price: 8.5,
    stock: 20,
    featured: false,
  },

  {
    id: "prod-009",
    name: "Pinza para Plantado",
    slug: "pinza-para-plantado",
    description:
      "Herramienta para plantar y mantener composiciones de aquascaping.",
    category: "accesorios",
    price: 6,
    stock: 10,
    featured: false,
  },

  {
    id: "prod-010",
    name: "Tijera de Aquascaping",
    slug: "tijera-aquascaping",
    description:
      "Tijera de precisión para poda y mantenimiento de plantas acuáticas.",
    category: "accesorios",
    price: 15,
    stock: 6,
    featured: true,
  },
];
export function getProductBySlug(slug: string) {
  return mockProducts.find((product) => product.slug === slug);
}