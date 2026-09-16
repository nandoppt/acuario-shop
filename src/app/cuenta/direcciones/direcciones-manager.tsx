"use client";

import { useState } from "react";
import {
  Check,
  Loader2,
  MapPin,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { DireccionForm } from "./direccion-form";

import {
  deleteAddress,
  setDefaultAddress,
} from "./direcciones-actions";

type Address = {
  id: string;
  province: string;
  city: string;
  address: string;
  reference: string | null;
  created_at: string;
  is_default: boolean;
};

type DireccionesManagerProps = {
  initialAddresses: Address[];
};

const MAX_ADDRESSES = 4;

export function DireccionesManager({
  initialAddresses,
}: DireccionesManagerProps) {
  const [addresses, setAddresses] =
    useState<Address[]>(initialAddresses);

  const [loadingId, setLoadingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [editingAddress, setEditingAddress] =
    useState<Address | null>(null);

  const [addressToDelete, setAddressToDelete] =
    useState<Address | null>(null);

  async function handleSetDefault(addressId: string) {
    setError("");
    setLoadingId(addressId);

    const result = await setDefaultAddress(addressId);

    if (!result.success) {
      setError(
        result.error ??
          "No se pudo actualizar la dirección.",
      );
      setLoadingId(null);
      return;
    }

    setAddresses((current) =>
      current.map((address) => ({
        ...address,
        is_default: address.id === addressId,
      })),
    );

    setLoadingId(null);
  }

  function handleDeleteRequest(address: Address) {
    setError("");
    setAddressToDelete(address);
  }

  async function handleDeleteConfirmed() {
    if (!addressToDelete) {
      return;
    }

    const deletingId = addressToDelete.id;

    setError("");
    setLoadingId(deletingId);

    const result = await deleteAddress(deletingId);

    if (!result.success) {
      setError(
        result.error ??
          "No se pudo eliminar la dirección.",
      );
      setLoadingId(null);
      setAddressToDelete(null);
      return;
    }

    setAddresses((current) => {
      const remaining = current.filter(
        (item) => item.id !== deletingId,
      );

      if (
        addressToDelete.is_default &&
        remaining.length > 0 &&
        !remaining.some(
          (item) => item.is_default,
        )
      ) {
        remaining[0] = {
          ...remaining[0],
          is_default: true,
        };
      }

      return remaining;
    });

    setLoadingId(null);
    setAddressToDelete(null);
  }

  function handleAddAddress() {
    setEditingAddress(null);
    setShowForm(true);
    setError("");
  }

  function handleEditAddress(address: Address) {
    setEditingAddress(address);
    setShowForm(true);
    setError("");
  }

  function handleCancelForm() {
    setShowForm(false);
    setEditingAddress(null);
  }

  return (
    <div>
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {showForm && (
        <DireccionForm
          address={editingAddress}
          hasAddresses={addresses.length > 0}
          onCancel={handleCancelForm}
          onSaved={(savedAddress) => {
            setAddresses((current) => {
              const updated = editingAddress
                ? current.map((item) =>
                    item.id === savedAddress.id
                      ? savedAddress
                      : savedAddress.is_default
                        ? {
                            ...item,
                            is_default: false,
                          }
                        : item,
                  )
                : [
                    ...current.map((item) =>
                      savedAddress.is_default
                        ? {
                            ...item,
                            is_default: false,
                          }
                        : item,
                    ),
                    savedAddress,
                  ];

              return updated.sort(
                (a, b) =>
                  Number(b.is_default) -
                  Number(a.is_default),
              );
            });

            setShowForm(false);
            setEditingAddress(null);
          }}
        />
      )}

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center md:p-14">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <MapPin className="h-5 w-5 text-muted-foreground" />
          </div>

          <h2 className="text-lg font-semibold">
            Aún no tienes direcciones guardadas
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Agrega una dirección para tenerla
            disponible cuando realices tus próximas
            compras.
          </p>

          {!showForm && (
            <button
              type="button"
              onClick={handleAddAddress}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Agregar dirección
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">
                Direcciones guardadas
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {addresses.length === 1
                  ? "Tienes una dirección guardada."
                  : `Tienes ${addresses.length} direcciones guardadas.`}
              </p>
            </div>

            {addresses.length < MAX_ADDRESSES &&
              !showForm && (
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                >
                  <Plus className="h-4 w-4" />

                  <span className="hidden sm:inline">
                    Agregar dirección
                  </span>

                  <span className="sm:hidden">
                    Agregar
                  </span>
                </button>
              )}
          </div>

          {addresses.length === MAX_ADDRESSES && (
            <div className="mb-5 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
              Has alcanzado el máximo de{" "}
              {MAX_ADDRESSES} direcciones guardadas.
            </div>
          )}

          <div className="space-y-4">
            {addresses.map((address) => {
              const isLoading =
                loadingId === address.id;

              return (
                <article
                  key={address.id}
                  className="rounded-2xl border border-border bg-card p-5 transition md:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {address.city}
                          </h3>

                          {address.is_default && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                              <Star className="h-3 w-3 fill-current" />
                              Principal
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {address.province}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-xl bg-muted/50 p-4">
                    <p className="text-sm leading-6 text-foreground">
                      {address.address}
                    </p>

                    {address.reference && (
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Referencia:
                        </span>{" "}
                        {address.reference}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                    {!address.is_default && (
                      <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                          handleSetDefault(
                            address.id,
                          )
                        }
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}

                        Usar como principal
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        handleEditAddress(address)
                      }
                      className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Pencil className="h-4 w-4" />
                      Editar
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        handleDeleteRequest(address)
                      }
                      className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-destructive transition hover:bg-destructive/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}

                      Eliminar
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      <AlertDialog
        open={Boolean(addressToDelete)}
        onOpenChange={(open) => {
          if (!open && !loadingId) {
            setAddressToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle
              className="font-sans text-lg font-semibold tracking-tight"
            >
              {addressToDelete?.is_default
                ? "Eliminar dirección principal"
                : "Eliminar dirección"}
            </AlertDialogTitle>

            <AlertDialogDescription>
  {addressToDelete?.is_default &&
  addresses.length > 1
    ? "Esta es tu dirección principal. Si la eliminas, otra dirección guardada pasará a ser principal."
    : "¿Seguro que deseas eliminar esta dirección?"}
</AlertDialogDescription>

{addressToDelete && (
  <div className="mt-4 rounded-xl border border-border bg-muted/50 p-4 text-sm">
    <p className="font-medium text-foreground">
      {addressToDelete.city},{" "}
      {addressToDelete.province}
    </p>

    <p className="mt-1 leading-6 text-muted-foreground">
      {addressToDelete.address}
    </p>

    {addressToDelete.reference && (
      <p className="mt-2 leading-6 text-muted-foreground">
        <span className="font-medium text-foreground">
          Referencia:
        </span>{" "}
        {addressToDelete.reference}
      </p>
    )}
  </div>
)}

<p className="mt-4 text-xs text-muted-foreground">
  Esta acción no se puede deshacer.
</p>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={Boolean(loadingId)}
            >
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteConfirmed();
              }}
              disabled={Boolean(loadingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loadingId ===
                addressToDelete?.id && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Eliminar dirección
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}