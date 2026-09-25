import { TrackingCodeActions } from "@/components/orders/tracking-code-actions";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
} from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";
import {
  getShippingCostLabel,
  getShippingMethodLabel,
} from "@/lib/shipping/shipping-method";
import { getOrderStatusMeta } from "@/lib/orders/order-status";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PedidoConfirmadoPage({
  params,
}: Props) {
  const { id } = await params;

  const supabase = createAdminClient();

  const { data: order } =
    await supabase
      .from("orders")
      .select(
        `
          id,
          order_number,
          status,
          subtotal,
          shipping_cost,
          shipping_method,
          total,
          created_at,
          notes,
          buyer_first_name,
          buyer_last_name,
          buyer_email,
          buyer_phone,
          recipient_is_other,
          recipient_first_name,
          recipient_last_name,
          recipient_phone,
          additional_email,
          addresses (
            province,
            city,
            address,
            reference
          ),
          order_items (
            id,
            product_name,
            unit_price,
            quantity,
            subtotal
          ),
          payments (
            payment_method,
            payment_status,
            amount,
            transaction_reference
          )
        `,
      )
      .eq("tracking_token", id)
      .single();

  if (!order) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-16">
        <div className="text-center">
          <Package
            className="mx-auto text-primary"
            size={48}
          />

          <h1 className="mt-6 text-3xl font-semibold">
            Pedido no encontrado
          </h1>

          <p className="mt-3 text-muted-foreground">
            No pudimos encontrar el pedido
            solicitado.
          </p>

          <Link
            href="/tienda"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground"
          >
            <ArrowLeft size={18} />
            Volver a la tienda
          </Link>
        </div>
      </main>
    );
  }

  const customer = {
    first_name: order.buyer_first_name,
    last_name: order.buyer_last_name,
    email: order.buyer_email,
    phone: order.buyer_phone,
  };

  const address = Array.isArray(order.addresses)
    ? order.addresses[0]
    : order.addresses;

  const payment = Array.isArray(order.payments)
    ? order.payments[0]
    : order.payments;

  const { data: paymentSettings } = await supabase
    .from("payment_settings")
    .select("transfer_enabled")
    .limit(1)
    .single();

  const { data: paymentAccounts } = await supabase
    .from("payment_accounts")
    .select(
      "bank_name, account_type, account_number, account_holder, identification, contact_email, qr_url",
    )
    .eq("enabled", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const paymentLabels = {
    transferencia: "Transferencia / QR",
    efectivo: "Pago en efectivo",
    payphone: "Link de PayPhone",
  } as const;

  const paymentLabel =
    payment?.payment_method &&
    payment.payment_method in paymentLabels
      ? paymentLabels[
          payment.payment_method as keyof typeof paymentLabels
        ]
      : payment?.payment_method ?? "No especificado";

  const statusMeta = getOrderStatusMeta(order.status);

  const shippingMethodLabel = getShippingMethodLabel(
    order.shipping_method,
  );

  const shippingCostLabel = getShippingCostLabel(
    order.shipping_method,
    Number(order.shipping_cost) || 0,
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 md:px-8 md:py-16">

      {/* Encabezado */}

      <div className="text-center">
        <CheckCircle2
          className="mx-auto text-primary"
          size={56}
        />

        <p className="mt-6 text-sm font-medium uppercase tracking-[0.25em] text-primary">
          VidaBajoAgua
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          ¡Pedido recibido!
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Gracias por tu compra,{" "}
          {customer?.first_name ?? "cliente"}.
          Hemos recibido correctamente tu pedido.
        </p>
      </div>
      <div className="mt-6 rounded-lg border bg-muted/30 p-4">
  <p className="text-sm font-medium">
    Guarda tu código de seguimiento
  </p>

  <p className="mt-1 text-sm text-muted-foreground">
    Lo necesitarás para consultar el estado de tu pedido
    más adelante.
  </p>

  <div className="mt-4 rounded-md border bg-background px-4 py-3">
    <p className="text-xs text-muted-foreground">
      Código de seguimiento
    </p>

    <p className="mt-1 break-all font-mono text-sm">
      {id}
    </p>
    <TrackingCodeActions trackingToken={id} />
  </div>
</div>

      {/* Número de pedido */}

      <section className="mt-10 rounded-2xl border border-border bg-card p-6 text-center md:p-8">
        <p className="text-sm text-muted-foreground">
          Número de pedido
        </p>

        <p className="mt-2 text-3xl font-semibold">
          #{String(order.order_number).padStart(4, "0")}
        </p>

        <div className="mt-4 flex justify-center">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${statusMeta.badgeClass}`}
          >
            <span
              className={`h-2 w-2 rounded-full ${statusMeta.dotClass}`}
            />
            {statusMeta.label}
          </span>
        </div>
      </section>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">

        {/* Productos */}

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">
            Resumen del pedido
          </h2>

          <div className="mt-6 divide-y divide-border">
            {order.order_items?.map(
              (item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-medium">
                      {item.product_name}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.quantity} × $
                      {Number(
                        item.unit_price,
                      ).toFixed(2)}
                    </p>
                  </div>

                  <p className="font-medium">
                    $
                    {Number(
                      item.subtotal,
                    ).toFixed(2)}
                  </p>
                </div>
              ),
            )}
          </div>

          <div className="mt-4 space-y-3 border-t border-border pt-6 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Subtotal
              </span>

              <span>
                $
                {Number(
                  order.subtotal,
                ).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Método de envío
              </span>

              <span className="text-right font-medium">
                {shippingMethodLabel}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Costo de envío
              </span>

              <span className="text-right">
                {shippingCostLabel}
              </span>
            </div>

            <div className="flex justify-between border-t border-border pt-4 text-lg font-semibold">
              <span>Total</span>

              <span>
                $
                {Number(
                  order.total,
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        {/* Pago */}

        <aside className="space-y-6">

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              Método de pago
            </h2>

            <p className="mt-3 text-sm text-muted-foreground">
              {paymentLabel}
            </p>

            {payment?.payment_method ===
              "transferencia" && (
              <div className="mt-5 rounded-xl bg-secondary p-4 text-sm leading-6">
                <p className="font-medium">Completa tu transferencia</p>
                <div className="mt-4 space-y-4">
                  {paymentAccounts?.map((account, index) => (
                    <div key={`${account.bank_name}-${index}`} className="rounded-xl border border-border bg-background p-4">
                      <p className="font-medium">{account.bank_name}</p>
                      <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                        <p><strong>Tipo:</strong> {account.account_type}</p>
                        <p><strong>Número:</strong> {account.account_number}</p>
                        <p><strong>Titular:</strong> {account.account_holder}</p>
                        {account.identification && <p><strong>Cédula / RUC:</strong> {account.identification}</p>}
                        {account.contact_email && <p><strong>Comprobantes:</strong> {account.contact_email}</p>}
                      </div>
                      {account.qr_url && (
                        <img src={account.qr_url} alt={`Código QR ${account.bank_name}`} className="mt-4 h-40 w-40 rounded-xl border bg-background object-contain p-2" />
                      )}
                    </div>
                  ))}
                  {(!paymentAccounts || paymentAccounts.length === 0) && (
                    <p className="text-sm text-muted-foreground">Los datos bancarios serán confirmados por VidaBajoAgua.</p>
                  )}
                </div>
              </div>
            )}

            {payment?.payment_method ===
              "efectivo" && (
              <div className="mt-5 rounded-xl bg-secondary p-4 text-sm leading-6 text-muted-foreground">
                El pago se realizará en efectivo durante la entrega presencial.
              </div>
            )}

            {payment?.payment_method ===
              "payphone" && (
              <div className="mt-5 rounded-xl bg-secondary p-4 text-sm leading-6 text-muted-foreground">
                Te proporcionaremos el enlace
                de pago mediante PayPhone.
              </div>
            )}
          </section>

          {/* Cliente */}

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">
              {payment?.payment_method === "efectivo"
                ? "Entrega presencial"
                : "Datos de entrega"}
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <p className="font-medium">
                {customer.first_name} {customer.last_name}
              </p>

              <p className="text-muted-foreground">
                {customer.phone}
              </p>

              <p className="text-muted-foreground">
                {customer.email}
              </p>

              {order.recipient_is_other && (
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Recibe el pedido
                  </p>
                  <p className="mt-2 font-medium">
                    {order.recipient_first_name} {order.recipient_last_name}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {order.recipient_phone}
                  </p>
                </div>
              )}

              {order.additional_email && (
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Confirmación enviada también a
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    {order.additional_email}
                  </p>
                </div>
              )}

              {payment?.payment_method !== "efectivo" && address && (
                <div className="border-t border-border pt-3">
                  <p>
                    {address.address}
                  </p>

                  <p className="mt-1 text-muted-foreground">
                    {address.city},{" "}
                    {address.province}
                  </p>

                  {address.reference && (
                    <p className="mt-1 text-muted-foreground">
                      Ref:{" "}
                      {address.reference}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-medium text-primary-foreground transition hover:opacity-90"
        >
          <ArrowLeft size={18} />
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}