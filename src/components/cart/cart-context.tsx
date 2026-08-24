"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  mockProducts,
  type Product,
} from "@/lib/catalog/mock-products";

import type { CartItem } from "@/lib/cart/cart-types";

type CartContextValue = {
  items: CartItem[];
  products: Product[];
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
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(STORAGE_KEY);

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

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items),
    );
  }, [items, isHydrated]);

  const addItem = useCallback(
    (productId: string, quantity = 1) => {
      const product = mockProducts.find(
        (item) => item.id === productId,
      );

      if (!product || product.stock <= 0) {
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
              quantity: Math.min(quantity, product.stock),
            },
          ];
        }

        return currentItems.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + quantity,
                  product.stock,
                ),
              }
            : item,
        );
      });
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((currentItems) =>
      currentItems.filter(
        (item) => item.productId !== productId,
      ),
    );
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const product = mockProducts.find(
        (item) => item.id === productId,
      );

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
                  product.stock,
                ),
              }
            : item,
        ),
      );
    },
    [removeItem],
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const products = useMemo(() => {
    return items
      .map((item) =>
        mockProducts.find(
          (product) => product.id === item.productId,
        ),
      )
      .filter((product): product is Product => Boolean(product));
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => {
      const product = mockProducts.find(
        (product) => product.id === item.productId,
      );

      if (!product) {
        return total;
      }

      return total + product.price * item.quantity;
    }, 0);
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      products,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      products,
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