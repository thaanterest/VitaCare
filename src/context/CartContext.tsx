"use client";

import { createContext, useContext, useEffect, useState, startTransition, ReactNode } from "react";

// เก็บแค่รหัสสินค้าและจำนวน ห้ามเก็บราคาเด็ดขาด (ป้องกันการโดนแก้ราคาจากฝั่ง Client)
export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  updateItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // โหลดข้อมูลจาก LocalStorage ตอนเปิดเว็บ
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aquavita_cart");
      if (saved) {
        startTransition(() => {
          setItems(JSON.parse(saved));
        });
      }
    } catch (e) {
      console.error("Failed to load cart from local storage", e);
    }
    setIsLoaded(true);
  }, []);

  // บันทึกลง LocalStorage ทุกครั้งที่ตะกร้าเปลี่ยน
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("aquavita_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const updateItem = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateItem, removeItem, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
