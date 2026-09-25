export type ShippingMethodCode =
  | "presencial"
  | "gratis"
  | "cobertura"
  | "por_confirmar";

export const shippingMethodLabels: Record<
  ShippingMethodCode,
  string
> = {
  presencial: "Entrega presencial",
  gratis: "Envío gratis",
  cobertura: "Envío con tarifa de cobertura",
  por_confirmar: "Envío por confirmar",
};

export function getShippingMethodLabel(
  method: string | null | undefined,
) {
  if (
    method &&
    method in shippingMethodLabels
  ) {
    return shippingMethodLabels[
      method as ShippingMethodCode
    ];
  }

  return method ?? "Envío por confirmar";
}

export function getShippingCostLabel(
  method: string | null | undefined,
  cost: number,
) {
  switch (method) {
    case "presencial":
      return "Sin costo de envío";
    case "gratis":
      return "Gratis";
    case "por_confirmar":
      return "Por confirmar";
    default:
      return new Intl.NumberFormat("es-EC", {
        style: "currency",
        currency: "USD",
      }).format(Number(cost) || 0);
  }
}
