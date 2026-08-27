import { NextResponse } from "next/server";

import { getProducts } from "@/lib/catalog/products";

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error loading catalog:", error);

    return NextResponse.json(
      {
        error: "No se pudo cargar el catálogo.",
      },
      {
        status: 500,
      },
    );
  }
}