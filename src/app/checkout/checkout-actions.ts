"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type CheckoutItem = {
  product_id: string;
  quantity: number;
};


async function sendOrderConfirmationEmail(order: any) {
  const customer = Array.isArray(order.customers)
    ? order.customers[0]
    : order.customers;
  const payment = Array.isArray(order.payments)
    ? order.payments[0]
    : order.payments;

  if (!customer?.email) return;

  const supabase = createAdminClient();
  const { data: settings } = await supabase
    .from("payment_settings")
    .select(
      "bank_name, account_type, account_number, account_holder, identification, contact_email, qr_url",
    )
    .limit(1)
    .single();

  const transporter = createTransporter();

  const items = order.order_items ?? [];
  const itemsHtml = items
    .map(
      (item: any) =>
        `<tr><td style="padding:8px 0;">${item.product_name} × ${item.quantity}</td><td style="padding:8px 0;text-align:right;">${Number(item.subtotal).toFixed(2)}</td></tr>`,
    )
    .join("");

  const transferHtml =
    payment?.payment_method === "transferencia"
      ? `
        <h3>Datos para realizar la transferencia</h3>
        <p><strong>Banco:</strong> ${settings?.bank_name ?? "Por confirmar"}</p>
        <p><strong>Tipo de cuenta:</strong> ${settings?.account_type ?? "Por confirmar"}</p>
        <p><strong>Número de cuenta:</strong> ${settings?.account_number ?? "Por confirmar"}</p>
        <p><strong>Titular:</strong> ${settings?.account_holder ?? "Por confirmar"}</p>
        <p><strong>Cédula / RUC:</strong> ${settings?.identification ?? "Por confirmar"}</p>
        <p><strong>Correo para comprobantes:</strong> ${settings?.contact_email ?? "Por confirmar"}</p>
        ${settings?.qr_url ? `<p><img src="${settings.qr_url}" alt="Código QR de transferencia" style="max-width:220px;border-radius:12px;" /></p>` : ""}
      `
      : "";

  const cashHtml =
    payment?.payment_method === "efectivo"
      ? `<h3>Entrega presencial</h3><p>El pago se realizará en efectivo según la modalidad de entrega acordada.</p>`
      : "";

  await transporter.sendMail({
    from: `"VidaBajoAgua" <${process.env.SMTP_USER}>`,
    to: customer.email,
    subject: `Pedido #${String(order.order_number).padStart(4, "0")} recibido — VidaBajoAgua`,
    text: `Tu pedido #${String(order.order_number).padStart(4, "0")} fue recibido. Código de seguimiento: ${order.tracking_token}. Total: ${Number(order.total).toFixed(2)}.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:680px;margin:auto;">
        <h2>VidaBajoAgua</h2>
        <h1>¡Pedido recibido!</h1>
        <p>Hola ${customer.first_name ?? "cliente"}, hemos recibido correctamente tu pedido.</p>
        <p><strong>Número de pedido:</strong> #${String(order.order_number).padStart(4, "0")}</p>
        <p><strong>Código de seguimiento:</strong> ${order.tracking_token}</p>
        <hr />
        <h3>Detalle del pedido</h3>
        <table style="width:100%;border-collapse:collapse;">${itemsHtml}</table>
        <p><strong>Subtotal:</strong> ${Number(order.subtotal).toFixed(2)}</p>
        <p><strong>Envío:</strong> ${Number(order.shipping_cost).toFixed(2)}</p>
        <p style="font-size:18px;"><strong>Total:</strong> ${Number(order.total).toFixed(2)}</p>
        <p><strong>Método de pago:</strong> ${payment?.payment_method ?? "No especificado"}</p>
        ${transferHtml}
        ${cashHtml}
        <hr />
        <p>Conserva tu código de seguimiento para consultar el estado de tu pedido.</p>
      </div>
    `,
  });
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !user || !password) {
    throw new Error("Faltan las variables de configuración SMTP.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass: password },
  });
}

type CreateOrderInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  province: string;
  city: string;
  parish: string;
  address: string;
  reference: string;
  payment_method:
    | "transferencia"
    | "efectivo"
    | "payphone";
  shipping_cost: number;
  notes: string;
  items: CheckoutItem[];
  address_id?: string | null;
};

export async function createPendingOrder(
  input: CreateOrderInput,
) {
  try {
    if (!input.items.length) {
      return {
        success: false,
        error: "El carrito está vacío.",
      };
    }

    /*
     * Cliente de servidor:
     * permite conocer al usuario autenticado
     * mediante las cookies de Supabase.
     */
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    /*
     * Cliente administrativo:
     * lo conservamos para ejecutar el RPC actual,
     * que únicamente permite EXECUTE a service_role.
     */
    const admin = createAdminClient();

    /*
     * Por ahora solo obtenemos la identidad.
     * En el siguiente paso la enviaremos al RPC.
     */
    const authUserId = user?.id ?? null;

    console.log(
      "[CHECKOUT] authUserId:",
      authUserId,
    );

    const { data, error } =
  await admin.rpc(
    "create_pending_order",
    {
      p_first_name: input.first_name,
      p_last_name: input.last_name,
      p_email: input.email,
      p_phone: input.phone,
      p_province: input.province,
      p_city: input.city,
      p_parish: input.parish,
      p_address: input.address,
      p_reference: input.reference,
      p_items: input.items,
      p_payment_method:
        input.payment_method,
      p_shipping_cost:
        input.shipping_cost,
      p_notes: input.notes,
      p_auth_user_id: authUserId,
      p_address_id: input.address_id ?? null,
    },
  );

    if (error) {
      console.error(
        "[CHECKOUT] RPC error:",
        error,
      );

      return {
        success: false,
        error:
          error.message ||
          "No se pudo crear el pedido.",
      };
    }

    try {
      const orderId = data?.order_id;
      if (orderId) {
        const { data: orderForEmail } = await admin
          .from("orders")
          .select(`
            order_number,
            tracking_token,
            subtotal,
            shipping_cost,
            total,
            customers (first_name, email),
            order_items (product_name, quantity, subtotal),
            payments (payment_method)
          `)
          .eq("id", orderId)
          .single();

        if (orderForEmail) {
          await sendOrderConfirmationEmail(orderForEmail);
        }
      }
    } catch (emailError) {
      console.error("[CHECKOUT] Error enviando confirmación por correo:", emailError);
    }

    return {
      success: true,
      order: data,
    };
  } catch (error) {
    console.error(
      "[CHECKOUT] Unexpected error:",
      error,
    );

    return {
      success: false,
      error:
        "Ocurrió un error al crear el pedido.",
    };
  }
}