"use server";

import crypto from "crypto";
import nodemailer from "nodemailer";
import { createAdminClient } from "@/lib/supabase/admin";

const orderSelect = `
  id,
  order_number,
  status,
  subtotal,
  shipping_cost,
  shipping_method,
  total,
  created_at,
  tracking_token,
  customers (
    first_name,
    last_name,
    email,
    phone
  ),
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
`;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function generateVerificationCode() {
  return crypto.randomInt(100000, 1000000).toString();
}

function hashVerificationCode(code: string) {
  return crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");
}

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;

  if (!host || !user || !password) {
    throw new Error(
      "Faltan las variables de configuración SMTP.",
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass: password,
    },
  });
}

export async function getOrderByTrackingToken(
  trackingToken: string,
) {
  const token = trackingToken.trim();

  if (!token) {
    return {
      success: false,
      error: "Ingresa tu código de seguimiento.",
    };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("orders")
    .select(orderSelect)
    .eq("tracking_token", token)
    .single();

  if (error || !data) {
    return {
      success: false,
      error:
        "No encontramos un pedido con ese código de seguimiento.",
    };
  }

  return {
    success: true,
    order: data,
  };
}

/**
 * Método anterior de búsqueda por correo + teléfono.
 * Lo conservamos temporalmente mientras probamos
 * la nueva verificación por correo.
 */
export async function getOrdersByCustomerData(
  email: string,
  phoneLast4: string,
) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedLast4 = phoneLast4
    .replace(/\D/g, "")
    .slice(-4);

  if (!normalizedEmail) {
    return {
      success: false,
      error: "Ingresa tu correo electrónico.",
    };
  }

  if (!/^\d{4}$/.test(normalizedLast4)) {
    return {
      success: false,
      error:
        "Ingresa los últimos 4 dígitos de tu número de celular.",
    };
  }

  const supabase = createAdminClient();

  const { data: customers, error: customerError } =
    await supabase
      .from("customers")
      .select("id, email, phone")
      .ilike("email", normalizedEmail);

  if (customerError) {
    console.error(
      "[ORDER SEARCH] Customer error:",
      customerError,
    );

    return {
      success: false,
      error: "No se pudo realizar la búsqueda.",
    };
  }

  if (!customers || customers.length === 0) {
    return {
      success: false,
      error:
        "No encontramos pedidos con esos datos.",
    };
  }

  const matchingCustomerIds = customers
    .filter((customer) => {
      const phone = customer.phone
        ?.replace(/\D/g, "");

      return (
        phone &&
        phone.slice(-4) === normalizedLast4
      );
    })
    .map((customer) => customer.id);

  if (matchingCustomerIds.length === 0) {
    return {
      success: false,
      error:
        "No encontramos pedidos con esos datos.",
    };
  }

  const { data: orders, error: ordersError } =
    await supabase
      .from("orders")
      .select(orderSelect)
      .in("customer_id", matchingCustomerIds)
      .order("created_at", {
        ascending: false,
      });

  if (ordersError) {
    console.error(
      "[ORDER SEARCH] Orders error:",
      ordersError,
    );

    return {
      success: false,
      error: "No se pudo realizar la búsqueda.",
    };
  }

  if (!orders || orders.length === 0) {
    return {
      success: false,
      error:
        "No encontramos pedidos con esos datos.",
    };
  }

  return {
    success: true,
    orders,
  };
}

/**
 * Envía un código temporal de 6 dígitos al correo.
 */
export async function requestOrderVerificationCode(
  email: string,
) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return {
      success: false,
      error: "Ingresa tu correo electrónico.",
    };
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalizedEmail,
    )
  ) {
    return {
      success: false,
      error: "Ingresa un correo electrónico válido.",
    };
  }

  const supabase = createAdminClient();

  /*
   * Buscamos si existe algún cliente con este correo.
   * No revelamos al usuario si existe o no.
   */
  const { data: customers, error: customerError } =
    await supabase
      .from("customers")
      .select("id")
      .ilike("email", normalizedEmail);

  if (customerError) {
    console.error(
      "[ORDER VERIFICATION] Customer error:",
      customerError,
    );

    return {
      success: false,
      error: "No se pudo procesar la solicitud.",
    };
  }

  /*
   * Si no existe, devolvemos una respuesta genérica.
   * Así no revelamos qué correos tienen pedidos.
   */
  if (!customers || customers.length === 0) {
    return {
      success: false,
      error:
        "No encontramos pedidos asociados a este correo electrónico.",
    };
  }

  /*
   * Verificamos que realmente exista al menos un pedido.
   */
  const customerIds = customers.map(
    (customer) => customer.id,
  );

  const { data: orders, error: ordersError } =
    await supabase
      .from("orders")
      .select("id")
      .in("customer_id", customerIds)
      .limit(1);

  if (ordersError) {
    console.error(
      "[ORDER VERIFICATION] Orders error:",
      ordersError,
    );

    return {
      success: false,
      error: "No se pudo procesar la solicitud.",
    };
  }

  if (!orders || orders.length === 0) {
    return {
      success: true,
      message:
        "Si el correo está asociado a pedidos, recibirás un código de verificación.",
    };
  }

  /*
   * Invalidamos códigos anteriores que todavía estén activos.
   */
  await supabase
    .from("order_tracking_verifications")
    .update({
      used_at: new Date().toISOString(),
    })
    .eq("email", normalizedEmail)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString());

  const code = generateVerificationCode();
  const codeHash = hashVerificationCode(code);

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000,
  ).toISOString();

  const { error: insertError } = await supabase
    .from("order_tracking_verifications")
    .insert({
      email: normalizedEmail,
      code_hash: codeHash,
      expires_at: expiresAt,
    });

  if (insertError) {
    console.error(
      "[ORDER VERIFICATION] Insert error:",
      insertError,
    );

    return {
      success: false,
      error: "No se pudo generar el código.",
    };
  }

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"VidaBajoAgua" <${process.env.SMTP_USER}>`,
      to: normalizedEmail,
      subject: "Código para consultar tus pedidos",
      text: `Tu código de verificación para consultar tus pedidos en VidaBajoAgua es: ${code}

Este código es válido durante 10 minutos y solo puede utilizarse una vez.

Si no solicitaste este código, puedes ignorar este mensaje.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>VidaBajoAgua</h2>

          <p>
            Recibimos una solicitud para consultar tus pedidos.
          </p>

          <p>
            Tu código de verificación es:
          </p>

          <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">
            ${code}
          </p>

          <p>
            Este código es válido durante <strong>10 minutos</strong>
            y solo puede utilizarse una vez.
          </p>

          <p>
            Si no solicitaste este código, puedes ignorar este mensaje.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error(
      "[ORDER VERIFICATION] Email error:",
      error,
    );

    /*
     * Si el correo no pudo enviarse, eliminamos el código
     * recién creado para evitar dejar códigos inutilizables.
     */
    await supabase
      .from("order_tracking_verifications")
      .delete()
      .eq("code_hash", codeHash);

    return {
      success: false,
      error:
        "No se pudo enviar el código. Inténtalo nuevamente.",
    };
  }

  return {
    success: true,
    message:
      "Si el correo está asociado a pedidos, recibirás un código de verificación.",
  };
}

/**
 * Valida el código enviado al correo y devuelve
 * todos los pedidos asociados.
 */
export async function verifyOrderVerificationCode(
  email: string,
  code: string,
) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedCode = code
    .replace(/\D/g, "")
    .trim();

  if (!normalizedEmail) {
    return {
      success: false,
      error: "Ingresa tu correo electrónico.",
    };
  }

  if (!/^\d{6}$/.test(normalizedCode)) {
    return {
      success: false,
      error: "Ingresa el código de 6 dígitos.",
    };
  }

  const codeHash = hashVerificationCode(
    normalizedCode,
  );

  const supabase = createAdminClient();

  const now = new Date().toISOString();

  const { data: verification, error } =
    await supabase
      .from("order_tracking_verifications")
      .select("id, email, expires_at, used_at")
      .eq("email", normalizedEmail)
      .eq("code_hash", codeHash)
      .is("used_at", null)
      .gt("expires_at", now)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

  if (error) {
    console.error(
      "[ORDER VERIFICATION] Verification error:",
      error,
    );

    return {
      success: false,
      error: "No se pudo validar el código.",
    };
  }

  if (!verification) {
    return {
      success: false,
      error:
        "El código es incorrecto, ya fue utilizado o ha expirado.",
    };
  }

  /*
   * Consumimos el código inmediatamente.
   */
  const { error: consumeError } = await supabase
    .from("order_tracking_verifications")
    .update({
      used_at: now,
    })
    .eq("id", verification.id)
    .is("used_at", null);

  if (consumeError) {
    console.error(
      "[ORDER VERIFICATION] Consume error:",
      consumeError,
    );

    return {
      success: false,
      error: "No se pudo validar el código.",
    };
  }

  /*
   * Buscamos todos los clientes relacionados
   * con el correo.
   */
  const { data: customers, error: customerError } =
    await supabase
      .from("customers")
      .select("id")
      .ilike("email", normalizedEmail);

  if (customerError) {
    console.error(
      "[ORDER VERIFICATION] Customer lookup error:",
      customerError,
    );

    return {
      success: false,
      error: "No se pudieron consultar los pedidos.",
    };
  }

  if (!customers || customers.length === 0) {
    return {
      success: false,
      error: "No encontramos pedidos asociados a este correo electrónico.",
    };
  }

  const customerIds = customers.map(
    (customer) => customer.id,
  );

  const { data: orders, error: ordersError } =
    await supabase
      .from("orders")
      .select(orderSelect)
      .in("customer_id", customerIds)
      .order("created_at", {
        ascending: false,
      });

  if (ordersError) {
    console.error(
      "[ORDER VERIFICATION] Orders lookup error:",
      ordersError,
    );

    return {
      success: false,
      error: "No se pudieron consultar los pedidos.",
    };
  }

  if (!orders || orders.length === 0) {
    return {
      success: false,
      error: "No encontramos pedidos asociados a este correo electrónico.",
    };
  }

  return {
    success: true,
    orders,
  };
}