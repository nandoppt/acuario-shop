"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { CartItem } from "@/lib/cart/cart-types";
import type { CatalogProduct } from "@/types/catalog";

type CartContextValue = {
  items: CartItem[];
  products: CatalogProduct[];
  itemCount: number;
  subtotal: number;

  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(
  undefined,
);

const STORAGE_KEY = "vidabajoagua-cart";

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  /*
   * Cargar carrito guardado
   */
  useEffect(() => {
    try {
      const storedCart =
        localStorage.getItem(STORAGE_KEY);

      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);

        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  /*
   * Cargar catálogo real desde Supabase
   */
  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(
          "/api/catalog/products",
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            "No se pudo cargar el catálogo.",
          );
        }

        const data =
          (await response.json()) as CatalogProduct[];

        setProducts(data);
      } catch (error) {
        console.error(
          "Error cargando productos:",
          error,
        );
      }
    }

    loadProducts();
  }, []);

  /*
   * Guardar carrito
   */
  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items),
    );
  }, [items, isHydrated]);

  /*
   * Agregar producto
   */
  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      const product = products.find(
        (item) => item.id === productId,
      );

      const stock =
        product?.inventory?.quantity ?? 0;

      if (!product || stock <= 0) {
        return;
      }

      setItems((currentItems) => {
        const existingItem = currentItems.find(
          (item) => item.productId === productId,
        );

        if (!existingItem) {
          return [
            ...currentItems,
            {
              productId,
              quantity: Math.min(
                quantity,
                stock,
              ),
            },
          ];
        }

        return currentItems.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  stock,
                ),
              }
            : item,
        );
      });
    },
    [products],
  );

  /*
   * Eliminar producto
   */
  const removeItem = useCallback(
    (productId: string) => {
      setItems((currentItems) =>
        currentItems.filter(
          (item) =>
            item.productId !== productId,
        ),
      );
    },
    [],
  );

  /*
   * Actualizar cantidad
   */
  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const product = products.find(
        (item) => item.id === productId,
      );

      const stock =
        product?.inventory?.quantity ?? 0;

      if (!product) {
        return;
      }

      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      setItems((currentItems) =>
        currentItems.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.min(
                  quantity,
                  stock,
                ),
              }
            : item,
        ),
      );
    },
    [products, removeItem],
  );

  /*
   * Vaciar carrito
   */
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  /*
   * Productos que realmente están en el carrito
   */
  const cartProducts = useMemo(() => {
    return items
      .map((item) =>
        products.find(
          (product) =>
            product.id === item.productId,
        ),
      )
      .filter(
        (
          product,
        ): product is CatalogProduct =>
          Boolean(product),
      );
  }, [items, products]);

  /*
   * Cantidad total
   */
  const itemCount = useMemo(() => {
    return items.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );
  }, [items]);

  /*
   * Subtotal
   */
  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => {
        const product = products.find(
          (product) =>
            product.id === item.productId,
        );

        if (!product) {
          return total;
        }

        return (
          total +
          product.price * item.quantity
        );
      },
      0,
    );
  }, [items, products]);

  const value = useMemo(
    () => ({
      items,
      products: cartProducts,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      cartProducts,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe utilizarse dentro de CartProvider",
    );
  }

  return context;
}