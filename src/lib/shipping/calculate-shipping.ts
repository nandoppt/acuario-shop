export type ShippingCalculation =
  | {
      status: "free";
      cost: 0;
      message: "Envío gratis";
      free_shipping_minimum: number;
    }
  | {
      status: "automatic";
      cost: number;
      message: "Envío calculado";
      free_shipping_minimum: number;
    }
  | {
      status: "confirm";
      cost: null;
      message: "Envío por confirmar";
      free_shipping_minimum: number;
    };

type ShippingConfig = {
  base_rate: number;
  included_distance_km: number;
  additional_km_rate: number;
  max_automatic_rate: number;
  free_shipping_minimum: number;
};

type CalculateShippingInput = {
  subtotal: number;
  distance_km: number | null;
  config: ShippingConfig;
};

export function calculateShipping({
  subtotal,
  distance_km,
  config,
}: CalculateShippingInput): ShippingCalculation {
  /*
   * Envío gratis según subtotal.
   */
  if (subtotal >= config.free_shipping_minimum) {
  return {
    status: "free",
    cost: 0,
    message: "Envío gratis",
    free_shipping_minimum:
      config.free_shipping_minimum,
  };
}


  
  /*
   * Sin distancia no podemos calcular
   * automáticamente el envío.
   */
  if (distance_km === null || distance_km < 0) {
    return {
      status: "confirm",
      cost: null,
      message: "Envío por confirmar",
      free_shipping_minimum:
      config.free_shipping_minimum,
    };
  }

  /*
   * Tarifa base para la distancia incluida.
   */
  let shippingCost = config.base_rate;

  /*
   * Calculamos kilómetros adicionales.
   */
  if (distance_km > config.included_distance_km) {
    const additionalDistance =
      distance_km - config.included_distance_km;

    shippingCost +=
      additionalDistance *
      config.additional_km_rate;
  }

  /*
   * Redondeamos a dos decimales.
   */
  shippingCost =
    Math.round(shippingCost * 100) / 100;

  /*
   * Si supera el máximo automático,
   * requiere confirmación manual.
   */
  if (
    shippingCost >
    config.max_automatic_rate
  ) {
    return {
      status: "confirm",
      cost: null,
      message: "Envío por confirmar",
      free_shipping_minimum:
      config.free_shipping_minimum,
    };
  }

  return {
    status: "automatic",
    cost: shippingCost,
    message: "Envío calculado",
    free_shipping_minimum:
      config.free_shipping_minimum,
  };
}