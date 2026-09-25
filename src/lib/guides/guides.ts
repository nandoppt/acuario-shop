export type Guide = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  readingTime: string;
  difficulty: "Básico" | "Intermedio";
  featured?: boolean;
  sections: { heading: string; paragraphs: string[] }[];
};

export const guides: Guide[] = [
  {
    slug: "como-ciclar-un-acuario",
    title: "Cómo ciclar un acuario correctamente",
    category: "Ciclado",
    excerpt: "Entiende el ciclo del nitrógeno y prepara un acuario estable antes de introducir peces o camarones.",
    readingTime: "8 min",
    difficulty: "Básico",
    featured: true,
    sections: [
      { heading: "Qué estás buscando conseguir", paragraphs: ["El ciclado establece una colonia de bacterias capaces de transformar los residuos nitrogenados del acuario. El objetivo no es simplemente esperar unos días, sino conseguir un sistema biológico capaz de procesar la carga que tendrá el acuario."] },
      { heading: "El ciclo del nitrógeno", paragraphs: ["Los residuos y la materia orgánica pueden generar amonio. Las bacterias nitrificantes convierten ese compuesto en nitrito y posteriormente en nitrato. El seguimiento de estos parámetros permite comprobar cómo evoluciona el sistema."] },
      { heading: "Método sin peces", paragraphs: ["El ciclado sin peces permite desarrollar la filtración biológica sin exponer animales a concentraciones potencialmente peligrosas. La estrategia consiste en aportar una fuente controlada de nitrógeno y comprobar mediante test que el sistema puede procesarla."] },
      { heading: "Cuándo avanzar", paragraphs: ["No tomes el calendario como única referencia. Comprueba los parámetros y observa que el sistema procese la carga de nitrógeno de forma consistente antes de introducir habitantes."] },
    ],
  },
  {
    slug: "aclimatacion-de-peces-y-camarones",
    title: "Aclimatación de peces y camarones",
    category: "Habitantes",
    excerpt: "Una introducción cuidadosa reduce el impacto del cambio de temperatura y parámetros del agua.",
    readingTime: "6 min",
    difficulty: "Básico",
    featured: true,
    sections: [
      { heading: "Antes de abrir la bolsa", paragraphs: ["Apaga o reduce la iluminación y prepara todo lo necesario antes de empezar. Evita introducir directamente el agua de transporte al acuario cuando sea posible."] },
      { heading: "Igualar condiciones", paragraphs: ["La temperatura y la química del agua pueden ser diferentes entre el transporte y tu acuario. La aclimatación debe permitir una transición gradual y controlada."] },
      { heading: "Especial cuidado con camarones", paragraphs: ["Los camarones suelen ser sensibles a cambios bruscos. Una aclimatación lenta y una manipulación mínima ayudan a reducir el estrés durante la introducción."] },
    ],
  },
  {
    slug: "principios-del-aquascaping",
    title: "Principios básicos del aquascaping",
    category: "Aquascaping",
    excerpt: "Aprende a construir una composición equilibrada usando proporción, profundidad, masas y puntos focales.",
    readingTime: "9 min",
    difficulty: "Intermedio",
    featured: true,
    sections: [
      { heading: "Empieza por la composición", paragraphs: ["Antes de plantar, define dónde estará el punto focal y cómo se moverá la mirada por el paisaje. Una buena composición no depende de llenar cada espacio."] },
      { heading: "Hardscape", paragraphs: ["Rocas y raíces forman la estructura visual. Trabaja con diferentes tamaños, direcciones y espacios negativos para crear profundidad."] },
      { heading: "Plantas y escala", paragraphs: ["Combina especies según tamaño, textura y velocidad de crecimiento. Las plantas pequeñas hacia el fondo visual y las masas bien definidas ayudan a reforzar la sensación de profundidad."] },
    ],
  },
  {
    slug: "cambios-de-agua",
    title: "Cómo hacer un cambio de agua",
    category: "Mantenimiento",
    excerpt: "Una rutina sencilla para retirar agua, preparar el reemplazo y mantener estable tu acuario.",
    readingTime: "5 min",
    difficulty: "Básico",
    sections: [
      { heading: "Prepara el agua", paragraphs: ["Calcula cuánto volumen vas a reemplazar y prepara el agua nueva con condiciones compatibles con el acuario."] },
      { heading: "Retira el agua", paragraphs: ["Aprovecha el cambio para retirar residuos visibles del sustrato sin remover innecesariamente toda la superficie."] },
      { heading: "Rellena con calma", paragraphs: ["Añade el agua nueva lentamente para evitar levantar el sustrato o alterar la composición del hardscape."] },
    ],
  },
  {
    slug: "iluminacion-para-plantas",
    title: "Cómo elegir iluminación para plantas",
    category: "Plantas",
    excerpt: "Entiende intensidad, fotoperiodo y equilibrio antes de elegir una lámpara para tu acuario plantado.",
    readingTime: "7 min",
    difficulty: "Intermedio",
    sections: [
      { heading: "Más luz no siempre es mejor", paragraphs: ["La iluminación debe guardar relación con las plantas, el CO₂, la fertilización y el mantenimiento. Aumentar intensidad sin equilibrar el resto puede favorecer problemas de algas."] },
      { heading: "Fotoperiodo", paragraphs: ["Un horario constante facilita la estabilidad del sistema. Empieza de forma prudente y ajusta según la respuesta de las plantas y el comportamiento del acuario."] },
      { heading: "Mira el conjunto", paragraphs: ["La lámpara es una parte del sistema. Antes de comprar, considera dimensiones del acuario, altura, plantas que quieres mantener y si utilizarás CO₂."] },
    ],
  },
];

export const guideCategories = ["Todas", "Ciclado", "Mantenimiento", "Aquascaping", "Plantas", "Habitantes"];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
