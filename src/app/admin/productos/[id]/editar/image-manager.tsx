"use client";

import Image from "next/image";
import { ImagePlus, Loader2, Trash2, Star } from "lucide-react";
import { useRef, useState } from "react";

import {
  deleteProductImage,
  setPrimaryProductImage,
  uploadProductImage,
} from "./image-actions";

type ProductImage = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
  url: string;
};

type ImageManagerProps = {
  productId: string;
  productSlug: string;
  images: ProductImage[];
};

export function ImageManager({
  productId,
  productSlug,
  images,  
}: ImageManagerProps
)



{
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSetPrimary(imageId: string) {
  setError("");
  setSuccess("");

  const result = await setPrimaryProductImage(
    productId,
    imageId,
  );

  if (!result.success) {
    setError(
      result.error ||
        "No se pudo establecer la imagen principal.",
    );
    return;
  }

  window.location.reload();
}

async function handleDelete(
  imageId: string,
  isPrimary: boolean,
) {
  const message = isPrimary
    ? "Esta es la imagen principal. Si la eliminas, otra imagen será seleccionada automáticamente. ¿Continuar?"
    : "¿Seguro que deseas eliminar esta imagen?";

  if (!window.confirm(message)) {
    return;
  }

  setError("");
  setSuccess("");

  const result = await deleteProductImage(
    productId,
    imageId,
  );

  if (!result.success) {
    setError(
      result.error ||
        "No se pudo eliminar la imagen.",
    );
    return;
  }

  window.location.reload();
}

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const result = await uploadProductImage(
        productId,
        productSlug,
        formData,
      );

      if (!result.success) {
        setError(
          result.error || "No se pudo subir la imagen.",
        );
        return;
      }

      setSuccess("Imagen subida correctamente.");

      // Recargar para mostrar la nueva imagen
      window.location.reload();
    } catch (error) {
      console.error(error);

      setError(
        "Ocurrió un error inesperado al subir la imagen.",
      );
    } finally {
      setUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-background p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
            Galería
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Imágenes del producto
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Administra las imágenes que aparecerán en la tienda.
          </p>
        </div>

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading}
          />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Subiendo...
              </>
            ) : (
              <>
                <ImagePlus size={18} />
                Subir imagen
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-5 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-5 rounded-xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
          {success}
        </div>
      )}

      {images.length === 0 ? (
        <div className="mt-6 flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border text-center">
          <ImagePlus
            size={32}
            className="text-muted-foreground"
          />

          <p className="mt-3 text-sm font-medium">
            No hay imágenes
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Sube la primera imagen de este producto.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="group overflow-hidden rounded-xl border border-border bg-muted"
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url}
                  alt={
                    image.alt_text ||
                    "Imagen del producto"
                  }
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />

                {image.is_primary && (
                  <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                    <Star size={13} />
                    Principal
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate text-xs text-muted-foreground">
                    Orden {image.sort_order + 1}
                  </p>

                  <p className="truncate text-sm font-medium">
                    {image.alt_text ||
                      "Imagen del producto"}
                  </p>
                </div>

                <div className="flex items-center gap-1">
  {!image.is_primary && (
    <button
      type="button"
      onClick={() =>
        handleSetPrimary(image.id)
      }
      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      title="Establecer como principal"
    >
      <Star size={16} />
    </button>
  )}

  <button
    type="button"
    onClick={() =>
      handleDelete(
        image.id,
        image.is_primary,
      )
    }
    className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
    title="Eliminar imagen"
  >
    <Trash2 size={16} />
  </button>
</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}