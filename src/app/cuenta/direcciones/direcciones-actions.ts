"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_ADDRESSES = 4;

type AddressInput = {
  province: string;
  city: string;
  parish: string;
  address: string;
  reference: string;
};

async function getAuthenticatedCustomer() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      customer: null,
    };
  }

  const admin = createAdminClient();

  const { data: customer, error } = await admin
    .from("customers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error(
      "[ADDRESSES] Error buscando customer:",
      error,
    );

    return {
      user,
      customer: null,
    };
  }

  return {
    user,
    customer,
  };
}

export async function getMyAddresses() {
  const { user, customer } =
    await getAuthenticatedCustomer();

  if (!user) {
    return {
      success: false,
      addresses: [],
      error: "Tu sesión ha expirado.",
    };
  }

  if (!customer) {
    return {
      success: false,
      addresses: [],
      error: "No encontramos tu cuenta de cliente.",
    };
  }

  const admin = createAdminClient();

  const {
    data: addresses,
    error,
  } = await admin
    .from("addresses")
    .select(
      `
        id,
        province,
        city,
        parish,
        address,
        reference,
        created_at,
        is_default
      `,
    )
    .eq("customer_id", customer.id)
    .order("is_default", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "[ADDRESSES] Error obteniendo direcciones:",
      error,
    );

    return {
      success: false,
      addresses: [],
      error:
        "No se pudieron cargar tus direcciones.",
    };
  }

  return {
    success: true,
    addresses: addresses ?? [],
  };
}

function normalizeInput(input: AddressInput) {
  return {
    province: input.province.trim(),
    city: input.city.trim(),
    parish: input.parish.trim(),
    address: input.address.trim(),
    reference: input.reference.trim(),
  };
}

function validateInput(input: ReturnType<typeof normalizeInput>) {
  if (!input.province) return "La provincia es obligatoria.";
  if (!input.city) return "La ciudad es obligatoria.";
  if (!input.parish) return "La parroquia es obligatoria.";
  if (!input.address) return "La dirección es obligatoria.";
  return null;
}

export async function createAddress(
  input: AddressInput,
  makeDefault = false,
) {
  const { user, customer } =
    await getAuthenticatedCustomer();

  if (!user) {
    return {
      success: false,
      error: "Tu sesión ha expirado.",
    };
  }

  if (!customer) {
    return {
      success: false,
      error: "No encontramos tu cuenta de cliente.",
    };
  }

  const data = normalizeInput(input);
  const validationError = validateInput(data);

  if (validationError) {
    return {
      success: false,
      error: validationError,
    };
  }

  const admin = createAdminClient();

  const { count, error: countError } = await admin
    .from("addresses")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("customer_id", customer.id);

  if (countError) {
    console.error(
      "[ADDRESSES] Error contando direcciones:",
      countError,
    );

    return {
      success: false,
      error: "No se pudo verificar tus direcciones.",
    };
  }

  if ((count ?? 0) >= MAX_ADDRESSES) {
    return {
      success: false,
      error: "Puedes guardar un máximo de 4 direcciones.",
    };
  }

  const shouldBeDefault =
    (count ?? 0) === 0 || makeDefault;

  if (shouldBeDefault) {
    const { error: resetError } = await admin
      .from("addresses")
      .update({
        is_default: false,
      })
      .eq("customer_id", customer.id);

    if (resetError) {
      console.error(
        "[ADDRESSES] Error quitando dirección principal:",
        resetError,
      );

      return {
        success: false,
        error:
          "No se pudo establecer la dirección principal.",
      };
    }
  }

  const {
    data: createdAddress,
    error,
  } = await admin
    .from("addresses")
    .insert({
      customer_id: customer.id,
      province: data.province,
      city: data.city,
      parish: data.parish,
      address: data.address,
      reference: data.reference || null,
      is_default: shouldBeDefault,
    })
    .select(
      "id, province, city, parish,address, reference, created_at, is_default",
    )
    .single();

  if (error || !createdAddress) {
    console.error(
      "[ADDRESSES] Error creando dirección:",
      error,
    );

    return {
      success: false,
      error: "No se pudo guardar la dirección.",
    };
  }

  return {
    success: true,
    message: "La dirección se guardó correctamente.",
    address: createdAddress,
  };
}

export async function updateAddress(
  addressId: string,
  input: AddressInput,
  makeDefault = false,
) {
  const { user, customer } =
    await getAuthenticatedCustomer();

  if (!user) {
    return {
      success: false,
      error: "Tu sesión ha expirado.",
    };
  }

  if (!customer) {
    return {
      success: false,
      error: "No encontramos tu cuenta de cliente.",
    };
  }

  const data = normalizeInput(input);
  const validationError = validateInput(data);

  if (validationError) {
    return {
      success: false,
      error: validationError,
    };
  }

  const admin = createAdminClient();

  const {
    data: existingAddress,
    error: existingError,
  } = await admin
    .from("addresses")
    .select("id, is_default")
    .eq("id", addressId)
    .eq("customer_id", customer.id)
    .maybeSingle();

  if (existingError) {
    console.error(
      "[ADDRESSES] Error buscando dirección:",
      existingError,
    );

    return {
      success: false,
      error: "No se pudo encontrar la dirección.",
    };
  }

  if (!existingAddress) {
    return {
      success: false,
      error: "La dirección no existe.",
    };
  }

  const shouldBeDefault =
    makeDefault || existingAddress.is_default;

  if (makeDefault) {
    const { error: resetError } = await admin
      .from("addresses")
      .update({
        is_default: false,
      })
      .eq("customer_id", customer.id)
      .neq("id", addressId);

    if (resetError) {
      console.error(
        "[ADDRESSES] Error actualizando dirección principal:",
        resetError,
      );

      return {
        success: false,
        error:
          "No se pudo establecer la dirección principal.",
      };
    }
  }

  const {
    data: updatedAddress,
    error,
  } = await admin
    .from("addresses")
    .update({
      province: data.province,
      city: data.city,
      parish: data.parish,
      address: data.address,
      reference: data.reference || null,
      is_default: shouldBeDefault,
    })
    .eq("id", addressId)
    .eq("customer_id", customer.id)
    .select(
      "id, province, city, parish, address, reference, created_at, is_default",
    )
    .single();

  if (error || !updatedAddress) {
    console.error(
      "[ADDRESSES] Error actualizando dirección:",
      error,
    );

    return {
      success: false,
      error: "No se pudo actualizar la dirección.",
    };
  }

  return {
    success: true,
    message:
      "La dirección se actualizó correctamente.",
    address: updatedAddress,
  };
}

export async function setDefaultAddress(
  addressId: string,
) {
  const { user, customer } =
    await getAuthenticatedCustomer();

  if (!user) {
    return {
      success: false,
      error: "Tu sesión ha expirado.",
    };
  }

  if (!customer) {
    return {
      success: false,
      error: "No encontramos tu cuenta de cliente.",
    };
  }

  const admin = createAdminClient();

  const { data: address, error: addressError } =
    await admin
      .from("addresses")
      .select("id")
      .eq("id", addressId)
      .eq("customer_id", customer.id)
      .maybeSingle();

  if (addressError) {
    console.error(
      "[ADDRESSES] Error buscando dirección:",
      addressError,
    );

    return {
      success: false,
      error: "No se pudo encontrar la dirección.",
    };
  }

  if (!address) {
    return {
      success: false,
      error: "La dirección no existe.",
    };
  }

  const { error: resetError } = await admin
    .from("addresses")
    .update({
      is_default: false,
    })
    .eq("customer_id", customer.id);

  if (resetError) {
    console.error(
      "[ADDRESSES] Error quitando dirección principal:",
      resetError,
    );

    return {
      success: false,
      error:
        "No se pudo actualizar la dirección principal.",
    };
  }

  const { error } = await admin
    .from("addresses")
    .update({
      is_default: true,
    })
    .eq("id", addressId)
    .eq("customer_id", customer.id);

  if (error) {
    console.error(
      "[ADDRESSES] Error estableciendo dirección principal:",
      error,
    );

    return {
      success: false,
      error:
        "No se pudo establecer la dirección principal.",
    };
  }

  return {
    success: true,
    message:
      "La dirección principal se actualizó.",
  };
}

export async function deleteAddress(
  addressId: string,
) {
  const { user, customer } =
    await getAuthenticatedCustomer();

  if (!user) {
    return {
      success: false,
      error: "Tu sesión ha expirado.",
    };
  }

  if (!customer) {
    return {
      success: false,
      error: "No encontramos tu cuenta de cliente.",
    };
  }

  const admin = createAdminClient();

  const {
    data: address,
    error: addressError,
  } = await admin
    .from("addresses")
    .select("id, is_default")
    .eq("id", addressId)
    .eq("customer_id", customer.id)
    .maybeSingle();

  if (addressError) {
    console.error(
      "[ADDRESSES] Error buscando dirección:",
      addressError,
    );

    return {
      success: false,
      error: "No se pudo encontrar la dirección.",
    };
  }

  if (!address) {
    return {
      success: false,
      error: "La dirección no existe.",
    };
  }

  const { error } = await admin
    .from("addresses")
    .delete()
    .eq("id", addressId)
    .eq("customer_id", customer.id);

  if (error) {
    console.error(
      "[ADDRESSES] Error eliminando dirección:",
      error,
    );

    return {
      success: false,
      error: "No se pudo eliminar la dirección.",
    };
  }

  if (address.is_default) {
    const { data: nextAddress } =
      await admin
        .from("addresses")
        .select("id")
        .eq("customer_id", customer.id)
        .order("created_at", {
          ascending: true,
        })
        .limit(1)
        .maybeSingle();

    if (nextAddress) {
      const { error: defaultError } =
        await admin
          .from("addresses")
          .update({
            is_default: true,
          })
          .eq("id", nextAddress.id)
          .eq("customer_id", customer.id);

      if (defaultError) {
        console.error(
          "[ADDRESSES] Error asignando nueva principal:",
          defaultError,
        );
      }
    }
  }

  return {
    success: true,
    message:
      "La dirección se eliminó correctamente.",
  };
}