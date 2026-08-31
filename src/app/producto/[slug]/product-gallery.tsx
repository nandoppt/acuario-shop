"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImage = {
  id: string;
  storage_path: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  url: string;
};

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const sortedImages = [...images].sort(
    (a, b) => {
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;

      return a.sort_order - b.sort_order;
    },
  );

  const [selectedImage, setSelectedImage] =
    useState(
      sortedImages.find(
        (image) => image.is_primary,
      ) ?? sortedImages[0] ?? null,
    );

  if (sortedImages.length === 0) {
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
    <div>
      {/* Imagen principal */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-muted">
        <div className="relative aspect-square">
          <Image
            src={selectedImage.url}
            alt={
              selectedImage.alt_text ||
              productName
            }
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain p-4 transition-opacity duration-300"
          />
        </div>
      </div>

      {/* Miniaturas */}
      {sortedImages.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {sortedImages.map((image) => {
            const isSelected =
              image.id === selectedImage.id;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() =>
                  setSelectedImage(image)
                }
                className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-muted transition ${
                  isSelected
                    ? "border-primary"
                    : "border-border hover:border-primary/50"
                }`}
                aria-label={`Ver imagen ${
                  image.sort_order + 1
                }`}
              >
                <Image
                  src={image.url}
                  alt={
                    image.alt_text ||
                    productName
                  }
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}