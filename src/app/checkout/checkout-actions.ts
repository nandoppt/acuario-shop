"use server";

import nodemailer from "nodemailer";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

type CheckoutItem = {
  product_id: string;
  quantity: number;
};
type CheckoutProfile = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
};

export async function getMyCheckoutProfile(): Promise<{
  success: boolean;
  profile: CheckoutProfile | null;
}> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, profile: null };
  }

  const admin = createAdminClient();
  const { data: customer, error } = await admin
    .from("customers")
    .select("first_name, last_name, email, phone")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error || !customer) {
    return { success: false, profile: null };
  }

  return {
    success: true,
    profile: {
      first_name: customer.first_name ?? "",
      last_name: customer.last_name ?? "",
      email: customer.email ?? user.email ?? "",
      phone: customer.phone ?? "",
    },
  };
}



async function sendOrderConfirmationEmail(order: any) {
  const customer = Array.isArray(order.customers)
    ? order.customers[0]
    : order.customers;
  const payment = Array.isArray(order.payments)
    ? order.payments[0]
    : order.payments;

  if (!customer?.email) return;

  const supabase = createAdminClient();
  const { data: accounts } = await supabase
    .from("payment_accounts")
    .select("bank_name, account_type, account_number, account_holder, identification, contact_email, qr_url")
    .eq("enabled", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

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
        ${(accounts ?? []).map((account: any) => `
          <div style="margin:16px 0;padding:14px;border:1px solid #ddd;border-radius:12px;">
            <p><strong>${account.bank_name}</strong></p>
            <p><strong>Tipo:</strong> ${account.account_type}</p>
            <p><strong>Número:</strong> ${account.account_number}</p>
            <p><strong>Titular:</strong> ${account.account_holder}</p>
            ${account.identification ? `<p><strong>Cédula / RUC:</strong> ${account.identification}</p>` : ""}
            ${account.contact_email ? `<p><strong>Comprobantes:</strong> ${account.contact_email}</p>` : ""}
            ${account.qr_url ? `<p><img src="${account.qr_url}" alt="Código QR ${account.bank_name}" style="max-width:220px;border-radius:12px;" /></p>` : ""}
          </div>
        `).join("")}
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
  recipient_is_other: boolean;
  recipient_first_name: string;
  recipient_last_name: string;
  recipient_phone: string;
  additional_email: string;
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
    "create_pending_order_v2",
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
      p_recipient_is_other: input.recipient_is_other,
      p_recipient_first_name: input.recipient_first_name,
      p_recipient_last_name: input.recipient_last_name,
      p_recipient_phone: input.recipient_phone,
      p_additional_email: input.additional_email,
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