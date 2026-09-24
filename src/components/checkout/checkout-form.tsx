"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { Loader2, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import { LocationSelect } from "@/components/checkout/location-select";

import {
  getMyAddresses,
} from "@/app/cuenta/direcciones/direcciones-actions";

import {
  AddressSelector,
  type CheckoutAddress,
} from "@/components/checkout/address-selector";

import { calculateShipping } from "@/lib/shipping/calculate-shipping";
import {
  getShippingSettings,
  getShippingCoverage,
} from "@/app/checkout/shipping-actions";
import { useCart } from "@/components/cart/cart-context";
import { CartSummary } from "@/components/cart/cart-summary";
import { PaymentSelector } from "@/components/checkout/payment-selector";
import { createPendingOrder } from "@/app/checkout/checkout-actions";

type PaymentMethod =
  | "transferencia"
  | "efectivo"
  | "payphone";

type ShippingSettings = {
  base_rate: number;
  included_distance_km: number;
  additional_km_rate: number;
  max_automatic_rate: number;
  free_shipping_minimum: number;
  automatic_shipping_enabled: boolean;
};

export function CheckoutForm() {
  const router = useRouter();

  const {
    items,
    subtotal,
    clearCart,
  } = useCart();

  const [payment, setPayment] =
    useState<PaymentMethod>("transferencia");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

    const [addresses, setAddresses] =
  useState<CheckoutAddress[]>([]);

const [selectedAddressId, setSelectedAddressId] =
  useState<string | null>(null);

const [addressesLoading, setAddressesLoading] =
  useState(true);

const [isAuthenticated, setIsAuthenticated] =
  useState(false);

  const [shippingSettings, setShippingSettings] =
  useState<ShippingSettings | null>(null);

const [shippingLoading, setShippingLoading] =
  useState(true);

type ShippingCoverage = {
  id: string;
  province: string;
  city: string;
  parish: string;
  enabled: boolean;
  shipping_cost: number | null;
  notes: string | null;
};

const [shippingCoverage, setShippingCoverage] =
  useState<ShippingCoverage | null>(null);

const [coverageLoading, setCoverageLoading] =
  useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    province: "",
    city: "",
    parish: "",
    address: "",
    reference: "",
    notes: "",
    
  });

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

function handleSelectAddress(address: CheckoutAddress) {
  setSelectedAddressId(address.id);

  setForm((current) => ({
    ...current,
    province: address.province,
    city: address.city,
    parish: address.parish ?? "",
    address: address.address,
    reference: address.reference ?? "",
  }));
}

 useEffect(() => {
  let active = true;

  async function loadShippingSettings() {
    try {
      const result = await getShippingSettings();

      if (!active) return;

      if (result.success && result.settings) {
        setShippingSettings(result.settings);
      } else if (!result.success) {
        setError(
          result.error ||
            "No se pudo cargar el envío.",
        );
      } else {
        setError(
          result.error ||
            "No se pudo cargar el envío.",
        );
      }
    } catch (error) {
      console.error(
        "[CHECKOUT SHIPPING]",
        error,
      );

      if (active) {
        setError(
          "No se pudo cargar la configuración de envío.",
        );
      }
    } finally {
      if (active) {
        setShippingLoading(false);
      }
    }
  }

  loadShippingSettings();

  return () => {
    active = false;
  };
}, []); 

useEffect(() => {
  let active = true;

  async function loadAddresses() {
    try {
      const result = await getMyAddresses();

      if (!active) return;

      if (result.success) {
        setAddresses(result.addresses);
        setIsAuthenticated(true);

        const defaultAddress =
          result.addresses.find(
            (address) => address.is_default,
          ) ?? result.addresses[0];

        if (defaultAddress) {
          setSelectedAddressId(
            defaultAddress.id,
          );
        }
      } else {
        /*
         * Si no hay sesión, continuamos como invitado.
         */
        setIsAuthenticated(false);
        setAddresses([]);
      }
    } catch (error) {
      console.error(
        "[CHECKOUT ADDRESSES]",
        error,
      );

      if (active) {
        setIsAuthenticated(false);
        setAddresses([]);
      }
    } finally {
      if (active) {
        setAddressesLoading(false);
      }
    }
  }

  loadAddresses();

  return () => {
    active = false;
  };
}, []);

useEffect(() => {
  let active = true;

  async function loadShippingCoverage() {
    if (!form.province || !form.city || !form.parish) {
      setShippingCoverage(null);
      setCoverageLoading(false);
      return;
    }

    setCoverageLoading(true);

    try {
      const result = await getShippingCoverage(
        form.province,
        form.city,
        form.parish,
      );

      if (!active) return;

      if (result.success) {
        setShippingCoverage(result.coverage);
      } else {
        setShippingCoverage(null);
        setError(
          result.error ||
            "No se pudo consultar la cobertura de envío.",
        );
      }
    } catch (error) {
      console.error(
        "[CHECKOUT COVERAGE]",
        error,
      );

      if (active) {
        setShippingCoverage(null);
        setError(
          "No se pudo consultar la cobertura de envío.",
        );
      }
    } finally {
      if (active) {
        setCoverageLoading(false);
      }
    }
  }

  loadShippingCoverage();

  return () => {
    active = false;
  };
}, [
  form.province,
  form.city,
  form.parish,
]);

const shippingCalculation =
  shippingSettings && form.parish
    ? shippingCoverage?.enabled
      ? shippingCoverage.shipping_cost !== null
        ? subtotal >= shippingSettings.free_shipping_minimum
          ? {
              status: "free" as const,
              cost: 0 as const,
              message: "Envío gratis" as const,
              free_shipping_minimum:
                shippingSettings.free_shipping_minimum,
            }
          : {
              status: "automatic" as const,
              cost: shippingCoverage.shipping_cost,
              message: "Envío calculado" as const,
              free_shipping_minimum:
                shippingSettings.free_shipping_minimum,
            }
        : calculateShipping({
            subtotal,
            distance_km: null,
            config: shippingSettings,
          })
      : {
          status: "confirm" as const,
          cost: null,
          message: "Envío por confirmar" as const,
          free_shipping_minimum:
            shippingSettings.free_shipping_minimum,
        }
    : null;

const shippingCost =
  shippingCalculation?.cost ?? null;

const total =
  shippingCost !== null
    ? subtotal + shippingCost
    : null;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (items.length === 0) {
      setError(
        "Tu carrito está vacío.",
      );
      return;
    }

    setLoading(true);

    try {
      const result =
        await createPendingOrder({
          ...form,
          address_id: isAuthenticated ? selectedAddressId : null,

          payment_method: payment,

          shipping_cost: shippingCost ?? 0,

          notes: form.notes,

          items: items.map((item) => ({
            product_id:
              item.productId,
            quantity:
              item.quantity,
          })),
        });

      if (!result.success) {
        setError(
          result.error ||
            "No se pudo crear el pedido.",
        );

        return;
      }

      /*
       * El pedido ya fue creado correctamente.
       * Ahora sí podemos limpiar el carrito.
       */
      clearCart();

      /*
       * Guardamos temporalmente la información
       * necesaria para mostrar la confirmación.
       */
      sessionStorage.setItem(
        "vidabajoagua-last-order",
        JSON.stringify(result.order),
      );

      router.push(
        `/pedido/confirmado/${result.order.order_id}`,
      );
    } catch (error) {
      console.error(
        "[CHECKOUT]",
        error,
      );

      setError(
        "No se pudo completar el pedido. Inténtalo nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16">
        <div className="text-center">
          <ShoppingBag
            className="mx-auto text-primary"
            size={48}
          />

          <h1 className="mt-6 text-3xl font-semibold">
            Tu carrito está vacío
          </h1>

          <p className="mt-3 text-muted-foreground">
            Agrega productos antes de
            continuar con tu compra.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">
          Checkout
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Finalizar compra
        </h1>

        <p className="mt-3 text-muted-foreground">
          Completa tus datos para generar tu pedido.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-10 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-8">

          {/* Cliente */}

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">
              Datos del cliente
            </h2>

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <input
                required
                value={form.first_name}
                onChange={(e) =>
                  updateField(
                    "first_name",
                    e.target.value,
                  )
                }
                placeholder="Nombres"
                className="h-12 rounded-xl border border-border bg-background px-4"
              />

              <input
                required
                value={form.last_name}
                onChange={(e) =>
                  updateField(
                    "last_name",
                    e.target.value,
                  )
                }
                placeholder="Apellidos"
                className="h-12 rounded-xl border border-border bg-background px-4"
              />

              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  updateField(
                    "phone",
                    e.target.value,
                  )
                }
                placeholder="Teléfono"
                className="h-12 rounded-xl border border-border bg-background px-4"
              />

              <input
                required
                type="email"
                value={form.email}
                onChange={(e) =>
                  updateField(
                    "email",
                    e.target.value,
                  )
                }
                placeholder="Correo electrónico"
                className="h-12 rounded-xl border border-border bg-background px-4"
              />
            </div>
          </section>

          {/* Dirección */}

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">
              Dirección de entrega
            </h2>

            <div className="mt-6">
              {addressesLoading ? (
                <div className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-5 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando tus direcciones...
                </div>
              ) : isAuthenticated ? (
                addresses.length > 0 ? (
                  <AddressSelector
                    addresses={addresses}
                    selectedAddressId={selectedAddressId}
                    onSelect={handleSelectAddress}
                    onAddAddress={() => router.push("/cuenta/direcciones")}
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-background p-6">
                    <p className="font-medium">
                      No tienes direcciones guardadas.
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Agrega una dirección desde tu cuenta para continuar con la compra.
                    </p>

                    <button
                      type="button"
                      onClick={() => router.push("/cuenta/direcciones")}
                      className="mt-4 inline-flex h-11 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                      Agregar dirección
                    </button>
                  </div>
                )
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  <LocationSelect
                    province={form.province}
                    canton={form.city}
                    parish={form.parish}
                    onProvinceChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        province: value,
                        city: "",
                        parish: "",
                      }))
                    }
                    onCantonChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        city: value,
                        parish: "",
                      }))
                    }
                    onParishChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        parish: value,
                      }))
                    }
                  />

                  <textarea
                    required
                    value={form.address}
                    onChange={(e) =>
                      updateField("address", e.target.value)
                    }
                    placeholder="Dirección completa"
                    rows={3}
                    className="md:col-span-2 rounded-xl border border-border bg-background px-4 py-3"
                  />

                  <textarea
                    value={form.reference}
                    onChange={(e) =>
                      updateField("reference", e.target.value)
                    }
                    placeholder="Referencia (opcional)"
                    rows={2}
                    className="md:col-span-2 rounded-xl border border-border bg-background px-4 py-3"
                  />

                  <textarea
                    value={form.notes}
                    onChange={(e) =>
                      updateField("notes", e.target.value)
                    }
                    placeholder="Observaciones del pedido (opcional)"
                    rows={2}
                    className="md:col-span-2 rounded-xl border border-border bg-background px-4 py-3"
                  />
                </div>
              )}
            </div>
          </section>

          {/* Pago */}

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">
              Método de pago
            </h2>

            <div className="mt-6">
              <PaymentSelector
                value={payment}
                onChange={setPayment}
              />
            </div>

            {payment === "transferencia" && (
              <div className="mt-6 rounded-xl bg-secondary p-4 text-sm">
                Al generar el pedido te
                mostraremos los datos bancarios
                y el código QR para realizar la
                transferencia.
              </div>
            )}

            {payment === "efectivo" && (
              <div className="mt-6 rounded-xl bg-secondary p-4 text-sm">
                El pago en efectivo estará
                disponible para entregas
                presenciales o puntos acordados.
              </div>
            )}

            {payment === "payphone" && (
              <div className="mt-6 rounded-xl bg-secondary p-4 text-sm">
                Después de generar el pedido
                podremos enviarte el enlace de
                pago mediante PayPhone.
              </div>
            )}
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-4 text-sm text-destructive"
            >
              {error}
            </div>
          )}
        </div>

        {/* Resumen */}

        <div>
          <CartSummary
  checkout
  shipping={shippingCalculation}
/>
          <button
            type="submit"
            disabled={loading || coverageLoading}
           className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={20}
                  className="animate-spin"
                />
                Generando pedido...
              </>
            ) : coverageLoading ? (
              "Calculando envío..."
            ) : (
              "Confirmar pedido"
            )}
          </button>

          <p className="mt-4 text-center text-xs leading-5 text-muted-foreground">
            Tu pedido se creará como pendiente de
            pago. El stock se descontará cuando
            confirmemos el pago.
          </p>
        </div>
      </form>
    </main>
  );
}