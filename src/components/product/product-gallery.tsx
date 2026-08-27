"use client";

import { useMemo, useState } from "react";
import type { ProductImage } from "@/types/catalog";

type ProductGalleryProps = {
  productName: string;
  images: ProductImage[];
};

export function ProductGallery({
  productName,
  images,
}: ProductGalleryProps) {
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      if (a.is_primary !== b.is_primary) {
        return a.is_primary ? -1 : 1;
      }

      return a.sort_order - b.sort_order;
    });
  }, [images]);

  const [selectedImageId, setSelectedImageId] = useState(
    sortedImages[0]?.id ?? null,
  );

  const selectedImage =
    sortedImages.find(
      (image) => image.id === selectedImageId,
    ) ?? sortedImages[0];

  if (!selectedImage) {
    return (
      <div className="overflow-hidden rounded-3xl border border-border bg-muted">
        <div className="flex aspect-square flex-col items-center justify-center text-muted-foreground">
          <span className="text-sm">
            Imagen próximamente
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="overflow-hidden rounded-3xl border border-border bg-muted">
        <div className="relative aspect-square">
          <img
            src={selectedImage.url}
            alt={
              selectedImage.alt_text ??
              productName
            }
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Miniaturas */}
      {sortedImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {sortedImages.map((image) => {
            const isSelected =
              image.id === selectedImage.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() =>
                  setSelectedImageId(image.id)
                }
                aria-label={`Ver imagen ${image.sort_order + 1} de ${productName}`}
                className={`relative overflow-hidden rounded-xl border-2 bg-muted transition ${
                  isSelected
                    ? "border-primary"
                    : "border-transparent hover:border-border"
                }`}
              >
                <div className="aspect-square">
                  <img
                    src={image.url}
                    alt={
                      image.alt_text ??
                      productName
                    }
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}